# 📊 Leaderboard System - Complete Explanation

## 🎯 How the Leaderboard Scoring System Works

### **1. Score Types & Points System**

The leaderboard tracks **three main score types**:

#### **A. Topic-Specific Scores (Best Score)**
- **`stackScore`**: Best score achieved in Stack quizzes
- **`arrayScore`**: Best score achieved in Array quizzes
- **How it works**: 
  - When you complete a quiz, the system compares your score with your previous best score for that topic
  - Keeps the **highest** one: `Math.max(previousScore, newScore)`
  - Example: If you score 7/10 on Stack quiz and your previous best was 5, your `stackScore` becomes 7

#### **B. Total Score**
- **`totalScore`**: Sum of `stackScore + arrayScore`
- **Formula**: `totalScore = stackScore + arrayScore`
- **Purpose**: Used for ranking when viewing "All Topics" leaderboard
- Example: `stackScore = 7`, `arrayScore = 8` → `totalScore = 15`

#### **C. XP (Experience Points)**
- **`xp`**: Cumulative points earned from ALL quiz attempts
- **Calculation**: `XP += (correctAnswers × 10)` per quiz attempt
  - Example: Score 7/10 → Earn 70 XP
  - Example: Score 5/10 → Earn 50 XP
  - Total XP = 70 + 50 = 120 XP
- **Purpose**: Used to calculate player level (not directly used for ranking)

---

### **2. Level System**

**Level Calculation Formula:**
```javascript
Level = Math.floor(√(XP / 100)) + 1
```

**Examples:**
- **0 XP** → Level 1
- **100 XP** → Level 2 (√(100/100) = 1, floor = 1, +1 = 2)
- **400 XP** → Level 3 (√(400/100) = 2, floor = 2, +1 = 3)
- **900 XP** → Level 4 (√(900/100) = 3, floor = 3, +1 = 4)
- **1600 XP** → Level 5

**XP Progress Bar:**
- Shows progress within current level
- Formula: `(Current XP - XP for current level) / (XP needed for next level) × 100%`

---

### **3. Quiz Score Flow (Step-by-Step)**

#### **When User Completes a Quiz:**

1. **User Submits Quiz**
   - Quiz has 10 questions (randomly selected from question pool)
   - User selects answers for all questions
   - Clicks "Submit" button

2. **Frontend Score Calculation**
   ```javascript
   score = number of correct answers
   // Example: 7 correct out of 10 = score = 7
   ```

3. **Backend Processing** (`POST /api/leaderboard/update-score`)
   - Finds or creates `Progress` document for user
   - Updates topic-specific score: `stackScore = Math.max(stackScore, newScore)`
   - Adds quiz attempt to `quizAttempts` array (for history tracking)
   - Calculates and adds XP: `xp += score × 10`
   - Updates `totalScore` automatically (via mongoose pre-save hook)
   - Updates `currentLevel` if XP increased enough
   - Updates `lastActivityDate`

4. **Leaderboard Display**
   - Fetches all users sorted by selected score type:
     - **All Topics**: Sorted by `totalScore` (descending)
     - **Stack**: Sorted by `stackScore` (descending)
     - **Array**: Sorted by `arrayScore` (descending)
   - Shows top 100 players
   - Displays: rank, username, avatar, scores, level, XP, quiz/mission counts

---

### **4. Points Display Logic**

#### **Why Scores Show as "Points" (not percentages):**

- **Topic Scores** (`stackScore`, `arrayScore`): 
  - Show **raw number of correct answers**
  - Example: `7 pts` means 7 correct answers out of 10
  - Maximum per topic = number of questions (usually 10)

- **Total Score**: 
  - Sum of both topic scores
  - Example: `15 pts` = 7 (Stack) + 8 (Array)
  - Maximum = 20 (if both topics have 10 questions each)

- **XP**: 
  - Separate cumulative system
  - Example: `150 XP` = earned from all quiz attempts
  - No maximum limit (keeps growing)

#### **Leaderboard Display:**
- **Podium (Top 3)**: Shows power score with ⚡ icon (e.g., "⚡ 1,250 pts")
- **Rank 4+**: Shows topic scores and total score
- **Profile Panel**: Shows all stats including quiz/mission counts

---

### **5. Data Storage Structure**

#### **Progress Document (MongoDB)**
```javascript
{
  userId: ObjectId("..."),           // Reference to User
  stackScore: 7,                     // Best Stack quiz score
  arrayScore: 8,                     // Best Array quiz score
  totalScore: 15,                    // Auto-calculated: 7 + 8
  xp: 150,                           // Total XP earned
  currentLevel: 2,                   // Current level
  streak: 0,                         // Consecutive days played
  quizAttempts: [                    // All quiz attempts (history)
    {
      topic: "Stack",
      score: 7,
      maxScore: 10,
      completedAt: Date,
      timeTaken: 0
    },
    {
      topic: "Array",
      score: 8,
      maxScore: 10,
      completedAt: Date,
      timeTaken: 0
    }
  ],
  missionsCompleted: [...],           // Story mission completions
  lastActivityDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

### **6. Quiz vs Story Mission Scoring**

#### **Quizzes:**
- ✅ **Score is saved**: Updates `stackScore`/`arrayScore` (best score kept)
- ✅ **XP is earned**: Adds to total XP (10 per correct answer)
- ✅ **Affects ranking**: Used for leaderboard sorting
- ✅ **History tracked**: All attempts stored in `quizAttempts` array

#### **Story Missions:**
- ❌ **Score NOT saved**: Currently only counts completions
- ❌ **XP NOT earned**: No XP from story missions yet
- ✅ **Count tracked**: Shows in "Story Missions Cleared" stat
- ⚠️ **Future**: Can be added to scoring system

---

### **7. Ranking Algorithm**

1. **Sort by Score** (descending):
   - All Topics → `totalScore`
   - Stack → `stackScore`
   - Array → `arrayScore`

2. **Tie Breaking**:
   - Currently: First come, first served (by MongoDB insertion order)
   - Future: Could add secondary sort by XP or level

3. **Display**:
   - Rank 1-3: Special podium display with medals
   - Rank 4+: List view with detailed stats

---

### **8. Real-Time Updates**

- **Auto-refresh**: Leaderboard refreshes every 30 seconds
- **Manual refresh**: Page reload fetches latest data
- **Score updates**: Immediately visible after quiz submission

---

## 📝 Summary

**Key Points:**
1. **Scores are "best attempt"** - Only highest score per topic is kept
2. **XP is cumulative** - All quiz attempts add XP (10 per correct answer)
3. **Level is calculated** - Based on total XP using square root formula
4. **Total Score** - Simple addition of Stack + Array best scores
5. **Ranking** - Based on selected score type (total, stack, or array)
6. **Story Missions** - Currently only tracked as counts, not scores

---

## 🔄 Example Flow

**User Journey:**
1. User completes Stack quiz → Scores 7/10
2. Backend saves: `stackScore = 7`, `xp += 70`
3. User completes Array quiz → Scores 8/10
4. Backend saves: `arrayScore = 8`, `xp += 80`
5. Total: `totalScore = 15`, `xp = 150`, `level = 2`
6. Leaderboard shows user ranked by totalScore (15 pts)
