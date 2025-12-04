import Progress from '../models/Progress.js';
import User from '../models/User.js';

// Get global leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { topic } = req.query;

    // Get top users with their progress
    const leaderboard = await Progress.find()
      .populate('userId', 'username email avatar')
      .limit(100) // Top 100 (we'll sort in-memory)
      .select('userId stackScore arrayScore stackMissionScore arrayMissionScore stackOverallScore arrayOverallScore totalScore missionTotalScore xp currentLevel streak quizAttempts missionsCompleted');

    // Helper function to calculate level from XP (must stay in sync with Progress model)
    const calculateLevel = (xp = 0) => {
      const normalizedXP = Math.max(0, xp);

      if (normalizedXP < 100) {
        return 1;
      }

      return Math.floor((normalizedXP - 100) / 200) + 2;
    };

    // Choose base score for ranking:
    // - If topic filter is applied, use that topic's overall score (quiz + mission)
    // - Otherwise, use global totalScore (best Stack + best Array)
    const getRankingScore = (item) => {
      if (topic === 'Stack') {
        return (
          item.stackOverallScore ||
          ((item.stackScore || 0) + (item.stackMissionScore || 0))
        );
      }
      if (topic === 'Array') {
        return (
          item.arrayOverallScore ||
          ((item.arrayScore || 0) + (item.arrayMissionScore || 0))
        );
      }
      // Global: combined best scores for all topics
      return item.totalScore || 0;
    };

    // Sort in memory: highest score first, then highest level, then highest XP
    const sortedLeaderboard = leaderboard
      .filter((item) => item.userId) // Remove deleted users
      .sort((a, b) => {
        const scoreA = getRankingScore(a);
        const scoreB = getRankingScore(b);

        if (scoreB !== scoreA) {
          return scoreB - scoreA; // higher score first
        }

        // Tie-breaker: level (using stored or calculated)
        const levelA = a.currentLevel || calculateLevel(a.xp || 0);
        const levelB = b.currentLevel || calculateLevel(b.xp || 0);

        if (levelB !== levelA) {
          return levelB - levelA; // higher level first
        }

        // Final tie-breaker: XP
        const xpA = a.xp || 0;
        const xpB = b.xp || 0;
        return xpB - xpA;
      });

    // Format response with gamification data
    const formattedLeaderboard = sortedLeaderboard
      .map((item, index) => {
        const xp = item.xp || 0;
        const calculatedLevel = calculateLevel(xp);
        // Use stored level if it exists and is higher, otherwise use calculated
        const level =
          item.currentLevel && item.currentLevel > calculatedLevel
            ? item.currentLevel
            : calculatedLevel;

        const quizAttempts = item.quizAttempts || [];
        const missionsCompleted = item.missionsCompleted || [];

        const stackQuizzes = quizAttempts.filter((q) => q.topic === 'Stack').length;
        const arrayQuizzes = quizAttempts.filter((q) => q.topic === 'Array').length;

        const stackMissions = missionsCompleted.filter((m) => m.topic === 'Stack').length;
        const arrayMissions = missionsCompleted.filter((m) => m.topic === 'Array').length;

        return {
          rank: index + 1,
          username: item.userId.username,
          avatar: item.userId.avatar || '',
          stackScore: item.stackScore || 0,
          arrayScore: item.arrayScore || 0,
          stackMissionScore: item.stackMissionScore || 0,
          arrayMissionScore: item.arrayMissionScore || 0,
          stackOverallScore: item.stackOverallScore || ((item.stackScore || 0) + (item.stackMissionScore || 0)),
          arrayOverallScore: item.arrayOverallScore || ((item.arrayScore || 0) + (item.arrayMissionScore || 0)),
          missionTotal: item.missionTotalScore || ((item.stackMissionScore || 0) + (item.arrayMissionScore || 0)),
          total: item.totalScore || 0,
          xp: xp,
          level: level,
          streak: item.streak || 0,
          // quiz & story mission stats
          totalQuizzes: quizAttempts.length,
          stackQuizzes,
          arrayQuizzes,
          totalMissions: missionsCompleted.length,
          stackMissions,
          arrayMissions,
        };
      });

    res.status(200).json({
      success: true,
      data: formattedLeaderboard,
      totalPlayers: formattedLeaderboard.length,
      message: formattedLeaderboard.length === 0 
        ? 'No players yet. Be the first to complete a quiz!'
        : `${formattedLeaderboard.length} ${formattedLeaderboard.length === 1 ? 'player' : 'players'} competing`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
};

// Update user score (called after quiz completion)
export const updateScore = async (req, res) => {
  try {
    const { topic, score, maxScore, timeTaken } = req.body;
    const userId = req.user.id;

    if (!topic || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topic and score'
      });
    }

    // Find or create progress
    let progress = await Progress.findOne({ userId: userId });

    if (!progress) {
      // Create new progress document
      progress = new Progress({ userId: userId });
      await progress.save();
    }

    // Add quiz attempt (for history tracking)
    progress.quizAttempts.push({
      topic,
      score,
      maxScore: maxScore || 10,
      timeTaken: timeTaken || 0
    });

    // Update last activity
    progress.lastActivityDate = new Date();

    // Calculate XP (10 points per correct answer) - cumulative for XP only
    const correctAnswers = score;
    progress.xp += correctAnswers * 10;
    
    // Note: stackScore and arrayScore are now calculated automatically in pre-save hook
    // based on best scores from all quiz attempts and missions (not cumulative)

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Score updated successfully',
      data: {
        stackScore: progress.stackScore,
        arrayScore: progress.arrayScore,
        stackMissionScore: progress.stackMissionScore,
        arrayMissionScore: progress.arrayMissionScore,
        stackOverallScore: progress.stackOverallScore,
        arrayOverallScore: progress.arrayOverallScore,
        totalScore: progress.totalScore,
        missionTotalScore: progress.missionTotalScore,
        xp: progress.xp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update score',
      error: error.message
    });
  }
};

