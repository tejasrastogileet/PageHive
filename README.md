# PageHive 📚

A modern, full-stack book recommendation app built with **Expo**, **React Native**, and a **Node.js/Express** backend. Share your favorite reads, rate books, and discover what others are reading.

---

## ✨ What's Included

### Frontend (Mobile)
- ⚛️ **React Native** with **Expo** & **expo-router**
- 🔐 **Clerk Authentication** — seamless sign-in/sign-up with secure token management
- 🎨 **Paghive Premium Design System** — unified theme, custom components (PaghiveButton, PaghiveInput, PaghiveCard, etc.)
- 📱 **Multi-screen Navigation** — Auth flow, Home feed, Create post, Profile, Logout
- 🔄 **Infinite Scrolling** — load more books as you scroll
- 🖼️ **Image Upload** — pick and compress images with `expo-image-picker`
- 🎯 **Protected Routes** — auto-redirect to login when session invalid, silent auth failure handling
- 🌐 **Web Support** — run on localhost with Expo web bundler
- 🔒 **Secure Token Storage** — tokens cached in `expo-secure-store`
- ✅ **OTA Updates Disabled** — uses local dev build only (no remote update crashes)

### Backend (Node.js/Express)
- 🛠️ **Express Server** — RESTful API running on port 3000
- 🗄️ **MongoDB** — persistent data storage
- 📧 **User Management** — profile, favorites, post history
- 📚 **Book Management** — CRUD operations for book recommendations
- 🔐 **JWT Auth** — token validation on protected endpoints
- 🖼️ **Cloudinary Integration** — image storage and CDN delivery
- ⏰ **Cron Jobs** — scheduled tasks (e.g., data cleanup, notifications)
- 📋 **Middleware** — auth checks, error handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ with npm
- Expo CLI (installed locally via npx)
- Android/iOS emulator OR Expo Go app on your device
- MongoDB (local or Atlas)
- Clerk account (free tier available)

### Backend Setup

1. **Navigate to backend folder:**
   ```powershell
   cd bookm\backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookm
   JWT_SECRET=your_jwt_secret_here
   CLERK_API_KEY=your_clerk_api_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Start dev server:**
   ```powershell
   npm run dev
   ```
   Server runs at `http://localhost:3000`

### Mobile Setup

1. **Navigate to mobile folder:**
   ```powershell
   cd bookm\mobile
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Ensure `app.json` has your Clerk key:**
   ```json
   {
     "expo": {
       "extra": {
         "CLERK_PUBLISHABLE_KEY": "pk_test_your_clerk_key"
       }
     }
   }
   ```

4. **Update API URL if testing on physical device:**
   - Edit `mobile/constants/api.js`
   - Replace `localhost` with your laptop's local IP (e.g., `http://10.102.24.77:3000/api`)

5. **Start Expo with clean cache:**
   ```powershell
   npx expo start -c
   ```

6. **On your device/emulator:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app (physical device)

---

## 📁 Project Structure

```
bookm/
├── backend/
│   ├── src/
│   │   ├── index.js              # Entry point
│   │   ├── lib/
│   │   │   ├── db.js             # MongoDB connection
│   │   │   ├── cloudinary.js     # Image upload config
│   │   │   └── cron.js           # Scheduled tasks
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # JWT verification
│   │   ├── models/
│   │   │   ├── Book.js           # Book schema
│   │   │   └── User.js           # User schema
│   │   └── routes/
│   │       ├── authRoutes.js     # Auth endpoints
│   │       └── bookRoutes.js     # Book CRUD
│   ├── package.json
│   └── .env
│
└── mobile/
    ├── app/
    │   ├── _layout.jsx           # Root layout, auth gating
    │   ├── clerk-provider.js     # Clerk provider wrapper
    │   ├── auth-stack.jsx        # Sign-in & sign-up screens
    │   ├── (auth)/
    │   │   ├── _layout.jsx       # Auth layout
    │   │   ├── index.jsx         # Sign-in route
    │   │   └── signup.jsx        # Sign-up route
    │   └── (tabs)/
    │       ├── _layout.jsx       # Tab navigation
    │       ├── index.jsx         # Home feed
    │       ├── create.jsx        # Add book recommendation
    │       └── profile.jsx       # User profile & posts
    ├── components/
    │   ├── PaghiveScreenWrapper.jsx   # Screen container with safe area
    │   ├── PaghiveHeader.jsx          # Screen title header
    │   ├── PaghiveButton.jsx          # Primary button
    │   ├── PaghiveInput.jsx           # Text input
    │   ├── PaghiveCard.jsx            # Card container
    │   ├── Loader.jsx                 # Loading spinner
    │   ├── LogoutButton.jsx           # Logout with Clerk
    │   └── ProfileHeader.jsx          # User profile card
    ├── constants/
    │   ├── paghiveTheme.js       # Theme colors (Paghive design system)
    │   └── api.js                # API URL & endpoints
    ├── lib/
    │   ├── apiService.js         # Centralized fetch wrapper (auto-token, auth redirect)
    │   └── utils.js              # Date formatting, helpers
    ├── store/
    │   └── authStore.js          # Zustand store (legacy token fallback)
    ├── app.json                  # Expo config (Clerk key, OTA disabled)
    ├── metro.config.js           # Metro bundler config (new Expo CLI)
    ├── package.json
    └── tsconfig.json
```

---

## 🔐 Authentication Flow

