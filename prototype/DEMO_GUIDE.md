# FCRM Data Analyst Copilot - Demo Guide

## 🎬 How to Demonstrate the Prototype

### Quick Start
1. Ensure both backend and frontend are running
2. Open http://localhost:5173 in your browser
3. Click the **pulsing orange AI Assistant button** in the bottom-right corner

---

## 📝 Demo Script Examples

### **Example 1: Overview Questions**

**Query:** "Give me a summary of all cases"

**Expected Response:** AI will summarize all 3 mock cases including:
- Case numbers, statuses, priorities
- Party names and types
- Risk levels and scores
- Alert scenarios

---

### **Example 2: High-Risk Case Analysis**

**Query:** "What are all the high-risk cases and why are they flagged?"

**Expected Response:** AI will identify:
- FCRM-2025-001234 (Global Innovations B.V.) - HIGH risk
- FCRM-2025-001235 (Petrov Industries Ltd.) - CRITICAL risk
- Explanation of risk factors for each

---

### **Example 3: Detailed Case Investigation**

**Steps:**
1. Click on **case FCRM-2025-001234** from the Dashboard
2. Open AI Assistant
3. Notice the context alert: "Context: Case FCRM-2025-001234 selected"

**Query:** "Give me a detailed summary of case FCRM-2025-001234"

**Expected Response:** Comprehensive summary including:
- Party details (Global Innovations B.V.)
- Alert scenario (High-value wire transfer velocity)
- Transaction analysis (4 wire transfers totaling €185,000)
- Risk assessment (score 78.5, HIGH level)
- Risk factors breakdown

---

### **Example 4: Transaction Pattern Analysis**

**Query (with case selected):** "Analyze the transaction patterns in this case"

**Expected Response:**
- Transaction velocity analysis
- Geographic patterns (Netherlands, Germany, Switzerland, Singapore)
- Amount progression (€35k → €45k → €50k → €55k)
- Channel analysis (WIRE_TRANSFER)
- Red flags or patterns of concern

---

### **Example 5: Party-Specific Questions**

**Query:** "Why was Global Innovations B.V. flagged as high risk?"

**Expected Response:**
- PEP flag status
- Risk category (HIGH_RISK)
- Contributing factors:
  - Geographic risk (40% contribution)
  - Transaction velocity (30% contribution)
  - Business model risk (20% contribution)
  - KYC gaps (10% contribution)

---

### **Example 6: Sanctions Screening**

**Query:** "What sanctions screening hits do we have?"

**Expected Response:**
- Case FCRM-2025-001235 (Petrov Industries Ltd.)
- List: EU_SANCTIONS
- Match score: 87%
- Status: FALSE_POSITIVE
- Disposition explanation

---

### **Example 7: Cross-Case Comparison**

**Query:** "Compare the risk scores across all cases"

**Expected Response:**
- FCRM-2025-001235: 95.2 (CRITICAL)
- FCRM-2025-001234: 78.5 (HIGH)
- FCRM-2025-001236: 62.0 (MEDIUM)
- Explanation of risk score methodology
- Key differentiators between cases

---

### **Example 8: Alert Scenario Explanation**

**Query (with case FCRM-2025-001236 selected):** "Explain the alert scenario: Rapid cash withdrawal structuring"

**Expected Response:**
- What structuring means (keeping transactions under €10k threshold)
- Why it's suspicious (potential money laundering)
- Pattern in this case (5 withdrawals: €9.8k, €9.5k, €9.7k, €9.9k, €9.6k)
- Regulatory context (CTF reporting requirements)

---

### **Example 9: Case Status Overview**

**Query:** "What are the critical and high priority cases?"

**Expected Response:**
- CRITICAL: FCRM-2025-001235 (Sanctions screening)
- HIGH: FCRM-2025-001234 (Wire transfer velocity)
- Current status of each
- Recommended next steps (information only, no triage decisions)

---

### **Example 10: KYC and Compliance**

**Query:** "Tell me about the KYC profiles and compliance status"

**Expected Response:**
- KYC levels for each party
- Review dates and statuses
- Any KYC gaps or concerns
- Next review due dates

---

## 🎯 Demonstration Tips

### **Visual Elements to Highlight:**

1. **Dashboard Statistics**
   - 3 total cases
   - Color-coded priority levels
   - Status breakdown

2. **Case Cards**
   - Severity-based border colors (red for CRITICAL, orange for HIGH)
   - Comprehensive case preview
   - One-click navigation to details

3. **Case Viewer**
   - All FCRM data model sections visible
   - Party information with PEP flags
   - Risk assessment with visual score display
   - Transaction table with amounts and locations
   - Sanctions screening hits (when applicable)

4. **AI Assistant**
   - Pulsing orange FAB button (ING branding)
   - Drawer interface with professional styling
   - Contextual suggestion chips
   - Markdown-formatted responses
   - Loading states ("Analyzing...")
   - Case context awareness

### **Key Features to Demonstrate:**

✅ **Enter Key Works** - Type a query and press Enter
✅ **Send Button** - Click the → button to send
✅ **Suggestion Chips** - Click any suggested question
✅ **Context Awareness** - Select a case to get case-specific suggestions
✅ **Markdown Formatting** - AI responses use headers, bold, lists, tables
✅ **Referenced Cases** - AI tracks which cases are mentioned

---

## 🚀 Demo Flow Recommendation

### **5-Minute Demo:**

1. **Start on Dashboard** (30 seconds)
   - Show case overview statistics
   - Point out severity color coding

2. **Click High-Risk Case** (30 seconds)
   - Navigate to FCRM-2025-001234 details
   - Scroll through comprehensive case data

3. **Open AI Assistant** (30 seconds)
   - Click pulsing FAB button
   - Show welcome message and demo examples

4. **Try Suggestion Chip** (1 minute)
   - Click: "Give me a detailed summary of case FCRM-2025-001234"
   - Wait for Gemini response
   - Highlight markdown formatting

5. **Custom Query** (1 minute)
   - Type: "Analyze the transaction patterns in this case"
   - Press Enter
   - Show transaction pattern analysis

6. **Cross-Case Query** (1 minute)
   - Type: "Compare risk scores across all cases"
   - Show comparative analysis

7. **Wrap Up** (30 seconds)
   - Show contextual suggestions updating
   - Point out case context awareness

---

## 🐛 Troubleshooting

### **Issue: AI doesn't respond**
- Check backend is running on port 8000
- Verify GEMINI_API_KEY is set in .env
- Check browser console for errors

### **Issue: "API Key Not Configured" message**
- Backend detected missing API key
- Copy .env.example to .env
- Add your Google API key
- Restart backend server

### **Issue: Enter key doesn't work**
- Fixed in latest version (using onKeyDown)
- Refresh the page
- Alternatively, use the Send button →

---

## 📊 Mock Data Reference

### **Case FCRM-2025-001234**
- Party: Global Innovations B.V. (ORGANIZATION)
- Type: AML_ALERT
- Priority: HIGH
- Risk Score: 78.5
- Transactions: 4 wire transfers (€185,000 total)

### **Case FCRM-2025-001235**
- Party: Petrov Industries Ltd. (ORGANIZATION)
- Type: SANCTIONS
- Priority: CRITICAL
- Risk Score: 95.2
- Sanctions Hit: EU_SANCTIONS (87% match, FALSE_POSITIVE)

### **Case FCRM-2025-001236**
- Party: Maria Silva (INDIVIDUAL)
- Type: AML_ALERT
- Priority: MEDIUM
- Risk Score: 62.0
- Transactions: 5 cash withdrawals (€48,400 total, structured)

---

**Good luck with your demo! 🎉**
