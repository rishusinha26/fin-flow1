# 🤖 AI Chatbot Setup Guide

## ✅ Your Chatbot is Already Integrated!

The AI Financial Chatbot is **already built into your app** and ready to use. It appears as a floating chat button on your pages.

---

## 🚀 Quick Setup (5 Minutes)

### **Option 1: Google Gemini (FREE - Recommended)**

#### Step 1: Get Free API Key
1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

#### Step 2: Add to Your Project
Open your `.env` file and add:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Step 3: Restart Server
```bash
npm run dev
```

**That's it!** Your chatbot now has AI superpowers! 🎉

---

### **Option 2: OpenAI GPT**

#### Step 1: Get API Key
1. Visit: **https://platform.openai.com/api-keys**
2. Create account (get $5 free credits)
3. Click **"Create new secret key"**
4. Copy the key

#### Step 2: Add to Your Project
Open your `.env` file and add:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

#### Step 3: Restart Server
```bash
npm run dev
```

---

## 🎯 How to Use the Chatbot

### **Finding the Chatbot**
- Look for a **floating chat icon** (usually bottom-right corner)
- Click it to open the chat interface
- Start asking financial questions!

### **Example Questions**

✅ **Budget & Spending:**
- "How can I reduce my monthly expenses?"
- "What's the 50/30/20 budget rule?"
- "Help me create a budget for ₹50,000 monthly income"

✅ **Investments:**
- "Where should I invest ₹10,000 per month?"
- "What are ELSS funds?"
- "Should I invest in stocks or mutual funds?"

✅ **Savings:**
- "How much should I save for emergencies?"
- "Best way to save for a house down payment?"
- "How to save ₹1 lakh in 6 months?"

✅ **Tax Planning:**
- "How can I save tax under Section 80C?"
- "What are tax-saving investment options?"
- "Should I choose old or new tax regime?"

✅ **Debt Management:**
- "How to pay off credit card debt faster?"
- "What's the snowball method?"
- "Should I pay off debt or invest?"

---

## 💰 Pricing Comparison

### **Google Gemini** ⭐ Recommended
- ✅ **FREE tier**: 15 requests/minute
- ✅ Perfect for personal use
- ✅ No credit card required
- ✅ Generous free quota
- 💰 Paid: $0.00025 per 1K characters (very cheap)

### **OpenAI GPT**
- ✅ $5 free credits for new users
- 💰 GPT-3.5-turbo: $0.0015 per 1K tokens
- 💰 GPT-4: $0.03 per 1K tokens
- ⚠️ Requires credit card after free credits

---

## 🎨 Chatbot Features

### **Smart Financial Advice**
- Analyzes your income, expenses, and savings
- Provides personalized recommendations
- Context-aware responses based on your data

### **Local AI Fallback**
- Works even without API key
- Basic financial advice
- Budget analysis
- Investment suggestions

### **What the AI Knows About You**
The chatbot has access to:
- Your monthly income
- Your expenses by category
- Your savings rate
- Your financial goals
- Your investments
- Your debt information

**Privacy:** All data stays on your device. Only relevant context is sent to AI providers.

---

## 🔧 Technical Details

### **How It Works**

1. **You ask a question** → "How should I invest ₹20,000?"
2. **App gathers context** → Your income, expenses, goals
3. **Sends to AI** → Google Gemini or OpenAI
4. **AI analyzes** → Considers your financial situation
5. **Returns advice** → Personalized, actionable recommendations

### **Code Location**
- **Service:** `src/services/aiService.ts`
- **Component:** `src/components/FinancialChatbot.tsx`
- **Integration:** `src/pages/Index.tsx`

### **Supported AI Providers**
```typescript
// Priority order:
1. Google Gemini (if VITE_GEMINI_API_KEY is set)
2. OpenAI GPT (if VITE_OPENAI_API_KEY is set)
3. Local AI (fallback, always available)
```

---

## 🔒 Security & Privacy

