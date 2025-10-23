# ⚡ Quick MongoDB Setup (2 Minutes)

## Option 1: MongoDB Atlas (Cloud) ☁️

### 1. Create Free Account
→ https://www.mongodb.com/cloud/atlas/register

### 2. Create Cluster
- Click "Build a Database"
- Choose "M0 Free"
- Click "Create"

### 3. Get Connection String
- Click "Connect" → "Connect your application"
- Copy string:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/finflow
  ```

### 4. Add to .env
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/finflow?retryWrites=true&w=majority
```

### 5. Install & Start
```bash
npm install
npm start
```

---

## Option 2: Local MongoDB 💻

### 1. Install MongoDB
**Windows:** https://www.mongodb.com/try/download/community

### 2. Add to .env
```env
MONGODB_URI=mongodb://localhost:27017/finflow
```

### 3. Install & Start
```bash
npm install
npm start
```

---

## ✅ Success Check

You should see:
```
✅ MongoDB Connected: ...
📊 Database: finflow
🚀 Financial Flow Backend Server
```

---

## 🐛 Not Working?

### MongoDB Atlas:
- Whitelist IP: Network Access → Add IP → 0.0.0.0/0
- Check username/password in connection string

### Local MongoDB:
- Verify MongoDB is running: `mongod --version`
- Start MongoDB service

---

## 📝 Your .env File

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/finflow

# Gemini AI
GEMINI_API_KEY=your_key_here

# Server
PORT=5001
```

---

**That's it! Your data now persists in MongoDB! 🎉**
