# Backend Architecture Ideas for Gamified Data Structures Platform (MERN Stack)

## 🎯 Project Overview
A gamified learning platform for data structures (Stack, Array, and more) with quizzes, code challenges, interactive simulations, missions, and leaderboards.

---

## 📋 Backend Features to Implement

### 1. **User Authentication & Management**
- User registration/login (JWT-based)
- Password hashing (bcrypt)
- Email verification (optional)
- Password reset functionality
- User profiles with avatars
- Role-based access (Student, Admin, Instructor)

### 2. **Progress Tracking System**
- Track user progress per topic (Stack, Array, etc.)
- Store quiz scores and attempts
- Track code challenge completions
- Mission completion status
- Learning streaks and daily goals
- Time spent on each topic

### 3. **Leaderboard System**
- Global leaderboard
- Topic-specific leaderboards (Stack, Array)
- Weekly/Monthly leaderboards
- User rankings and badges
- Achievement system

### 4. **Content Management**
- Dynamic question bank (move from JSON to DB)
- Code challenge management
- Mission/story content management
- Admin panel for content CRUD operations
- Question difficulty levels
- Question categories and tags

### 5. **Code Execution & Validation**
- Code execution service (sandboxed)
- Test case validation for code challenges
- Real-time code checking
- Support for multiple languages (JavaScript, Python, Java)
- Code submission history

### 6. **Gamification Features**
- Points/XP system
- Badges and achievements
- Level progression
- Unlockable content
- Daily challenges
- Streak tracking

### 7. **Analytics & Reporting**
- User performance analytics
- Most difficult questions
- Topic completion rates
- Time-to-complete metrics
- Admin dashboards

---

## 🗄️ Database Schema (MongoDB)

### **User Model**
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (URL),
  role: String (enum: ['student', 'admin']),
  createdAt: Date,
  updatedAt: Date,
  isVerified: Boolean,
  preferences: {
    theme: String,
    notifications: Boolean
  }
}
```

### **Progress Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  topic: String (enum: ['Stack', 'Array', 'Queue', ...]),
  totalScore: Number,
  quizScores: [{
    quizId: ObjectId,
    score: Number,
    maxScore: Number,
    completedAt: Date,
    timeTaken: Number
  }],
  codeChallengesCompleted: [ObjectId],
  missionsCompleted: [ObjectId],
  currentLevel: Number,
  xp: Number,
  streak: Number,
  lastActivityDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Question Model**
```javascript
{
  _id: ObjectId,
  topic: String (required),
  question: String (required),
  options: [String] (required),
  correctAnswer: String (required),
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  explanation: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (ref: User)
}
```

### **CodeChallenge Model**
```javascript
{
  _id: ObjectId,
  topic: String (required),
  title: String (required),
  description: String,
  starterCode: String,
  solution: String,
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: Boolean
  }],
  difficulty: String,
  points: Number,
  hints: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### **Mission Model**
```javascript
{
  _id: ObjectId,
  topic: String (required),
  title: String (required),
  description: String,
  story: String,
  objectives: [String],
  rewards: {
    xp: Number,
    badge: String
  },
  prerequisites: [ObjectId],
  order: Number,
  createdAt: Date
}
```

### **Leaderboard Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  username: String,
  topic: String,
  totalScore: Number,
  stackScore: Number,
  arrayScore: Number,
  rank: Number,
  lastUpdated: Date
}
```

### **Submission Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  challengeId: ObjectId (ref: CodeChallenge),
  code: String,
  language: String,
  status: String (enum: ['pending', 'passed', 'failed']),
  testResults: [{
    testCase: ObjectId,
    passed: Boolean,
    output: String,
    error: String
  }],
  submittedAt: Date
}
```

### **Achievement Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  achievementType: String (enum: ['first_quiz', 'perfect_score', 'streak_7', ...]),
  unlockedAt: Date,
  badge: String
}
```

---

## 🛠️ API Endpoints Structure

### **Authentication Routes** (`/api/auth`)
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
GET    /api/auth/verify/:token     - Verify email
GET    /api/auth/me                - Get current user
```

