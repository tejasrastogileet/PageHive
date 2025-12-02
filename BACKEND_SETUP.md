# Quick Setup Guide

## Backend Simplification Complete ✅

Your backend has been **completely simplified** for the interview demo. Here's what changed:

### What Was Removed:
- ❌ JWT tokens and token verification
- ❌ Password hashing (bcryptjs)
- ❌ Auth middleware on routes
- ❌ Clerk integration
- ❌ Complex authentication logic
- ❌ `username` field (replaced with `name`)

### What Was Added:
- ✅ **Email Verification System** - Users get email confirmation link after signup
- ✅ **Simple Name + Email Auth** - Just check if user exists and name matches
- ✅ **All Public Routes** - No token needed for book endpoints
- ✅ **Clean JSON Responses** - Structured responses with `message` and data

---

## Setup Steps

### 1. Backend Environment Setup

Create `.env` in `backend/` folder:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-manager

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

FRONTEND_URL=http://localhost:3000

CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

**Gmail Setup:**
- Enable 2FA on Google Account
- Go to **myaccount.google.com → Security → App Passwords**
- Select "Mail" and "Windows Computer"
- Copy the generated password
- Use it as `SMTP_PASS`

### 2. Start MongoDB

```bash
# Windows
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your connection string
```

### 3. Install Dependencies & Start Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 3000 on all interfaces (0.0.0.0)
```

### 4. Mobile App (Frontend)

The mobile app already has the matching name + email auth. Just ensure:
- API endpoint in `mobile/constants/api.js` points to your backend IP
- When backend runs, get your IP: `ipconfig` → IPv4 Address
- Update `API_URL` if needed

Example:
```javascript
export const API_URL = "http://10.65.29.77:3000/api"; // Your laptop IP:3000
```

---

## Test the Flow

### Using Postman or curl:

**1. Sign Up**
```bash
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**2. Login**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**3. Create Book**
```bash
POST http://localhost:3000/api/books
Content-Type: application/json

{
  "title": "The Hobbit",
  "caption": "An adventure awaits",
  "rating": 5,
  "image": "base64_or_url",
  "email": "john@example.com"
}
```

**4. Get Books**
```bash
GET http://localhost:3000/api/books?page=1&limit=10
```

---

## Mobile App Integration

Your mobile app's `simpleAuthStore` already matches this backend:
- `signUp(name, email)` → Calls `POST /api/auth/signup`
- `logIn(name, email)` → Calls `POST /api/auth/login`
- No token handling needed
- User data stored in AsyncStorage locally

---

## Key Features

✅ **No Complex Auth** - Just name + email  
✅ **Email Verification** - Optional but included  
✅ **Public Book Endpoints** - No token headers needed  
✅ **MongoDB for Data** - Persists users & books  
✅ **Cloudinary for Images** - Handles image uploads  
✅ **Interview Ready** - Simple, clean, works perfectly  

---

## API Documentation

Full API docs in `backend/API_DOCS.md`

---

## Troubleshooting

### "Connection refused on localhost:3000"
- Make sure backend is running: `npm run dev`
- Check PORT in `.env`

### "Email not sending"
- Verify Gmail credentials in `.env`
- Check Gmail 2FA is enabled
- Use App Password (not regular password)
- Check inbox/spam folder

### "MongoDB connection error"
- Start MongoDB: `mongod`
- Or use MongoDB Atlas (cloud database)
- Update `MONGODB_URI` in `.env`

### "Cannot create book"
- Ensure user email exists in database
- Or remove email requirement and use placeholder

---

## Interview Talking Points

1. **Simple but Effective** - Proves authentication concepts without enterprise complexity
2. **Email Verification** - Shows real-world email integration
3. **Clean API Design** - Structured JSON responses, proper HTTP status codes
4. **MongoDB Integration** - Real database persistence
5. **Cloudinary** - Real image upload service
6. **Full Stack** - Backend + Frontend working together

---

You're all set! 🚀 Run the backend, fire up the mobile app, and you're ready for the interview.

