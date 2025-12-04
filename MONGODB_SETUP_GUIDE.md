# MongoDB Setup Guide - Step by Step for Beginners

## 🎯 What is MongoDB?

MongoDB is a **NoSQL database** that stores data in flexible, JSON-like documents. Think of it like a digital filing cabinet where you can store information about users, scores, questions, etc.

---

## 📦 Option 1: MongoDB Atlas (Cloud - RECOMMENDED for Beginners)

**Why Atlas?** It's free, cloud-based, and you don't need to install anything on your computer!

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in your details:
   - Email address
   - Password
   - First and Last name
4. Click **"Create your Atlas account"**
5. Verify your email if prompted

### Step 2: Create a Free Cluster

1. After logging in, you'll see **"Build a Database"**
2. Choose **"M0 FREE"** (Free tier)
3. Select a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to you (e.g., `N. Virginia (us-east-1)`)
5. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User

1. You'll see a popup: **"Create Database User"**
2. Choose **"Password"** authentication
3. Enter:
   - **Username**: `gamified-ds-user` (or any name you like)
   - **Password**: Create a strong password (save it somewhere!)
4. Click **"Create Database User"**
5. Click **"Finish and Close"**

### Step 4: Allow Network Access

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` (all IPs)
   - ⚠️ For production, use specific IPs
4. Click **"Confirm"**

### Step 5: Get Your Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as driver
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with your database password
8. Add your database name at the end:
   ```
   mongodb+srv://gamified-ds-user:yourpassword@cluster0.xxxxx.mongodb.net/gamified-ds?retryWrites=true&w=majority
   ```

### Step 6: Use in Your Backend

Add this connection string to your `.env` file:
```env
MONGODB_URI=mongodb+srv://gamified-ds-user:yourpassword@cluster0.xxxxx.mongodb.net/gamified-ds?retryWrites=true&w=majority
```

✅ **Done!** Your MongoDB is ready to use.

---

## 💻 Option 2: MongoDB Local Installation

If you prefer running MongoDB on your computer:

### For Windows:

1. **Download MongoDB:**
   - Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select:
     - Version: Latest (7.0 or newer)
     - Platform: Windows
     - Package: MSI
   - Click **"Download"**

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose **"Complete"** installation
   - Check **"Install MongoDB as a Service"**
   - Check **"Install MongoDB Compass"** (GUI tool - optional but helpful)
   - Click **"Install"**

3. **Verify Installation:**
   - Open Command Prompt or PowerShell
   - Type: `mongod --version`
   - You should see version information

4. **Start MongoDB:**
   - MongoDB should start automatically as a Windows service
   - If not, open **Services** (Win+R → `services.msc`)
   - Find **"MongoDB"** and start it

5. **Test Connection:**
   - Open Command Prompt
   - Type: `mongosh`
   - You should see MongoDB shell prompt

6. **Connection String:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/gamified-ds
   ```

### For Mac:

1. **Install using Homebrew:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

3. **Test Connection:**
   ```bash
   mongosh
   ```

4. **Connection String:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/gamified-ds
   ```

### For Linux (Ubuntu/Debian):

1. **Import MongoDB public GPG key:**
   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Add MongoDB repository:**
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Connection String:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/gamified-ds
   ```

---

## 🧪 Test Your MongoDB Connection

### Using MongoDB Compass (GUI Tool):

1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Open Compass
3. Paste your connection string
4. Click **"Connect"**
5. You should see your databases

### Using Command Line:

```bash
# For local MongoDB
mongosh

# For Atlas
mongosh "your-connection-string"
```

---

## 📝 Quick Reference

### Connection Strings:

**Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/database-name
```

**Local:**
```
mongodb://localhost:27017/database-name
```

### Common Commands:

```javascript
// Show databases
show dbs

// Use a database
use gamified-ds

// Show collections (tables)
show collections

// Insert a document
db.users.insertOne({ name: "John", email: "john@example.com" })

// Find documents
db.users.find()

// Find one
db.users.findOne({ name: "John" })
```

---

## 🎓 Understanding MongoDB Basics

### Database vs Collection vs Document:

- **Database**: Like a folder (e.g., `gamified-ds`)
- **Collection**: Like a table in SQL (e.g., `users`, `questions`)
- **Document**: Like a row in SQL (e.g., one user object)

### Example Document:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "alice",
  "email": "alice@example.com",
  "password": "hashed_password",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🚨 Troubleshooting

### "Connection refused" Error:
- **Local**: Make sure MongoDB service is running
- **Atlas**: Check network access settings (should allow your IP)

### "Authentication failed" Error:
- Check username and password in connection string
- Make sure you created a database user in Atlas

### "Cannot connect" Error:
- Check your internet connection (for Atlas)
- Verify connection string format
- Check firewall settings

### Port Already in Use:
- Another MongoDB instance might be running
- Change port in MongoDB config or stop other instance

---

## ✅ Next Steps

Once MongoDB is set up:

1. ✅ Add connection string to `.env` file
2. ✅ Test connection in your backend
3. ✅ Create your first model (User)
4. ✅ Start building your API!

---

## 📚 Additional Resources

- [MongoDB University](https://university.mongodb.com/) - Free courses
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html) - ODM for Node.js

---

**Need Help?** Check MongoDB community forums or Stack Overflow!