// Update story mission score (called after story mission completion)
export const updateMissionScore = async (req, res) => {
  try {
    const { topic, score, maxScore } = req.body;
    const userId = req.user.id;

    if (!topic || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topic and score'
      });
    }

    // Find or create progress
    let progress = await Progress.findOne({ userId: userId });

    if (!progress) {
      progress = new Progress({ userId: userId });
      await progress.save();
    }

    // Add story mission completion with score (for history tracking)
    progress.missionsCompleted.push({
      topic,
      score,
      maxScore: maxScore || 10
    });

    // Update last activity
    progress.lastActivityDate = new Date();

    // Calculate XP (10 points per correct answer in story mission) - cumulative for XP only
    const correctAnswers = score;
    progress.xp += correctAnswers * 10;

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Story mission score updated successfully',
      data: {
        stackScore: progress.stackScore,
        arrayScore: progress.arrayScore,
        stackMissionScore: progress.stackMissionScore,
        arrayMissionScore: progress.arrayMissionScore,
        stackOverallScore: progress.stackOverallScore,
        arrayOverallScore: progress.arrayOverallScore,
        totalScore: progress.totalScore,
        missionTotalScore: progress.missionTotalScore,
        xp: progress.xp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update story mission score',
      error: error.message
    });
  }
};

// Get user's progress
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = await Progress.create({ userId });
    }

    // Calculate stats
    const quizAttempts = progress.quizAttempts || [];
    const missionsCompleted = progress.missionsCompleted || [];
    
    const stackQuizzes = quizAttempts.filter((q) => q.topic === 'Stack').length;
    const arrayQuizzes = quizAttempts.filter((q) => q.topic === 'Array').length;
    const stackMissions = missionsCompleted.filter((m) => m.topic === 'Stack').length;
    const arrayMissions = missionsCompleted.filter((m) => m.topic === 'Array').length;

    res.status(200).json({
      success: true,
      data: {
        stackScore: progress.stackScore,
        arrayScore: progress.arrayScore,
        stackMissionScore: progress.stackMissionScore,
        arrayMissionScore: progress.arrayMissionScore,
        totalScore: progress.totalScore,
        stackOverallScore: progress.stackOverallScore,
        arrayOverallScore: progress.arrayOverallScore,
        missionTotalScore: progress.missionTotalScore,
        xp: progress.xp,
        streak: progress.streak,
        currentLevel: progress.currentLevel,
        totalQuizzes: quizAttempts.length,
        stackQuizzes,
        arrayQuizzes,
        totalMissions: missionsCompleted.length,
        stackMissions,
        arrayMissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get progress',
      error: error.message
    });
  }
};

