# 🚀 How to Run the Application

## 📋 Prerequisites

- Node.js installed (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Code editor (VS Code recommended)

---

## 🔧 Step 1: Set Up Backend

### 1.1 Navigate to Backend Folder

Open terminal/command prompt and navigate to the backend folder:

```bash
cd backend-starter
```

### 1.2 Install Dependencies

```bash
npm install
```

This will install all required packages (Express, Mongoose, JWT, etc.)

### 1.3 Create .env File

Create a `.env` file in the `backend-starter` folder:

**Windows:**
```bash
copy env.example .env
```

**Mac/Linux:**
```bash
cp env.example .env
```

### 1.4 Configure .env File

Open the `.env` file and make sure it has your MongoDB connection string:

```env
PORT=5000
NODE_ENV=development

# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://yakshithakambala_db_user:x3FS5W59ylcCqgm3@cluster0.z61gehk.mongodb.net/gamified-ds?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

### 1.5 Start Backend Server

```bash
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 Environment: development
```

**✅ Keep this terminal open!** The backend needs to keep running.

---

## 🎨 Step 2: Set Up Frontend

### 2.1 Open New Terminal

Open a **NEW terminal window** (keep the backend terminal running).

Navigate to the **root directory** (where `package.json` is):

```bash
# If you're in backend-starter, go back
cd ..

# You should be in: gamified-ds - Copy - Copy
```

### 2.2 Install Frontend Dependencies (if not already)

```bash
npm install
```

### 2.3 Create Frontend .env File

Create a `.env` file in the **root directory** (same level as `package.json`):

**Windows:**
```bash
echo VITE_API_URL=http://localhost:5000/api > .env
```

**Mac/Linux:**
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

Or manually create `.env` file with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2.4 Start Frontend Server

```bash
npm run dev
```

**You should see:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Step 3: Verify Everything Works

### 3.1 Test Backend

1. Open browser
2. Go to: `http://localhost:5000/api/health`
3. You should see:
   ```json
   {
     "status": "OK",
     "message": "Gamified DS Backend API is running",
     "timestamp": "..."
   }
   ```

### 3.2 Test Frontend

1. Go to: `http://localhost:5173`
2. You should see the homepage
3. Click **"Login"** in the navbar
4. You should see the login/register form

### 3.3 Test Registration

1. Click **"Don't have an account? Sign up"**
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **"Create Account"**
4. You should be redirected to home page
5. Check navbar - you should see your username!

### 3.4 Test Leaderboard

1. Click **"Leaderboard"** in navbar
2. You should see the gamified leaderboard
3. It might be empty if no users have scores yet

---

## 🎯 Quick Start Commands

### Terminal 1 (Backend):
```bash
cd backend-starter
npm install
# Create .env file (copy from env.example)
npm run dev
```

### Terminal 2 (Frontend):
```bash
# In root directory
npm install
# Create .env file with: VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "MongoDB connection error"**
- ✅ Check your `MONGODB_URI` in `.env` file
- ✅ Make sure MongoDB Atlas network access allows your IP (or `0.0.0.0/0`)
- ✅ Verify the connection string is correct

**Problem: "Port 5000 already in use"**
- ✅ Change `PORT=5001` in `.env`
- ✅ Update frontend `.env` to: `VITE_API_URL=http://localhost:5001/api`
- ✅ Or kill the process using port 5000

**Problem: "Cannot find module"**
- ✅ Run `npm install` again in `backend-starter` folder
- ✅ Check if you're in the correct directory

**Problem: "JWT_SECRET is required"**
- ✅ Make sure `.env` file exists in `backend-starter` folder
- ✅ Check that `JWT_SECRET` is set in `.env`

### Frontend Issues

**Problem: "Failed to fetch" or CORS error**
- ✅ Make sure backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Check `FRONTEND_URL` in backend `.env` (should be `http://localhost:5173`)
- ✅ Restart frontend after changing `.env`

**Problem: "Cannot connect to server"**
- ✅ Make sure backend is running
- ✅ Check backend terminal for errors
- ✅ Verify backend URL in frontend `.env`

**Problem: "Login/Register not working"**
- ✅ Check browser console (F12) for errors
- ✅ Check backend terminal for errors
- ✅ Verify MongoDB connection is working

**Problem: "Leaderboard shows no data"**
- ✅ This is normal if no users have completed quizzes yet
- ✅ Try registering a new account
- ✅ Complete a quiz to see scores

---

## 📁 File Structure Check

Make sure you have:

```
gamified-ds - Copy - Copy/
├── backend-starter/
│   ├── .env                    ← Must exist!
│   ├── package.json
│   ├── server.js
│   └── ...
├── src/
│   ├── pages/
│   ├── components/
│   └── ...
├── .env                         ← Must exist! (root directory)
└── package.json
```

---

## 🎉 Success Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] MongoDB connected successfully
- [ ] Can access `http://localhost:5000/api/health`
- [ ] Can access `http://localhost:5173`
- [ ] Can register a new user
- [ ] Can login
- [ ] Can see leaderboard
- [ ] No errors in console

---

## 🔄 Daily Usage

### To Start the Application:

1. **Terminal 1** - Start backend:
   ```bash
   cd backend-starter
   npm run dev
   ```

2. **Terminal 2** - Start frontend:
   ```bash
   # In root directory
   npm run dev
   ```

3. Open browser: `http://localhost:5173`

### To Stop:

- Press `Ctrl + C` in both terminals

---

## 📚 Next Steps

Once everything is running:

1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Check leaderboard
4. ✅ Complete a quiz (when you connect quiz scores)
5. ✅ See your rank update

---

## 💡 Pro Tips

1. **Keep both terminals open** - Backend and frontend need to run simultaneously
2. **Check terminal output** - Errors will show in the terminal
3. **Use browser console** - Press F12 to see frontend errors
4. **Restart after .env changes** - Restart servers after changing environment variables

---

**You're all set! Happy coding! 🚀**

