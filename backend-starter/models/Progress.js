import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One progress document per user
  },
  stackScore: {
    type: Number,
    default: 0
  },
  stackMissionScore: {
    type: Number,
    default: 0
  },
  arrayScore: {
    type: Number,
    default: 0
  },
  arrayMissionScore: {
    type: Number,
    default: 0
  },
  stackOverallScore: {
    type: Number,
    default: 0
  },
  arrayOverallScore: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  missionTotalScore: {
    type: Number,
    default: 0
  },
  quizAttempts: [{
    topic: String,
    score: Number,
    maxScore: Number,
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: Number // in seconds
  }],
  codeChallengesCompleted: [{
    challengeId: mongoose.Schema.Types.ObjectId,
    topic: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  missionsCompleted: [{
    missionId: mongoose.Schema.Types.ObjectId,
    topic: String,
    score: Number,
    maxScore: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentLevel: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate level from XP using explicit thresholds:
// Level 1:   0   - 99 XP
// Level 2:   100 - 299 XP
// Level 3:   300 - 499 XP
// Level 4:   500 - 699 XP
// ... and so on (each new level requires +200 XP)
progressSchema.methods.calculateLevel = function() {
  const normalizedXP = Math.max(0, this.xp);

  if (normalizedXP < 100) {
    return 1;
  }

  // From 100 XP onwards, every additional 200 XP grants a new level
  return Math.floor((normalizedXP - 100) / 200) + 2;
};

// Update scores and level before saving
progressSchema.pre('save', function(next) {
  // Calculate best scores from quiz attempts and missions
  const quizAttempts = this.quizAttempts || [];
  const missionsCompleted = this.missionsCompleted || [];
  
  // Find best scores from quiz attempts
  let stackQuizBest = 0;
  let arrayQuizBest = 0;
  quizAttempts.forEach(attempt => {
    if (attempt.topic === 'Stack') {
      stackQuizBest = Math.max(stackQuizBest, attempt.score || 0);
    } else if (attempt.topic === 'Array') {
      arrayQuizBest = Math.max(arrayQuizBest, attempt.score || 0);
    }
  });
  
  // Find best scores from story missions
  let stackMissionBest = 0;
  let arrayMissionBest = 0;
  missionsCompleted.forEach(mission => {
    if (mission.topic === 'Stack') {
      stackMissionBest = Math.max(stackMissionBest, mission.score || 0);
    } else if (mission.topic === 'Array') {
      arrayMissionBest = Math.max(arrayMissionBest, mission.score || 0);
    }
  });
  
  // Update topic quiz scores (best quiz results only)
  this.stackScore = stackQuizBest;
  this.arrayScore = arrayQuizBest;

  // Store mission best scores separately
  this.stackMissionScore = stackMissionBest;
  this.arrayMissionScore = arrayMissionBest;
  this.missionTotalScore = this.stackMissionScore + this.arrayMissionScore;

  // Calculate overall scores (quiz + mission best per topic)
  this.stackOverallScore = this.stackScore + this.stackMissionScore;
  this.arrayOverallScore = this.arrayScore + this.arrayMissionScore;
  this.totalScore = this.stackOverallScore + this.arrayOverallScore;
  
  // Update level based on XP
  const calculatedLevel = this.calculateLevel();
  if (calculatedLevel > this.currentLevel) {
    this.currentLevel = calculatedLevel;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
progressSchema.index({ userId: 1 });
progressSchema.index({ totalScore: -1 });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;

