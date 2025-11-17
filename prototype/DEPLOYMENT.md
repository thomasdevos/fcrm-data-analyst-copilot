# Deployment Guide - FCRM Data Analyst Copilot

## Option 1: Deploy Frontend to Netlify (Quick Demo)

This deploys the frontend with mock data. The AI Assistant will show an error since there's no backend, but all case viewing features work perfectly.

### Steps:

1. **Push your code to GitHub** (if not already done)
   ```bash
   cd /Users/thomas.devos/_dev_projects/ai-labs-projects/projects/ING/analyst-data-copilot
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Deploy to Netlify**

   **Option A: Via Netlify Dashboard (Easiest)**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Configure build settings:
     - **Base directory**: `prototype/frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `prototype/frontend/dist`
   - Click "Deploy site"

   **Option B: Via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Navigate to frontend directory
   cd prototype/frontend

   # Deploy
   netlify deploy --prod
   ```

3. **Configure the Site**
   - Netlify will auto-detect the `netlify.toml` configuration
   - Your site will be live at a URL like: `https://your-site-name.netlify.app`

### Note:
The AI Assistant will show an error message about the backend not being available. This is expected. All other features (Dashboard, Case Search, Case Details) will work perfectly with the mock data.

---

## Option 2: Full Stack Deployment (Frontend + Backend)

For the AI Assistant to work, you need to deploy both frontend and backend.

### 2A: Backend on Google Cloud Run + Frontend on Netlify

**Deploy Backend to Google Cloud Run:**

1. **Create a Dockerfile** for the backend:
   ```dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   ENV PORT=8080
   ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

   CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
   ```

2. **Add gunicorn to requirements.txt**:
   ```
   gunicorn==21.2.0
   ```

3. **Deploy to Cloud Run**:
   ```bash
   cd prototype/backend

   # Set your project ID
   gcloud config set project YOUR_PROJECT_ID

   # Build and deploy
   gcloud run deploy fcrm-copilot-backend \
     --source . \
     --platform managed \
     --region europe-west1 \
     --allow-unauthenticated \
     --set-env-vars GOOGLE_API_KEY=your_api_key_here
   ```

4. **Update Frontend to use Cloud Run backend**:
   - In `prototype/frontend/src/components/AIAssistant.jsx`
   - Change fetch URL from `/api/assistant/query` to `https://your-cloud-run-url.run.app/api/assistant/query`

5. **Deploy Frontend to Netlify** (same as Option 1)

### 2B: Backend on Render.com + Frontend on Netlify

**Deploy Backend to Render:**

1. Go to [https://render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `fcrm-copilot-backend`
   - **Root Directory**: `prototype/backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app`
   - **Environment Variables**: Add `GOOGLE_API_KEY`
5. Deploy

6. Update frontend to use Render backend URL

### 2C: Both on Netlify (Using Netlify Functions)

This is more complex but keeps everything in one place. You'd need to convert the Flask backend to Netlify Functions (serverless).

---

## Option 3: Deploy to Vercel (Alternative to Netlify)

Vercel is similar to Netlify and also supports React apps:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd prototype/frontend

# Deploy
vercel --prod
```

**Configure in `vercel.json`**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## Recommended Approach for Quick Demo

**✅ Use Option 1**: Deploy frontend only to Netlify

**Why:**
- Fastest to deploy (5 minutes)
- No backend hosting costs
- Mock data works perfectly
- All case viewing features are functional
- Only AI Assistant won't work (which can be explained as "backend not deployed yet")

**For Full Demo with AI:**
- Deploy backend to **Google Cloud Run** (free tier available)
- Deploy frontend to **Netlify** (free tier)
- Update frontend API URLs to point to Cloud Run

---

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify mock data displays on Dashboard
- [ ] Test Case Search functionality
- [ ] Verify Case Details page shows all information
- [ ] Test filter clicks on Dashboard stat cards
- [ ] Check mobile responsiveness
- [ ] (If backend deployed) Test AI Assistant queries

---

## Troubleshooting

**Issue: Blank page after deployment**
- Check build logs in Netlify dashboard
- Verify `dist` folder is being published
- Check browser console for errors

**Issue: Routes not working (404 on refresh)**
- Ensure `netlify.toml` redirects are configured
- The redirect rule handles SPA routing

**Issue: CORS errors with backend**
- Add your Netlify domain to CORS allowed origins in Flask backend
- Update `CORS(app)` to `CORS(app, origins=['https://your-netlify-site.netlify.app'])`

---

## Custom Domain (Optional)

Once deployed, you can add a custom domain:

1. Go to Netlify dashboard → Domain settings
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Netlify provides free SSL certificates automatically

---

**Questions?** Check the main README.md for local development setup.
