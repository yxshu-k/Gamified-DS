# Environment Variables Setup

## ✅ Your MongoDB Connection String

I've updated the `env.example` file with your MongoDB credentials. Now you need to create the actual `.env` file.

## 📝 Step-by-Step Instructions

### 1. Create Backend .env File

1. Navigate to `backend-starter` folder:
   ```bash
   cd backend-starter
   ```

2. Copy the example file:
   ```bash
   # Windows
   copy env.example .env
   
   # Mac/Linux
   cp env.example .env
   ```

3. The `.env` file should now contain:
   ```env
   MONGODB_URI=mongodb+srv://yakshithakambala_db_user:x3FS5W59ylcCqgm3@cluster0.z61gehk.mongodb.net/gamified-ds?retryWrites=true&w=majority
   ```

### 2. Create Frontend .env File (Optional)

If you haven't created it yet, create a `.env` file in the **root directory** (same level as `package.json`):

```env
VITE_API_URL=http://localhost:5000/api
```

## 🔐 Your MongoDB Credentials

- **Username**: `yakshithakambala_db_user`
- **Password**: `x3FS5W59ylcCqgm3`
- **Cluster**: `cluster0.z61gehk.mongodb.net`
- **Database**: `gamified-ds`

## ✅ Verify Connection

After creating the `.env` file:

1. Start your backend:
   ```bash
   cd backend-starter
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB connected successfully
   🚀 Server running on port 5000
   ```

3. If you see connection errors, check:
   - Your MongoDB Atlas network access allows your IP
   - The connection string is correct
   - The database name is `gamified-ds`

## 🚨 Security Note

- **Never commit `.env` files to Git**
- The `.env` file is already in `.gitignore`
- Keep your credentials secure

## 📋 Complete .env File Content

### Backend (`backend-starter/.env`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://yakshithakambala_db_user:x3FS5W59ylcCqgm3@cluster0.z61gehk.mongodb.net/gamified-ds?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (root `.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

**You're all set!** 🎉 Start your backend and it should connect to MongoDB Atlas.

