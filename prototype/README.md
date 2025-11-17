# FCRM Data Analyst Copilot - Prototype

A functional prototype of the **FCRM Data Analyst Copilot**, demonstrating GenAI-powered case investigation assistance for ING Bank's Financial Crime Risk Management (FCRM) analysts.

## 🎯 Overview

This prototype showcases two core capabilities:

1. **Proactive Summarization** - Comprehensive case data visualization with FCRM-specific insights
2. **Interactive Q&A** - AI Assistant powered by Gemini 2.5 Flash for natural language queries

Built with realistic mock data based on the Fiserv AML/FCRM logical data model.

---

## 🏗️ Architecture

**Frontend**: React 18 + Vite + Material-UI v5
**Backend**: Python Flask + Google Gemini 2.5 Flash
**Data**: Mock FCRM cases (simulated Fiserv AML data model)

```
prototype/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Dashboard, CaseSearch, CaseViewer, AIAssistant
│   │   ├── data/          # Mock FCRM cases
│   │   └── App.jsx        # Main application
│   └── package.json
└── backend/           # Flask API server
    ├── server.py          # Gemini integration
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Google API Key** for Gemini 2.5 Flash

### 1. Get Google API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### 2. Setup Backend

```bash
cd prototype/backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit .env and add your Google API key:
# GOOGLE_API_KEY=your_actual_api_key_here

# Start backend server
python server.py
```

Backend will run on **http://localhost:8000**

### 3. Setup Frontend

```bash
cd prototype/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:5173**

### 4. Open the Application

Navigate to **http://localhost:5173** in your browser.

---

## 💡 Features

### 📊 Dashboard
- **Overview Metrics**: Total cases, new cases, in-progress, closed, critical, and high-priority counts
- **Case Grid**: Visual cards with severity-based color coding
- **Quick Access**: Click any case card to view full details

### 🔍 Case Search
- **Smart Filtering**: Search by case number, party name, summary, or case type
- **Real-time Results**: Instant filtering as you type
- **Comprehensive Listing**: All FCRM case attributes visible

### 📋 Case Viewer
Complete case investigation details including:
- **Case Header**: Status, priority, case type, opened date
- **Alert Details**: Scenario name, description, alert ID, priority
- **Party Information**: Type, name, PEP flag, risk category, addresses
- **Account Information**: Account number, product type, status, currency
- **Risk Assessment**: Risk score visualization, risk level, contributing factors
- **Transaction Table**: Flagged transactions with amounts, types, channels, locations
- **Screening Hits**: Sanctions list matches (if applicable)
- **Case Notes**: Investigation timeline
- **KYC Profile**: KYC level, status, review dates

### 🤖 AI Assistant (Powered by Gemini 2.5 Flash)
- **Floating FAB**: Pulsing orange button (ING branding) in bottom-right corner
- **Drawer Interface**: Elegant slide-out panel with chat interface
- **Contextual Awareness**: Automatically includes selected case in queries
- **Smart Suggestions**: Dynamic question recommendations based on context
- **Markdown Rendering**: Formatted responses with tables, lists, code blocks
- **Case References**: Tracks which cases are mentioned in responses

#### Example Queries:
- "Summarize case FCRM-2025-001234"
- "What are the high-risk cases?"
- "Explain the sanctions screening process"
- "Show me all wire transfers over €40,000"
- "Why was Global Innovations B.V. flagged?"

---

## 🎨 Design

### ING Brand Colors
- **Primary Orange**: `#FF6600`
- **Secondary Navy**: `#000066`
- **Accent Colors**: Material-UI success, warning, error palettes

### UI/UX Highlights
- **Professional Design**: Clean, modern interface matching ING standards
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Accessibility**: Proper contrast ratios, ARIA labels, keyboard navigation
- **Visual Hierarchy**: Clear information architecture for rapid case triage

---

## 📁 Mock Data

The prototype includes 3 realistic FCRM cases:

