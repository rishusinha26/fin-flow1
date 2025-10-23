# 🤖 AI Chatbot Integration - Complete Guide

## ✅ Step-by-Step Integration

### **Step 1: Add API Key to `.env` File**

Open your `.env` file and add this at the bottom:

```env
# AI Chatbot Configuration
VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**Replace `YOUR_API_KEY_HERE` with the API key you copied from Google AI Studio.**

Example:
```env
VITE_GEMINI_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567
```

---

### **Step 2: Save the File**

Press `Ctrl + S` to save your `.env` file.

---

### **Step 3: Restart Development Server**

1. **Stop** the current server (if running):
   - Press `Ctrl + C` in the terminal

2. **Start** the server again:
   ```bash
   npm run dev
   ```

---

### **Step 4: Test the Chatbot**

1. Open your app in browser: `http://localhost:8080`
2. Look for the **chat icon** (floating button, usually bottom-right)
3. Click it to open the chatbot
4. Ask a question like: "How should I budget my income?"

---

## 🎯 What to Expect

### **With API Key (Gemini AI):**
- ✅ Advanced AI responses
- ✅ Personalized financial advice
- ✅ Context-aware recommendations
- ✅ Natural conversations

### **Without API Key (Local AI):**
- ✅ Basic financial advice
- ✅ Budget analysis
- ✅ Investment tips
- ✅ Savings suggestions

---

## 📝 Your `.env` File Should Look Like:

```env
# Firebase Configuration (your existing config)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url

# AI Chatbot Configuration (ADD THIS)
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🚨 Troubleshooting

### **Chatbot not responding with AI?**
1. Check if API key is correctly added to `.env`
2. Make sure there are no extra spaces in the API key
3. Restart the dev server
4. Check browser console for errors (F12)

### **"API Key Required" message?**
- The API key is not being read
- Make sure you saved the `.env` file
- Restart the server

### **Still using local AI?**
- Check if the API key starts with `AIza`
- Verify the key is active on Google AI Studio
- Check for typos in the variable name: `VITE_GEMINI_API_KEY`

---

## ✅ Integration Complete!

Once you complete these steps, your chatbot will:
- Use Google Gemini AI for responses
- Provide personalized financial advice
- Analyze your financial data
- Give context-aware recommendations

**Enjoy your AI-powered financial assistant!** 🎉
