# Campus Stay Suite - Complete Setup Guide

This guide will help you set up both the backend and frontend for the Campus Stay Suite project.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or cloud)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy config.env.example config.env
# Edit config.env with your MongoDB connection string

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to project root
cd campus-stay-suite-main

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Detailed Setup

### Backend Configuration

1. **Environment Variables**
   Create `backend/config.env`:
   ```env
   MONGODB_URI=mongodb+srv://harigolu83:gJsaya3ftKhnbuEo@cluster0.u1sgc6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

2. **Database Seeding**
   ```bash
   cd backend
   npm run seed
   ```
   This creates:
   - 72 sample rooms across 6 floors
   - Admin user: `admin@campusstay.com` / `admin123`
   - Staff user: `staff@campusstay.com` / `staff123`
   - Regular user: `user@campusstay.com` / `user123`

3. **Start Backend**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Configuration

1. **API Configuration**
   The frontend is configured to connect to `http://localhost:5000/api`
   Update `src/lib/api.ts` if you change the backend URL

2. **Start Frontend**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🔐 Authentication

### Sample Users
After seeding the database, you can login with:

- **Admin**: `admin@campusstay.com` / `admin123`
- **Staff**: `staff@campusstay.com` / `staff123`
- **User**: `user@campusstay.com` / `user123`

### JWT Tokens
- Tokens are automatically stored in localStorage
- Tokens expire after 7 days (configurable)
- Automatic logout on token expiration

## 🏗️ Project Structure

```
campus-stay-suite-main/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation
│   ├── seeder/             # Database seeding
│   └── server.js           # Main server file
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities & API client
│   └── pages/              # Page components
└── package.json            # Frontend dependencies
```

## 📚 API Endpoints

### Public Endpoints
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/stats` - Room statistics
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints
- `GET /api/auth/me` - Get current user
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

### Admin/Staff Only
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `GET /api/users` - List all users

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm run seed         # Seed database
```

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string in `config.env`
   - Ensure MongoDB is running
   - Verify network access

2. **Port Already in Use**
   - Change PORT in `config.env`
   - Kill existing processes on port 5000

3. **CORS Issues**
   - Backend CORS is configured for localhost:3000 and localhost:5173
   - Update CORS origins in `server.js` if needed

4. **JWT Token Issues**
   - Check JWT_SECRET in environment
   - Clear localStorage and re-login

### Debug Mode
Set `NODE_ENV=development` in backend environment for detailed logging.

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Enable HTTPS
4. Configure proper MongoDB connection pooling

### Frontend
1. Build with `npm run build`
2. Serve static files from backend
3. Update API base URL for production

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs in console
3. Verify environment configuration
4. Check MongoDB connection

## 📄 License

This project is licensed under the MIT License.