### **User Routes** (`/api/users`)
```
GET    /api/users                  - Get all users (admin)
GET    /api/users/:id              - Get user by ID
PUT    /api/users/:id              - Update user profile
DELETE /api/users/:id              - Delete user (admin)
GET    /api/users/:id/progress     - Get user progress
GET    /api/users/:id/achievements - Get user achievements
```

### **Progress Routes** (`/api/progress`)
```
GET    /api/progress               - Get current user's progress
GET    /api/progress/:topic        - Get progress for specific topic
POST   /api/progress/quiz          - Submit quiz score
POST   /api/progress/challenge     - Submit code challenge completion
POST   /api/progress/mission       - Complete mission
PUT    /api/progress/streak        - Update daily streak
```

### **Question Routes** (`/api/questions`)
```
GET    /api/questions              - Get all questions (with filters)
GET    /api/questions/:topic       - Get questions by topic
GET    /api/questions/:id          - Get single question
POST   /api/questions              - Create question (admin)
PUT    /api/questions/:id          - Update question (admin)
DELETE /api/questions/:id          - Delete question (admin)
GET    /api/questions/random/:topic - Get random questions for quiz
```

### **Code Challenge Routes** (`/api/challenges`)
```
GET    /api/challenges             - Get all challenges
GET    /api/challenges/:topic      - Get challenges by topic
GET    /api/challenges/:id         - Get single challenge
POST   /api/challenges              - Create challenge (admin)
PUT    /api/challenges/:id          - Update challenge (admin)
DELETE /api/challenges/:id          - Delete challenge (admin)
POST   /api/challenges/:id/submit   - Submit code solution
GET    /api/challenges/:id/submissions - Get user's submissions
```

### **Mission Routes** (`/api/missions`)
```
GET    /api/missions               - Get all missions
GET    /api/missions/:topic        - Get missions by topic
GET    /api/missions/:id           - Get single mission
POST   /api/missions                - Create mission (admin)
PUT    /api/missions/:id            - Update mission (admin)
DELETE /api/missions/:id           - Delete mission (admin)
```

### **Leaderboard Routes** (`/api/leaderboard`)
```
GET    /api/leaderboard            - Get global leaderboard
GET    /api/leaderboard/:topic     - Get topic-specific leaderboard
GET    /api/leaderboard/weekly     - Get weekly leaderboard
GET    /api/leaderboard/monthly    - Get monthly leaderboard
GET    /api/leaderboard/user/:id   - Get user's rank
```

### **Submission Routes** (`/api/submissions`)
```
GET    /api/submissions            - Get user's submissions
GET    /api/submissions/:id        - Get submission details
POST   /api/submissions            - Create new submission
GET    /api/submissions/challenge/:challengeId - Get submissions for challenge
```

### **Analytics Routes** (`/api/analytics`) - Admin only
```
GET    /api/analytics/users         - User statistics
GET    /api/analytics/questions     - Question performance
GET    /api/analytics/topics        - Topic completion rates
GET    /api/analytics/challenges    - Challenge completion stats
```

---

## 🏗️ Backend Folder Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── jwt.js               # JWT configuration
│   └── cloudinary.js        # Image upload (if needed)
├── models/
│   ├── User.js
│   ├── Progress.js
│   ├── Question.js
│   ├── CodeChallenge.js
│   ├── Mission.js
│   ├── Leaderboard.js
│   ├── Submission.js
│   └── Achievement.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── progress.routes.js
│   ├── question.routes.js
│   ├── challenge.routes.js
│   ├── mission.routes.js
│   ├── leaderboard.routes.js
│   ├── submission.routes.js
│   └── analytics.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── progress.controller.js
│   ├── question.controller.js
│   ├── challenge.controller.js
│   ├── mission.controller.js
│   ├── leaderboard.controller.js
│   ├── submission.controller.js
│   └── analytics.controller.js
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── admin.middleware.js   # Admin role check
│   ├── error.middleware.js   # Error handling
│   └── validation.middleware.js # Input validation
├── services/
│   ├── codeExecution.service.js  # Code execution service
│   ├── leaderboard.service.js   # Leaderboard calculation
│   ├── email.service.js         # Email sending
│   └── achievement.service.js   # Achievement unlocking
├── utils/
│   ├── validators.js
│   ├── helpers.js
│   └── constants.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## 🔧 Technology Stack

