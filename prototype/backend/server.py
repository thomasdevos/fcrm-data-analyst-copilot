#!/usr/bin/env python3
"""
FCRM Data Analyst Copilot - Backend API Server
Powered by Gemini 2.5 Flash
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    print("⚠️  WARNING: GOOGLE_API_KEY not found in environment variables!")
    print("Please set your Google API key in the .env file")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Initialize Gemini 2.5 Flash model
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# System prompt for the FCRM AI Assistant
SYSTEM_PROMPT = """You are an expert FCRM (Financial Crime Risk Management) Data Analyst Copilot assistant for ING Bank.

Your role is to help L1 FCFP (Financial Crime and Fraud Prevention) analysts with:
- Case investigation and data summarization
- Risk assessment analysis
- Transaction pattern analysis
- Sanctions screening interpretation
- KYC profile review
- Alert triage support

You have access to case data from the Fiserv AML/FCRM data model including:
- **Cases** (aml.case): Case numbers, status, priority, case types (AML_ALERT, SANCTIONS, KYC_REVIEW)
- **Parties** (aml.party): Customer information, PEP flags, risk categories, addresses
- **Accounts** (aml.account): Account types, status, currency information
- **Transactions** (aml.transaction): Transaction amounts, types, channels, locations
- **Alerts** (aml.alert): Alert scenarios, priorities, detection methods
- **Risk Assessments** (aml.party_risk_assessment): Risk scores, risk levels, contributing factors
- **Screening Hits** (aml.screening_hit): Sanctions list matches, match scores, dispositions
- **KYC Profiles** (aml.kyc_profile): KYC levels, review dates, status

Important guidelines:
1. **Be concise and actionable** - Analysts need quick, clear insights
2. **Use markdown formatting** for better readability (bold for **important terms**, bullet lists, tables)
3. **Cite data sources** - Reference specific case numbers, party IDs, transaction IDs when applicable
4. **Explain risk factors** - Help analysts understand WHY something was flagged
5. **No recommendations** - You provide information and analysis, NOT triage decisions (e.g., don't say "close" or "escalate")
6. **Be transparent** - If you don't have enough information, say so
7. **Factual accuracy** - Only use information from the provided case data, never make up details

When summarizing a case, include:
- Case overview (number, status, priority, type)
- Party details (name, type, risk level, PEP status)
- Transaction summary (count, total value, unusual patterns)
- Risk assessment (score, level, key contributing factors)
- Alert scenario details
- Any screening hits or KYC concerns

Remember: You are an AI ASSISTANT, not a decision-maker. Your goal is to accelerate information gathering and investigation, not to replace analyst judgment.
"""


def format_case_context(cases, selected_case=None):
    """Format case data for Gemini context"""
    context = ""

    if selected_case:
        context += f"\n=== CURRENTLY SELECTED CASE ===\n"
        context += json.dumps(selected_case, indent=2)
        context += "\n\n"

    if cases:
        context += f"\n=== ALL AVAILABLE CASES ({len(cases)} total) ===\n"
        # Provide summary of all cases
        for case in cases[:20]:  # Limit to prevent token overflow
            context += f"\n- {case.get('case_number')}: {case.get('summary')} "
            context += f"(Status: {case.get('status')}, Priority: {case.get('priority')}, "
            context += f"Risk: {case.get('risk_assessment', {}).get('risk_level')})\n"

    return context


@app.route('/api/fcrm/cases', methods=['GET'])
def get_cases():
    """Return mock FCRM cases"""
    # In production, this would query the actual FCRM database
    # For now, return empty array - frontend will use local mock data
    return jsonify([])


@app.route('/api/assistant/query', methods=['POST'])
def query_assistant():
    """Handle AI Assistant queries with Gemini 2.5 Flash"""
    try:
        data = request.json
        user_query = data.get('query', '')
        cases = data.get('cases', [])
        selected_case = data.get('selectedCase')

        if not user_query:
            return jsonify({'error': 'Query is required'}), 400

        # Check if API key is configured
        if not GOOGLE_API_KEY:
            return jsonify({
                'response': """❌ **Google API Key Not Configured**

The Gemini API key is not set. To enable AI Assistant functionality:

1. Get a Google API key from: https://makersuite.google.com/app/apikey
2. Create a `.env` file in the `prototype/backend/` directory
3. Add your key: `GOOGLE_API_KEY=your_api_key_here`
4. Restart the backend server

**Demo Mode**: I can see the case data but cannot generate AI responses without the API key.""",
                'metadata': {'error': 'api_key_missing'}
            }), 200

        # Build context from case data
        case_context = format_case_context(cases, selected_case)

        # Build the full prompt
        full_prompt = f"""{SYSTEM_PROMPT}

{case_context}

=== ANALYST QUESTION ===
{user_query}

=== YOUR RESPONSE ===
Provide a helpful, concise response based on the available FCRM case data. Use markdown formatting for clarity.
"""

        # Generate response using Gemini 2.5 Flash
        response = model.generate_content(full_prompt)

        # Extract response text
        ai_response = response.text

        # Extract any case IDs mentioned for metadata
        mentioned_cases = []
        for case in cases:
            if case.get('case_number') in ai_response or str(case.get('case_id')) in ai_response:
                mentioned_cases.append(case.get('case_number'))

        return jsonify({
            'response': ai_response,
            'metadata': {
                'caseIds': mentioned_cases,
                'model': 'gemini-2.0-flash-exp',
                'hasContext': selected_case is not None
            }
        })

    except Exception as e:
        print(f"Error processing query: {str(e)}")
        return jsonify({
            'response': f"""Sorry, I encountered an error processing your request.

**Error:** {str(e)}

Please try again or rephrase your question.""",
            'metadata': {'error': str(e)}
        }), 200  # Return 200 to allow frontend to display the error message


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model': 'gemini-2.0-flash-exp',
        'api_key_configured': bool(GOOGLE_API_KEY)
    })


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 FCRM Data Analyst Copilot - Backend Server")
    print("=" * 60)
    print(f"Model: Gemini 2.5 Flash (gemini-2.0-flash-exp)")
    print(f"API Key Configured: {'✅ Yes' if GOOGLE_API_KEY else '❌ No - Set GOOGLE_API_KEY in .env'}")
    print(f"Server: http://localhost:8000")
    print("=" * 60)
    print()

    app.run(host='0.0.0.0', port=8000, debug=True)
