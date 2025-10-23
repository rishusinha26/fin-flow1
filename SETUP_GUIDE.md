# 🚀 Complete Setup Guide - Financial Flow

This guide will help you set up the Financial Flow application.

## 📁 Project Structure

```
mini project/
├── fin-flow/                  # Frontend (React + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── START_ALL.bat              # Start script
```

---

## 🎯 **SETUP INSTRUCTIONS**

### **Location:** `d:\mini project\fin-flow`

### **Step 1: Install Dependencies**
```bash
cd d:\mini project\fin-flow
npm install
```

### **Step 2: Configure Environment (Optional)**
Edit `.env` if you want to use direct API calls:
```env
VITE_GEMINI_API_KEY=your_key_here
```

### **Step 3: Start Application**

**Option 1: Using Script**
```bash
cd d:\mini project
START_ALL.bat
```

**Option 2: Manual Start**
```bash
cd d:\mini project\fin-flow
npm run dev
```

Application will run on: **http://localhost:8081**

---

## 🧪 **TESTING**

### **Test 1: Frontend**
Open browser: http://localhost:8081

Should see the Financial Flow dashboard

### **Test 2: Chatbot**
1. Click blue chat button (bottom-right)
2. Ask: "What is compound interest?"
3. Should get AI response from built-in knowledge base!

---

## 🔧 **CONFIGURATION**

### **Frontend Configuration**
File: `fin-flow\.env`
```env
# Optional: Direct API key for Gemini AI
VITE_GEMINI_API_KEY=your_key

# Firebase (if using authentication)
VITE_FIREBASE_API_KEY=...
```

---

## 🚀 **DEPLOYMENT**

### **Deploy to Vercel/Netlify**
```bash
cd fin-flow
npm run build
# Deploy dist/ folder to your hosting platform
```

---

## 🐛 **TROUBLESHOOTING**

### **Frontend Issues**

**Error: Port 8081 in use**
- Vite will automatically try another port
- Or stop other process using port 8081

**Error: Dependencies not installed**
```bash
cd d:\mini project\fin-flow
npm install
```

**Chatbot not responding**
- Check browser console (F12)
- Verify the chatbot component is loaded
- Try refreshing the page

**Build errors**
```bash
npm cache clean --force
npm install
npm run dev
```

---

## 📦 **DEPENDENCIES**

- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- Recharts

---

## 🔒 **SECURITY**

### **✅ Good Practices:**
- `.env` files in `.gitignore`
- No sensitive data hardcoded
- Environment variables not exposed
- Client-side data storage only

### **❌ Avoid:**
- Committing `.env` files to Git
- Hardcoding API keys in code
- Exposing sensitive data in frontend

---

## 📝 **QUICK COMMANDS**

### **Start Application**
```bash
cd d:\mini project
START_ALL.bat
```

Or manually:
```bash
cd d:\mini project\fin-flow
npm run dev
```

### **Stop Application**
- Press `Ctrl + C` in terminal

### **Restart Application**
- Press `Ctrl + C`
- Run `npm run dev` again

---

## 🎊 **YOU'RE ALL SET!**

Your application is now running with:
- ✅ React frontend on port 8081
- ✅ Built-in financial AI chatbot
- ✅ Modern UI with TailwindCSS
- ✅ Comprehensive financial management features

**Open http://localhost:8081 and start using your Financial Flow app!** 🚀

---

## 📞 **NEED HELP?**

1. Check terminal logs for errors
2. Check browser console (F12)
3. Verify dependencies are installed
4. Make sure Node.js is up to date

---

## 📄 **FILES TO CONFIGURE**

1. ✅ `fin-flow\.env` - Optional API keys and Firebase config

That's it! Happy coding! 🎉