### **Core**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### **Authentication & Security**
- **jsonwebtoken** - JWT tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### **Code Execution** (Choose one)
- **Docker** + **Node.js** - Sandboxed execution
- **Judge0 API** - Online code execution service
- **Piston API** - Code execution API
- **Custom VM** - Using `vm2` or `isolated-vm`

### **Additional Tools**
- **nodemailer** - Email service
- **multer** - File uploads
- **dotenv** - Environment variables
- **morgan** - HTTP request logger
- **winston** - Logging

---

## 🚀 Implementation Steps

### **Phase 1: Setup & Authentication**
1. Initialize Express server
2. Connect MongoDB
3. Set up authentication (register/login)
4. JWT middleware
5. User model and routes

### **Phase 2: Core Features**
1. Question management (CRUD)
2. Progress tracking
3. Quiz submission
4. Basic leaderboard

### **Phase 3: Advanced Features**
1. Code challenge execution
2. Mission system
3. Achievement system
4. Enhanced leaderboards

### **Phase 4: Analytics & Admin**
1. Admin panel APIs
2. Analytics endpoints
3. Content management
4. User management

### **Phase 5: Optimization**
1. Caching (Redis)
2. Rate limiting
3. Performance optimization
4. Testing

---

## 📦 Package.json Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-validator": "^7.0.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.4",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
```

---

## 🔐 Security Considerations

1. **Password Security**: Use bcrypt with salt rounds (10-12)
2. **JWT Tokens**: Set expiration (15min access, 7days refresh)
3. **Input Validation**: Validate all user inputs
4. **SQL Injection**: Use parameterized queries (Mongoose handles this)
5. **XSS Protection**: Sanitize user inputs
6. **Rate Limiting**: Limit API requests per IP
7. **CORS**: Configure allowed origins
8. **Code Execution**: Sandbox all code execution
9. **Environment Variables**: Never commit secrets
10. **HTTPS**: Use HTTPS in production

---

## 🎯 Key Features to Prioritize

### **Must Have (MVP)**
1. User authentication
2. Progress tracking
3. Quiz submission & scoring
4. Basic leaderboard
5. Question management

### **Should Have**
1. Code challenge execution
2. Mission system
3. Achievement badges
4. User profiles

### **Nice to Have**
1. Real-time leaderboard updates
2. Social features (friends, sharing)
3. Advanced analytics
4. Multi-language support
5. Mobile app API

---

## 📝 Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gamified-ds
# or
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gamified-ds

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (for password reset, etc.)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Code Execution Service
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Cloud Storage (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🔄 Integration with Frontend

### **API Base URL**
```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

### **Example API Calls from Frontend**

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Submit Quiz Score
const response = await fetch('http://localhost:5000/api/progress/quiz', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topic: 'Stack',
    score: 8,
    maxScore: 10,
    timeTaken: 300
  })
});

// Get Leaderboard
const response = await fetch('http://localhost:5000/api/leaderboard/Stack', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 📊 Database Indexes (Performance)

```javascript
// User model
User.index({ email: 1 });
User.index({ username: 1 });

// Progress model
Progress.index({ userId: 1, topic: 1 });
Progress.index({ userId: 1, 'quizScores.completedAt': -1 });

// Leaderboard model
Leaderboard.index({ topic: 1, totalScore: -1 });
Leaderboard.index({ userId: 1 });

// Question model
Question.index({ topic: 1, difficulty: 1 });
Question.index({ tags: 1 });
```

---

## 🎓 Next Steps

1. **Set up backend folder structure**
2. **Initialize Express server**
3. **Connect MongoDB**
4. **Create User model and authentication**
5. **Migrate JSON data to MongoDB**
6. **Implement progress tracking**
7. **Build leaderboard system**
8. **Add code execution service**
9. **Create admin APIs**
10. **Deploy backend (Heroku, Railway, Render, etc.)**

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Best Practices](https://github.com/auth0/node-jsonwebtoken)
- [MongoDB Indexing](https://www.mongodb.com/docs/manual/indexes/)
- [Code Execution Services](https://judge0.com/)

---

**Ready to start building?** 🚀

This architecture provides a solid foundation for scaling your gamified learning platform. Start with the MVP features and gradually add advanced functionality.

