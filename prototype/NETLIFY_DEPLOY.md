# Quick Netlify Deployment Guide

## 🚀 Fastest Way to Deploy (5 minutes)

### Method 1: Netlify Dashboard (No CLI needed)

1. **Build the frontend locally to test**:
   ```bash
   cd prototype/frontend
   npm install
   npm run build
   ```

   If this succeeds, you're ready to deploy!

2. **Push to GitHub**:
   ```bash
   cd /Users/thomas.devos/_dev_projects/ai-labs-projects/projects/ING/analyst-data-copilot
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

3. **Deploy via Netlify Dashboard**:
   - Go to: https://app.netlify.com
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** and authorize Netlify
   - Select repository: **`fcrm-data-analyst-copilot`**
   - Configure build settings:
     ```
     Base directory:    prototype/frontend
     Build command:     npm run build
     Publish directory: prototype/frontend/dist
     ```
   - Click **"Deploy site"**

4. **Done!** 🎉
   - Netlify will build and deploy your site
   - You'll get a URL like: `https://random-name-12345.netlify.app`
   - You can customize this name in Site Settings

---

### Method 2: Netlify CLI (For Advanced Users)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Navigate to frontend directory
cd prototype/frontend

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Or deploy directly
netlify deploy --prod --dir=dist --build
```

---

## ✅ What Works on Netlify

- ✅ **Dashboard** - Full case overview with statistics
- ✅ **Case Search** - Search and filter cases
- ✅ **Case Details** - Complete case information viewer
- ✅ **Clickable Filters** - Filter by status and priority
- ✅ **Mock Data** - All 3 FCRM cases display correctly
- ✅ **Responsive Design** - Works on mobile, tablet, desktop

## ⚠️ What Won't Work (Without Backend)

- ❌ **AI Assistant** - Will show error message (backend not deployed)

The AI Assistant will display a user-friendly error message explaining that the backend is not available. All other features work perfectly!

---

## 🔧 Optional: Custom Site Name

After deployment, change your site name:

1. Go to **Site settings** → **Site details**
2. Click **"Change site name"**
3. Enter: `fcrm-analyst-copilot` or `ing-fcrm-copilot`
4. Your new URL: `https://fcrm-analyst-copilot.netlify.app`

---

## 🌐 Optional: Deploy Backend to Google Cloud Run

If you want the AI Assistant to work:

```bash
cd prototype/backend

# Deploy to Cloud Run
gcloud run deploy fcrm-copilot-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_API_KEY=your_key_here
```

Then update the frontend to use the Cloud Run URL (see DEPLOYMENT.md for details).

---

## 📱 Share Your Demo

Once deployed, you can share the Netlify URL with stakeholders for instant access to the demo - no installation required!

---

**Need help?** Check `DEPLOYMENT.md` for more deployment options.
