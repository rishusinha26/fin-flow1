# 🚀 Financial Flow Backend (Node.js)

Node.js/Express backend server for the Financial Flow application with Gemini AI integration.

## 📋 Prerequisites

- **Node.js 16+** and npm
- **Gemini API Key** (free from Google)

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
cd fin-flow-backend
npm install
```

### Step 2: Configure API Key

1. Open the `.env` file
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Get your API key from: https://aistudio.google.com/app/apikey

### Step 3: Start the Server

```bash
npm start
```

Server will run on: **http://localhost:5000**

## 🎯 API Endpoints

### 1. Root Endpoint
```
GET /
```
Returns server information and available endpoints.

### 2. Health Check
```
GET /api/health
```
Returns server health status and API configuration.

**Response:**
```json
{
  "status": "healthy",
  "api_configured": true,
  "timestamp": "2025-10-23T13:23:00.000Z"
}
```

### 3. Chat Endpoint
```
POST /api/chat
```

**Request Body:**
```json
{
  "message": "What is compound interest?",
  "context": {
    "monthlyIncome": 50000,
    "monthlyExpenses": 30000,
    "savingsRate": 40
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response text...",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "nextSteps": ["Step 1", "Step 2"],
  "timestamp": "2025-10-23T13:23:00.000Z"
}
```

## 🧪 Testing the Backend

### Test 1: Health Check
Open browser: http://localhost:5000/api/health

### Test 2: Chat API (using PowerShell)
```powershell
$body = @{
    message = "What is compound interest?"
    context = @{
        monthlyIncome = 50000
        monthlyExpenses = 30000
        savingsRate = 40
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/chat" -Method Post -ContentType "application/json" -Body $body
```

### Test 3: Chat API (using curl)
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is compound interest?","context":{"monthlyIncome":50000,"monthlyExpenses":30000,"savingsRate":40}}'
```

## 🔄 How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │  HTTP   │   Node.js    │   API   │   Gemini    │
│  Frontend   │ ──────> │   Backend    │ ──────> │     AI      │
│ (Port 8081) │         │ (Port 5000)  │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
```

1. User asks question in chatbot (Frontend)
2. Frontend sends HTTP request to backend (localhost:5000)
3. Backend calls Gemini AI with your API key
4. Gemini responds with AI answer
5. Backend sends response back to frontend
6. Chatbot displays the answer

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **@google/generative-ai** - Gemini AI SDK
- **dotenv** - Environment variable management

## 🔒 Security

- ✅ API key stored in `.env` (not committed to git)
- ✅ CORS enabled for frontend communication
- ✅ Environment variables never exposed to browser
- ✅ Error handling for API failures

## 🐛 Troubleshooting

### Error: Cannot find module 'express'
```bash
npm install
```

### Error: GEMINI_API_KEY not configured
1. Check if `.env` file exists
2. Verify API key is added to `.env`
3. Restart the server

### Error: Port 5000 already in use
Change port in `.env`:
```env
PORT=5001
```

Then update frontend `.env`:
```env
VITE_BACKEND_URL=http://localhost:5001
```

### Backend not responding
- Check if server is running
- Look for startup message: "Server running on: http://localhost:5000"
- Test health endpoint: http://localhost:5000/api/health

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@google/generative-ai": "^0.2.1"
}
```

## 🚀 Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set GEMINI_API_KEY=your_key_here
git push heroku main
```

### Deploy to Railway
1. Connect your GitHub repo
2. Add `GEMINI_API_KEY` environment variable
3. Deploy automatically

### Deploy to Render
1. Create new Web Service
2. Connect repository
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy

## 📝 Notes

- Keep backend running while using the chatbot
- Frontend automatically falls back to local AI if backend is unavailable
- API key is never exposed to the browser
- Backend can be deployed separately from frontend

## ✅ Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add API key to `.env`
3. ✅ Start server: `npm start`
4. ✅ Test health check: http://localhost:5000/api/health
5. ✅ Start frontend and test chatbot

**Your backend is ready! 🎉**