1. **FCRM-2025-001234** - High-value cross-border wire transfers (HIGH, IN_PROGRESS)
2. **FCRM-2025-001235** - Sanctions screening false positive (CRITICAL, CLOSED)
3. **FCRM-2025-001236** - Cash structuring activity (MEDIUM, NEW)

All data structures match the **Fiserv AML/FCRM Logical Data Model** including:
- `aml.case` - Case management
- `aml.party` - Customer/organization details
- `aml.account` - Account information
- `aml.transaction` - Transaction records
- `aml.alert` - Alert scenarios
- `aml.party_risk_assessment` - Risk scoring
- `aml.screening_hit` - Sanctions matches
- `aml.kyc_profile` - KYC status

---

## 🔧 API Endpoints

### Backend API (`http://localhost:8000`)

**POST `/api/assistant/query`**
```json
{
  "query": "Summarize case FCRM-2025-001234",
  "cases": [...],
  "selectedCase": {...}
}
```

**Response:**
```json
{
  "response": "**Case Summary:**\n\n- Case: FCRM-2025-001234...",
  "metadata": {
    "caseIds": ["FCRM-2025-001234"],
    "model": "gemini-2.0-flash-exp",
    "hasContext": true
  }
}
```

**GET `/api/fcrm/cases`**
Returns empty array (frontend uses local mock data for prototype)

**GET `/health`**
Health check with API key configuration status

---

## 🧪 Testing the AI Assistant

1. **Open the application** at http://localhost:5173
2. **Click the pulsing orange FAB** in the bottom-right corner
3. **Try a suggested query** or type your own
4. **Select a case** from Dashboard or Case Search, then ask case-specific questions

### Expected Behavior:
- AI responds with formatted markdown
- Case references are tracked in metadata
- Context awareness (selected case is highlighted)
- Loading states show "Analyzing..."
- Error handling for missing API key or network issues

---

## 📝 Notes

- **Mock Data Only**: This prototype uses simulated FCRM data
- **Local Development**: Not production-ready (no authentication, no real database)
- **Gemini 2.5 Flash**: Model ID `gemini-2.0-flash-exp`
- **CORS Enabled**: Backend accepts requests from frontend dev server

---

## 🔒 Security Reminders

- **Never commit `.env` file** to version control
- **API keys are sensitive** - keep them secure
- **Production deployment** would require proper authentication, authorization, and data encryption

---

## 📚 Related Documentation

- **Project Micro Site**: `../public/index.html`
- **FCRM Data Model**: `../specs/fiserv_aml_fcrm_logical_model.sql`
- **Architecture Diagram**: `../public/analyst-copilot-gcp-architecture.svg`
- **Customer Feedback**: `../specs/analyst-data-copilot-v0.3.pdf`

---

## 🎉 Success Indicators

If everything is working correctly, you should see:

✅ Backend server running on port 8000
✅ Frontend dev server running on port 5173
✅ Dashboard displays 3 mock cases
✅ AI Assistant FAB is pulsing orange
✅ AI Assistant responds to queries with formatted text
✅ Case viewer shows comprehensive FCRM data

---

## 🌐 Deployment to Netlify

You can deploy this entire prototype (including the AI Assistant) to Netlify for free!

### Quick Deploy:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to https://app.netlify.com
   - Import from GitHub
   - Configure:
     - Base directory: `prototype/frontend`
     - Build command: `npm run build`
     - Publish directory: `prototype/frontend/dist`
   - Add environment variable: `GOOGLE_API_KEY` (your Gemini API key)
   - Deploy!

3. **AI Assistant Will Work!**
   - The backend runs as a Netlify Function (Python serverless)
   - No separate backend hosting needed
   - Everything runs on Netlify's free tier

📖 **Full deployment guide**: See `NETLIFY_FULL_STACK.md` for detailed instructions.

---

## 🤝 Support

For questions or issues with the prototype, please refer to the main project documentation or contact the development team.

---

**Built with ❤️ for ING Bank FCRM Analysts**
*Powered by Google Gemini 2.5 Flash*
