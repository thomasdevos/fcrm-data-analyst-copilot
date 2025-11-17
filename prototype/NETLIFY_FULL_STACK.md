# Deploy Full Stack to Netlify (Frontend + Backend)

## 🎉 Complete Deployment with AI Assistant Working

This guide shows you how to deploy **both** the frontend and backend to Netlify, so the AI Assistant works perfectly!

---

## 🏗️ Architecture

**Frontend**: React app (static files served by Netlify CDN)
**Backend**: Netlify Function (serverless Python function)
**AI**: Google Gemini 2.5 Flash API

```
User Browser
    ↓
Netlify CDN (Frontend)
    ↓
Netlify Function (Python serverless)
    ↓
Google Gemini API
```

---

## 📋 Prerequisites

1. GitHub account
2. Netlify account (free tier is fine)
3. Google API Key for Gemini (get from https://makersuite.google.com/app/apikey)

---

## 🚀 Deployment Steps

### Step 1: Test Locally First

```bash
# Navigate to frontend
cd prototype/frontend

# Install dependencies
npm install

# Build to verify it works
npm run build
```

If the build succeeds, you're ready! ✅

### Step 2: Commit and Push to GitHub

```bash
cd /Users/thomas.devos/_dev_projects/ai-labs-projects/projects/ING/analyst-data-copilot

# Add all files
git add .

# Commit with message
git commit -m "Add Netlify Functions for full-stack deployment"

# Push to GitHub
git push origin main
```

### Step 3: Deploy to Netlify

#### Option A: Via Netlify Dashboard (Recommended)

1. **Go to Netlify**: https://app.netlify.com

2. **Import Project**:
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub**
   - Select repository: **`fcrm-data-analyst-copilot`**

3. **Configure Build Settings**:
   ```
   Base directory:    prototype/frontend
   Build command:     npm run build
   Publish directory: prototype/frontend/dist
   Functions directory: prototype/frontend/netlify/functions
   ```

4. **Add Environment Variable**:
   - **Before deploying**, click **"Show advanced"**
   - Click **"New variable"**
   - Add:
     - **Key**: `GOOGLE_API_KEY` (or `GEMINI_API_KEY`)
     - **Value**: Your Google API key from MakerSuite

5. **Deploy**:
   - Click **"Deploy site"**
   - Wait 2-3 minutes for build to complete

6. **Verify**:
   - Once deployed, click the site URL
   - Open AI Assistant (orange FAB button)
   - Try a query like "Give me a summary of all cases"
   - You should get a response from Gemini! 🎉

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd prototype/frontend

# Login to Netlify
netlify login

# Link to new site (or existing)
netlify init

# Set environment variable
netlify env:set GOOGLE_API_KEY your_api_key_here

# Deploy
netlify deploy --prod
```

---

## 🔧 Configuration Details

### What I Created:

1. **`netlify/functions/assistant.py`**
   - Python serverless function
   - Handles AI queries using Gemini
   - Same logic as Flask backend but adapted for Netlify

2. **`netlify/functions/requirements.txt`**
   - Python dependencies for the function
   - Only needs: `google-generativeai`

3. **`netlify.toml`** (updated)
   - Specifies functions directory
   - Sets Python version to 3.9
   - Configures SPA redirects

4. **`AIAssistant.jsx`** (updated)
   - Automatically detects environment
   - Uses local backend in dev: `/api/assistant/query`
   - Uses Netlify Function in prod: `/.netlify/functions/assistant`

---

## ✅ What Works After Deployment

- ✅ **Dashboard** - Full case overview
- ✅ **Case Search** - Search and filter
- ✅ **Case Details** - Complete case viewer
- ✅ **AI Assistant** - **FULLY FUNCTIONAL** with Gemini 2.5 Flash
- ✅ **Filters** - Clickable stat cards
- ✅ **Mobile Responsive** - Works on all devices

---

## 🔐 Managing Environment Variables

### Via Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add `GOOGLE_API_KEY` with your API key
4. Click **"Save"**
5. **Trigger a redeploy** (Site settings → Deploys → Trigger deploy)

### Via Netlify CLI:

```bash
# Set variable
netlify env:set GOOGLE_API_KEY your_api_key_here

# List variables
netlify env:list

# Redeploy
netlify deploy --prod
```

---

## 🧪 Testing the Deployment

1. **Open the deployed site**
2. **Check Dashboard** - Should show 3 cases
3. **Click AI Assistant** (pulsing orange button)
4. **Try these queries**:
   - "Give me a summary of all cases"
   - "What are the high-risk cases?"
   - Click a case first, then ask: "Summarize this case"

5. **Expected Response**: Formatted markdown response from Gemini with case details

---

## 🐛 Troubleshooting

### Issue: AI Assistant shows "API Key Not Configured"

**Solution**:
- Go to Netlify dashboard → Site settings → Environment variables
- Ensure `GOOGLE_API_KEY` or `GEMINI_API_KEY` is set
- Trigger a new deploy (the function needs to rebuild)

### Issue: Function times out or errors

**Check the Function Logs**:
1. Netlify Dashboard → Functions tab
2. Click on `assistant` function
3. View recent invocations and logs
4. Look for error messages

**Common fixes**:
- Verify API key is valid
- Check Google API quota (free tier has limits)
- Ensure `google-generativeai` version is compatible

### Issue: CORS errors

**Solution**: The function already includes proper CORS headers:
```python
'Access-Control-Allow-Origin': '*'
```

If you still see CORS errors, check browser console for specific error details.

### Issue: "Module not found" error for google-generativeai

**Solution**:
- Ensure `requirements.txt` is in `netlify/functions/` directory
- Redeploy the site (Netlify auto-installs dependencies)
- Check function build logs for installation errors

---

## 💰 Cost Considerations

**Netlify (Free Tier)**:
- ✅ 100GB bandwidth/month
- ✅ 125,000 function invocations/month
- ✅ 100 hours function runtime/month
- **Perfect for demos and prototypes!**

**Google Gemini API (Free Tier)**:
- ✅ 15 requests per minute
- ✅ 1,500 requests per day
- **Plenty for demos!**

For production use, you may need paid tiers.

---

## 🎨 Custom Domain (Optional)

1. Go to **Domain settings** in Netlify
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `fcrm-copilot.yourdomain.com`)
4. Follow DNS configuration instructions
5. Netlify provides **free SSL certificates** automatically

---

## 🔄 Continuous Deployment

Every time you push to GitHub `main` branch:
- Netlify automatically rebuilds and redeploys
- Changes go live in ~2 minutes
- No manual deployment needed!

To disable auto-deploy:
- Site settings → Build & deploy → Stop builds

---

## 📊 Monitoring

**View Analytics**:
- Netlify Dashboard → Analytics
- See page views, function invocations, bandwidth usage

**Function Logs**:
- Functions tab → Click function name
- View all invocations, errors, execution time

---

## 🎉 Success!

Your full-stack FCRM Data Analyst Copilot is now live on Netlify with:
- ✅ Frontend hosted on global CDN
- ✅ Backend running as serverless function
- ✅ AI Assistant powered by Gemini 2.5 Flash
- ✅ Automatic deployments on git push
- ✅ Free SSL certificate
- ✅ Global edge network

**Share your demo**: Send the Netlify URL to stakeholders! 🚀

---

## 📚 Next Steps

- **Custom branding**: Update ING logo, colors
- **Analytics**: Add Google Analytics or Plausible
- **More mock data**: Expand the demo cases
- **Authentication**: Add Netlify Identity if needed
- **Database**: Connect to real FCRM data source (future)

---

**Questions?** Check the main `README.md` or `DEPLOYMENT.md` files.
