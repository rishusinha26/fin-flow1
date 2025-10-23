# MongoDB Setup Guide

## Quick Start

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: Choose Free M0 tier
3. **Get Connection String**: 
   - Click "Connect" → "Connect your application"
   - Copy connection string
4. **Add to .env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/finflow?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

1. **Install MongoDB**: https://www.mongodb.com/try/download/community
2. **Start MongoDB Service**
3. **Add to .env**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/finflow
   ```

## Your .env File Should Look Like:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/finflow
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/finflow

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5001
```

## Test Connection

After adding MONGODB_URI to .env:

```bash
cd fin-flow-backend
npm install
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database: finflow
```

## Troubleshooting

### Connection Failed?
- Check MongoDB is running (local) or cluster is active (Atlas)
- Verify connection string is correct
- Check firewall/network settings
- For Atlas: Whitelist your IP address in Network Access

### Still Not Working?
The app will still run without MongoDB (in-memory mode):
```
⚠️  Running without database - data will not persist
```
