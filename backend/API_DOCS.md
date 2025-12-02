# Backend API - Simple Authentication System

## Overview
The backend now uses a **simple, session-free authentication system** with email verification. No tokens, no passwords, no complex auth middleware.

## Key Changes

### 1. **User Model Simplified**
- ❌ Removed: `password`, `username`, `bcrypt`
- ✅ Added: `name`, `email`, `isEmailVerified`, `verificationToken`, `verificationTokenExpiry`

### 2. **Authentication Routes**

#### `POST /api/auth/signup`
Create a new user and send verification email.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (201):**
```json
{
  "message": "User created. Verification email sent.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "avatar_url",
    "isEmailVerified": false
  }
}
```

---

#### `POST /api/auth/login`
Login with name and email (no password required).

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "avatar_url",
    "isEmailVerified": true
  }
}
```

---

#### `POST /api/auth/verify-email`
Verify email using token from verification link.

**Request:**
```json
{
  "email": "john@example.com",
  "token": "verification_token_from_email"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "avatar_url",
    "isEmailVerified": true
  }
}
```

---

### 3. **Book Routes (All Public)**

#### `POST /api/books`
Create a book recommendation (no auth required).

**Request:**
```json
{
  "title": "The Great Gatsby",
  "caption": "A masterpiece of American literature",
  "rating": 5,
  "image": "base64_image_or_url",
  "email": "john@example.com"
}
```

**Response (201):**
```json
{
  "message": "Book created successfully",
  "book": {
    "_id": "book_id",
    "title": "The Great Gatsby",
    "caption": "A masterpiece of American literature",
    "rating": 5,
    "image": "cloudinary_url",
    "user": "user_id",
    "createdAt": "2025-12-02T..."
  }
}
```

#### `GET /api/books?page=1&limit=10`
Get all books with pagination (no auth required).

**Response:**
```json
{
  "books": [...],
  "currentPage": 1,
  "totalBooks": 50,
  "totalPages": 5
}
```

#### `GET /api/books/user`
Get all books (no auth required).

#### `DELETE /api/books/:id`
Delete a book (public - no auth check).

---

## Environment Setup

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-manager

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL for email verification links
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Email Setup (Gmail)
1. Enable 2-Factor Authentication in your Google Account
2. Generate an **App Password** (not your regular password)
3. Use the App Password in `SMTP_PASS`

---

## Running the Backend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on `http://localhost:3000` (or your configured PORT)

---

## Removed Features
- ❌ JWT tokens
- ❌ Password hashing (bcryptjs)
- ❌ Auth middleware on protected routes
- ❌ Clerk integration
- ❌ OAuth
- ❌ Bearer token validation

---

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Server Error |

---

## Notes for Frontend

1. **No Token Needed**: Frontend doesn't need to send authorization headers
2. **Email + Name for Auth**: Use `name` and `email` for signup/login (matches mobile app)
3. **Store User Locally**: Use AsyncStorage or similar to persist user data
4. **Optional Email Verification**: User can proceed without verifying email
5. **Clean JSON Responses**: All endpoints return structured JSON with `message` and `user/book` data

---

## Database

- **MongoDB**: Make sure MongoDB is running
- **Collections**: `users`, `books`
- **No Auth DB Logic**: Everything is stored in plain text (suitable for demo/interview)

