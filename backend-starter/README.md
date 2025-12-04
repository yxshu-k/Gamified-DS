# Gamified DS Backend - Starter Template

This is a starter template for the backend of the Gamified Data Structures Learning Platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend-starter
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
- **Local**: Install MongoDB and start the service
- **Cloud**: Use MongoDB Atlas (free tier available)

### 4. Run the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend-starter/
├── config/          # Configuration files (database, JWT, etc.)
├── models/          # Mongoose models
├── routes/          # Express routes
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth, validation, etc.)
├── services/        # Business logic services
├── utils/           # Utility functions
├── tests/           # Test files
├── .env             # Environment variables (create from .env.example)
├── .gitignore
├── package.json
└── server.js        # Entry point
```

## 🔧 Next Steps

1. **Create Models**: Start with User, Question, Progress models
2. **Set Up Authentication**: Implement JWT-based auth
3. **Create Routes**: Build API endpoints
4. **Add Middleware**: Auth, validation, error handling
5. **Implement Services**: Code execution, leaderboard calculation

## 📚 Documentation

See `BACKEND_IDEAS.md` in the root directory for:
- Complete API endpoint structure
- Database schema designs
- Security best practices
- Implementation roadmap

## 🧪 Testing

```bash
npm test
```

## 📝 API Endpoints

Once implemented, you'll have endpoints like:
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/questions` - Get questions
- `POST /api/progress/quiz` - Submit quiz score
- `GET /api/leaderboard` - Get leaderboard

## 🔐 Security Notes

- Never commit `.env` file
- Use strong JWT secrets in production
- Enable HTTPS in production
- Implement rate limiting
- Validate all user inputs

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Check firewall settings

**Port Already in Use:**
- Change PORT in .env
- Or kill the process using the port

**Module Not Found:**
- Run `npm install` again
- Check if you're in the correct directory

