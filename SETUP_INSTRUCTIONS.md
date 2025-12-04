# Step-by-Step Setup Instructions

## 🎯 Complete Setup Guide for Backend + Frontend Connection

Follow these steps in order to get everything working!

---

## 📋 Prerequisites

- Node.js installed (v16 or higher)
- MongoDB set up (see `MONGODB_SETUP_GUIDE.md`)
- Code editor (VS Code recommended)

---

## 🔧 Step 1: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Follow the detailed guide in `MONGODB_SETUP_GUIDE.md`
2. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/gamified-ds`)
3. Save it for Step 3

### Option B: Local MongoDB

1. Install MongoDB on your computer
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017/gamified-ds`

---

## 🚀 Step 2: Set Up Backend

### 2.1 Navigate to Backend Folder

```bash
cd backend-starter
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install:
- Express (web framework)
- Mongoose (MongoDB driver)
- JWT (authentication)
- bcryptjs (password hashing)
- And other dependencies

### 2.3 Create Environment File

1. Copy the example file:
   ```bash
   # Windows
   copy env.example .env
   
   # Mac/Linux
   cp env.example .env
   ```

2. Open `.env` file and fill in:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB - Replace with YOUR connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gamified-ds
# OR for local: mongodb://localhost:27017/gamified-ds

# JWT Secret - Change this to a random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT Expiration
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Change `JWT_SECRET` to a random string (e.g., `mySecretKey123!@#`)

### 2.4 Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 Environment: development
```

**Keep this terminal open!** The server needs to keep running.

---

## 🎨 Step 3: Set Up Frontend

### 3.1 Navigate to Frontend (Root Directory)

Open a **NEW terminal window** (keep backend running):

```bash
# If you're in backend-starter, go back
cd ..

# You should be in: gamified-ds - Copy - Copy
```

### 3.2 Install Frontend Dependencies (if not already)

```bash
npm install
```

### 3.3 Create Environment File for Frontend

Create a file named `.env` in the root directory (same level as `package.json`):

```bash
# Create .env file
touch .env
```

Add this content:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where to find your backend API.

### 3.4 Start Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## ✅ Step 4: Test the Connection

### 4.1 Test Backend

1. Open browser and go to: `http://localhost:5000/api/health`
2. You should see:
   ```json
   {
     "status": "OK",
     "message": "Gamified DS Backend API is running",
     "timestamp": "..."
   }
   ```

### 4.2 Test Frontend

1. Go to: `http://localhost:5173`
2. Click on **"Login"** in the navbar
3. You should see the login/register form

### 4.3 Test Registration

1. Click **"Don't have an account? Sign up"**
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **"Create Account"**
4. You should be redirected to home page
5. Check your navbar - you should see your username!

### 4.4 Test Leaderboard

1. Click **"Leaderboard"** in navbar
2. You should see the leaderboard (might be empty if no users yet)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "MongoDB connection error"**
- ✅ Check your `MONGODB_URI` in `.env`
- ✅ Make sure MongoDB is running (for local) or accessible (for Atlas)
- ✅ Check network access in Atlas (should allow all IPs for development)

**Problem: "Port 5000 already in use"**
- ✅ Change `PORT=5001` in `.env` (and update frontend `.env` too)

**Problem: "Cannot find module"**
- ✅ Run `npm install` again in `backend-starter` folder

### Frontend Issues

**Problem: "Failed to fetch" or CORS error**
- ✅ Make sure backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Check `FRONTEND_URL` in backend `.env`

**Problem: "Login/Register not working"**
- ✅ Check browser console (F12) for errors
- ✅ Make sure backend is running
- ✅ Check network tab to see API calls

**Problem: "Leaderboard shows no data"**
- ✅ This is normal if no users have completed quizzes yet
- ✅ Try registering a new account and completing a quiz

---

## 📝 Next Steps

### To Connect Quiz Scores to Backend:

1. After a user completes a quiz, call:
   ```javascript
   import { leaderboardAPI } from '../utils/api';
   
   await leaderboardAPI.updateScore('Stack', score, 10, timeTaken);
   ```

2. Update your `QuizSection.jsx` to call this after quiz submission

### To Add More Features:

- See `BACKEND_IDEAS.md` for complete API structure
- Add more routes in `backend-starter/routes/`
- Add more models in `backend-starter/models/`

---

## 📚 File Structure Summary

```
gamified-ds/
├── backend-starter/          # Backend folder
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth middleware
│   ├── server.js             # Main server file
│   ├── package.json
│   └── .env                  # Backend environment variables
│
├── src/                      # Frontend folder
│   ├── pages/
│   │   ├── Login.jsx         # Login/Register page
│   │   └── leaderboard.jsx   # Leaderboard page
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── utils/
│   │   └── api.js            # API utility functions
│   └── components/
│       └── Navbar.jsx         # Updated navbar
│
└── .env                      # Frontend environment variables
```

---

## 🎉 You're All Set!

Your backend and frontend are now connected! 

**What works now:**
- ✅ User registration
- ✅ User login
- ✅ Authentication (JWT tokens)
- ✅ Leaderboard (fetches from backend)
- ✅ User info in navbar

**What to do next:**
- Connect quiz scores to update leaderboard
- Add more features from `BACKEND_IDEAS.md`

---

## 💡 Tips

1. **Always keep backend running** when testing frontend
2. **Check terminal** for error messages
3. **Use browser console** (F12) to debug frontend
4. **Check network tab** to see API requests/responses

---

**Need Help?** Check the error messages in your terminal or browser console!

