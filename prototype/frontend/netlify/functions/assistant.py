"""
Netlify Function for FCRM AI Assistant
Powered by Gemini 2.5 Flash
"""

import os
import json
import google.generativeai as genai

# Configure Gemini API
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY') or os.environ.get('GEMINI_API_KEY')
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

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


def handler(event, context):
    """Netlify Function handler"""

    # Handle CORS preflight
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': ''
        }

    # Only accept POST requests
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        # Parse request body
        body = json.loads(event['body'])
        user_query = body.get('query', '')
        cases = body.get('cases', [])
        selected_case = body.get('selectedCase')

        if not user_query:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Query is required'})
            }

        # Check if API key is configured
        if not GOOGLE_API_KEY:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'response': """❌ **Google API Key Not Configured**

The Gemini API key is not set. To enable AI Assistant functionality:

1. Get a Google API key from: https://makersuite.google.com/app/apikey
2. Add it to Netlify environment variables:
   - Go to Site settings → Environment variables
   - Add variable: `GOOGLE_API_KEY` or `GEMINI_API_KEY`
   - Set your API key as the value
3. Redeploy the site

**Demo Mode**: I can see the case data but cannot generate AI responses without the API key.""",
                    'metadata': {'error': 'api_key_missing'}
                })
            }

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

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'response': ai_response,
                'metadata': {
                    'caseIds': mentioned_cases,
                    'model': 'gemini-2.0-flash-exp',
                    'hasContext': selected_case is not None
                }
            })
        }

    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'response': f"""Sorry, I encountered an error processing your request.

**Error:** {str(e)}

Please try again or rephrase your question.""",
                'metadata': {'error': str(e)}
            })
        }
