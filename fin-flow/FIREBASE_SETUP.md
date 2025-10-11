# 🔥 Firebase Setup Guide for Zen-Fi

This guide will help you set up Firebase Authentication for your Zen-Fi application.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Your Zen-Fi project cloned locally

## 🚀 Step-by-Step Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `zen-fi` (or your preferred name)
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

### 2. Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register app with nickname: `Zen-Fi Web App`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration object (you'll need this later)

### 3. Enable Authentication Methods

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab

#### Enable Email/Password Authentication:
- Click on **"Email/Password"**
- Toggle **"Enable"** to ON
- Click **"Save"**

#### Enable Google Sign-In:
- Click on **"Google"**
- Toggle **"Enable"** to ON
- Select a **"Project support email"** from dropdown
- Click **"Save"**

### 4. Configure Your App

1. In your project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=zen-fi-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=zen-fi-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=zen-fi-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Important:** Never commit your `.env` file to version control!

### 5. (Optional) Set Up Firestore Database

If you want to persist user data:

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your preferred location
5. Click **"Enable"**

**Security Rules for Production:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. (Optional) Set Up Firebase Storage

For file uploads (receipts, documents):

1. In Firebase Console, go to **Build** → **Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"** (for development)
4. Click **"Next"** and **"Done"**

**Security Rules for Production:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🏃 Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:8080`

## 🔒 Security Best Practices

### Environment Variables
- ✅ Store Firebase config in `.env` file
- ✅ Add `.env` to `.gitignore`
- ✅ Use `.env.example` as a template for team members
- ❌ Never commit API keys to GitHub

### Firebase Security Rules
- Update Firestore and Storage rules before going to production
- Use authentication-based rules
- Validate data on the server side
- Enable App Check for additional security

### Authentication
- Implement email verification for new users
- Add password reset functionality
- Consider multi-factor authentication (MFA)
- Monitor authentication logs in Firebase Console

## 🐛 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that your `.env` file exists and has correct values
- Restart your development server after creating `.env`
- Verify all environment variables start with `VITE_`

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your domain (e.g., `localhost`, `yourdomain.com`)

### "Firebase: Error (auth/api-key-not-valid)"
- Double-check your API key in `.env`
- Ensure there are no extra spaces or quotes
- Regenerate API key in Firebase Console if needed

### Google Sign-In Not Working
- Verify Google provider is enabled in Firebase Console
- Check that you've selected a support email
- Clear browser cache and cookies
- Try in incognito/private mode

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 🎉 You're All Set!

Your Zen-Fi application is now configured with Firebase Authentication. Users can:
- ✅ Sign up with email/password
- ✅ Log in with email/password
- ✅ Sign in with Google
- ✅ Access protected routes
- ✅ See personalized dashboard

Happy coding! 🚀