### Clerk Integration
- **Sign-up:** Create account with email/password via Clerk
- **Sign-in:** Login and receive session token
- **Token Cache:** Token stored securely in `expo-secure-store`
- **Auto-Attach:** `useApi` hook automatically adds `Authorization: Bearer <token>` to all requests
- **Auth Failure:** 401/403 responses trigger silent sign-out + redirect to `/sign-in`
- **Protected Routes:** App layout checks `useUser()` and gates access to tabs

### Key Files
- `mobile/app/clerk-provider.js` — Clerk provider with token cache
- `mobile/lib/apiService.js` — Centralized API wrapper with token attachment & error handling
- `mobile/app/_layout.jsx` — Root layout with auth gating

---

## 📱 Screens & Features

| Screen | Purpose | Auth Required |
|--------|---------|----------------|
| **Sign-in** | Login with Clerk | ❌ No |
| **Sign-up** | Create account via Clerk | ❌ No |
| **Home Feed** | View all book recommendations, infinite scroll | ✅ Yes |
| **Create** | Add new book recommendation (title, rating, image, caption) | ✅ Yes |
| **Profile** | View user info + their posts, delete posts | ✅ Yes |
| **Logout** | Sign out via Clerk, clear token, redirect to login | ✅ Yes |

---

## 🎨 Paghive Design System

All screens use the centralized **Paghive theme** (`mobile/constants/paghiveTheme.js`):

```javascript
export const PAGHIVE_COLORS = {
  primary: "#1a1a1a",           // Primary dark
  accentGold: "#d4af37",        // Gold accent
  primaryText: "#ffffff",        // White text
  secondaryText: "#999999",      // Gray text
  border: "#333333",             // Dark borders
  background: "#0a0a0a",         // Dark background
  textSecondary: "#666666",      // Secondary text
};
```

**Custom Components:**
- `PaghiveScreenWrapper` — Safe area + dark background
- `PaghiveHeader` — Screen title + subtitle
- `PaghiveButton` — Gold accent button
- `PaghiveInput` — Styled text input
- `PaghiveCard` — Container with borders

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` — Register user
- `POST /api/auth/login` — Login user
- `POST /api/auth/logout` — Logout

### Books
- `GET /api/books?page=1&limit=10` — Fetch all books (paginated)
- `POST /api/books` — Create book recommendation
- `GET /api/books/user` — Fetch user's books
- `DELETE /api/books/:id` — Delete book recommendation

---

## 🛠️ Development Tools

### npm Scripts (Mobile)

```bash
npm start          # Start Expo dev server (npx expo start)
npm run android    # Build & run on Android emulator (npx expo run:android)
npm run ios        # Build & run on iOS simulator (npx expo run:ios)
npm run web        # Run on web bundler (npx expo start --web)
npm test           # Run Jest tests
npm run lint       # Run Expo linter
```

### npm Scripts (Backend)

```bash
npm run dev        # Start with nodemon (watches for changes)
npm start          # Start production server
npm test           # Run tests
```

---

## 🚨 Troubleshooting

### "ExpoMetroConfig.loadAsync is not a function"
- **Fix:** Ensure `mobile/metro.config.js` exists and uses `expo/metro-config`
- Run: `npx expo start -c` (with `-c` flag to clear cache)

### "Failed to download remote update"
- **Fix:** OTA updates are disabled in `app.json` (`"updates": { "enabled": false }`)
- This is intentional for development. No remote update service is configured.

### Backend API requests fail (network error)
- **Cause:** Device cannot reach backend at `localhost:3000`
- **Fix:** Update `mobile/constants/api.js` to use your laptop's local IP
  - Find IP: Run `ipconfig` in PowerShell, look for "IPv4 Address"
  - Example: `http://10.102.24.77:3000/api`

### Token not attached to requests
- **Check:** Ensure `mobile/lib/apiService.js` exists and `useApi()` is used in screens
- **Verify:** Clerk provider wraps the app in `mobile/app/clerk-provider.js`

### App crashes on startup
- Run: `npm install` (inside `mobile` folder)
- Run: `npx expo start -c`
- Check: `app.json` has valid Clerk publishable key in `extra.CLERK_PUBLISHABLE_KEY`

---

## 🔒 Security Notes

- **JWT tokens** are validated on the backend for all protected routes
- **Clerk tokens** are stored securely in `expo-secure-store`
- **OTA updates** disabled — app uses local builds only
- **Env vars** (API keys, MongoDB URI, Clerk secrets) stored in `.env` files (not committed)
- **Silent auth failures** — 401/403 responses redirect users to login without alerts

---

## 📦 Tech Stack

**Frontend:**
- React Native 0.81.5
- Expo ~54.0.0
- expo-router ~6.0.15
- @clerk/clerk-expo ^2.19.6
- expo-image-picker, expo-image, expo-secure-store
- zustand (state management)
- react-native-safe-area-context

**Backend:**
- Node.js + Express.js
- MongoDB (Atlas or local)
- JWT (jsonwebtoken)
- Cloudinary (image uploads)
- node-cron (scheduled tasks)
- Nodemon (dev server)

**Tools:**
- Metro (bundler)
- Babel (transpiler)
- TypeScript support

---

## 📝 Build Time

⏱️ **Complete setup:** ~7 hours (initial Clerk integration + UI migration to Paghive + centralized API service)

---

## 📄 License

Private project — All rights reserved.

---

## 🤝 Support

For issues or questions, check the troubleshooting section above or review the code comments in:
- `mobile/lib/apiService.js` — Token & auth error handling
- `mobile/app/clerk-provider.js` — Clerk setup
- `mobile/app/_layout.jsx` — Auth gating & route protection

---

**Happy coding! 🚀 Share your books with PageHive.**