### **API Key Storage**
- Stored in `.env` file (never committed to Git)
- Not exposed in frontend code
- Only used for AI API calls

### **Data Privacy**
- ✅ Financial data stays on your device
- ✅ Only relevant context sent to AI
- ✅ No personal info stored externally
- ✅ No data sharing with third parties

### **Best Practices**
- Never share your API keys
- Add `.env` to `.gitignore`
- Rotate keys if exposed
- Monitor API usage

---

## 🚨 Troubleshooting

### **Chatbot Not Appearing?**
- Check if `FinancialChatbot` component is imported
- Look for floating button (usually bottom-right)
- Check browser console for errors

### **"API Key Required" Message?**
- Add API key to `.env` file
- Restart dev server (`npm run dev`)
- Clear browser cache

### **"Rate Limit Exceeded" (Gemini)?**
- Free tier: 15 requests/minute
- Wait 1 minute before next request
- Consider upgrading to paid tier

### **"Invalid API Key" (OpenAI)?**
- Verify key is correct (no extra spaces)
- Check account billing status
- Ensure key has proper permissions

### **AI Responses Not Working?**
- Check internet connection
- Verify API key is active
- Look at browser console for errors
- Fallback to local AI automatically

---

## 📊 Usage Tips

### **Get Better Responses**
1. **Be Specific:** "How to save ₹50,000 in 6 months?" vs "Help me save"
2. **Provide Context:** Mention your income, expenses, goals
3. **Ask Follow-ups:** Build on previous answers
4. **Use Keywords:** Budget, invest, save, tax, debt

### **Example Conversation**
```
You: "I earn ₹60,000 per month. How should I budget?"

AI: "With ₹60,000 monthly income, follow the 50/30/20 rule:
- ₹30,000 (50%) for needs (rent, food, bills)
- ₹18,000 (30%) for wants (entertainment, dining)
- ₹12,000 (20%) for savings/investments

Start by tracking expenses to see where you stand!"

You: "Where should I invest the ₹12,000 savings?"

AI: "Great question! For ₹12,000 monthly:
- ₹5,000 in ELSS funds (tax saving + growth)
- ₹4,000 in index funds (low cost, diversified)
- ₹2,000 in PPF (safe, tax-free returns)
- ₹1,000 emergency fund (liquid)

Start with small SIPs and increase gradually!"
```

---

## 🎯 What the Chatbot Can Help With

✅ **Budgeting** - Create and manage budgets
✅ **Saving** - Emergency funds, goal-based savings
✅ **Investing** - Stocks, mutual funds, ETFs, FDs
✅ **Tax Planning** - Deductions, regime comparison
✅ **Debt Management** - Payoff strategies, consolidation
✅ **Goal Setting** - House, car, retirement planning
✅ **Expense Analysis** - Identify spending patterns
✅ **Financial Education** - Learn money concepts

❌ **What It Can't Do**
- Execute transactions
- Access your bank accounts
- Provide legal/tax filing services
- Guarantee investment returns

---

## 🔄 Updates & Maintenance

### **Regular Tasks**
- Monitor API usage (check provider dashboard)
- Review AI responses for accuracy
- Update API keys if needed
- Backup financial data regularly

### **Cost Monitoring**
- **Gemini:** Check usage at https://makersuite.google.com/
- **OpenAI:** Check usage at https://platform.openai.com/usage

---

## 📚 Additional Resources

- **AI Integration Guide:** `AI_INTEGRATION_GUIDE.md`
- **Google Gemini Docs:** https://ai.google.dev/docs
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Financial Education:** Check the Education page in your app

---

## 🎉 You're All Set!

Your AI Financial Chatbot is ready to provide:
- 💡 Personalized financial advice
- 📊 Budget analysis and recommendations
- 💰 Investment suggestions
- 🎯 Goal planning assistance
- 📈 Spending insights

**Start chatting and take control of your finances!** 🚀

---

**Need Help?**
- Check the troubleshooting section above
- Review the AI Integration Guide
- Test with simple questions first
- Use local AI if API issues occur
