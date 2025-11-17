import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  CircularProgress,
  Chip,
  Fab,
  Badge,
  Tooltip,
  Alert,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 102, 0, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 102, 0, 0);
  }
`;

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: 'white',
  animation: `${pulseAnimation} 2s infinite`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
    animation: 'none',
  },
  width: 70,
  height: 70,
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  padding: '1.5rem',
  color: 'white',
  borderBottom: '3px solid rgba(255, 255, 255, 0.2)',
}));

const MessageBubble = styled(Paper)(({ isUser, theme }) => ({
  padding: '1rem',
  marginBottom: '1rem',
  maxWidth: '85%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : 'white',
  color: isUser ? 'white' : 'inherit',
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  boxShadow: theme.shadows[2],
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  margin: '0.25rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    transform: 'translateY(-2px)',
  }
}));

const AIAssistant = ({ cases, selectedCase }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm your **FCRM Data Analyst Copilot**, powered by Gemini 2.5 Flash. I can help you with:

### 🔍 **What I Can Do:**
- **Proactive Summarization**: Provide concise summaries of case data
- **Interactive Q&A**: Answer questions about cases, parties, transactions, and risk assessments
- **Data Analysis**: Analyze patterns, risk factors, and transaction anomalies
- **Investigation Support**: Help you understand alert scenarios and compliance issues

### 💡 **Demo Examples - Try These:**
- "Give me a detailed summary of case FCRM-2025-001234"
- "What are all the high-risk cases and why are they flagged?"
- "Analyze the transaction patterns in case FCRM-2025-001234"
- "Why was Global Innovations B.V. flagged as high risk?"
- "Compare the risk scores across all cases"
- "What sanctions screening hits do we have?"

### ⌨️ **How to Use:**
- Click any suggestion chip below
- Type your question and press **Enter** or click the **Send button** →
- Select a case first to get case-specific insights

I have access to the FCRM data model including parties, accounts, transactions, alerts, risk assessments, and KYC profiles. How can I assist you today?`,
        timestamp: new Date()
      }]);
    }
  };

  const handleClose = () => setOpen(false);

  // Generate contextual suggestions based on current context
  const getContextualSuggestions = () => {
    const baseSuggestions = [
      "Give me a summary of all cases",
      "What are the critical and high priority cases?",
      "Compare risk scores across all cases",
      "Show me cases with sanctions screening hits",
      "Explain why Global Innovations B.V. was flagged"
    ];

    const contextualSuggestions = [];

    if (selectedCase) {
      contextualSuggestions.push(`Give me a detailed summary of case ${selectedCase.case_number}`);
      contextualSuggestions.push(`Why was ${selectedCase.party.full_name} flagged?`);
      if (selectedCase.transactions && selectedCase.transactions.length > 0) {
        contextualSuggestions.push("Analyze the transaction patterns in this case");
      }
      if (selectedCase.risk_assessment) {
        contextualSuggestions.push("Explain the risk factors contributing to this case");
      }
      if (selectedCase.alert) {
        contextualSuggestions.push(`Explain the alert scenario: ${selectedCase.alert.scenario.name}`);
      }
    }

    if (cases && cases.length > 0) {
      const highRiskCases = cases.filter(c => c.risk_assessment.risk_level === 'HIGH' || c.risk_assessment.risk_level === 'CRITICAL');
      if (highRiskCases.length > 0) {
        contextualSuggestions.push("What are all the high-risk cases and why?");
      }

      const sanctionsCases = cases.filter(c => c.case_type === 'SANCTIONS');
      if (sanctionsCases.length > 0) {
        contextualSuggestions.push("Tell me about the sanctions screening cases");
      }
    }

    return [...contextualSuggestions, ...baseSuggestions].slice(0, 6);
  };

  const suggestedQueries = getContextualSuggestions();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Use Netlify Function in production, local backend in development
      const apiUrl = import.meta.env.DEV
        ? '/api/assistant/query'  // Local development
        : '/.netlify/functions/assistant';  // Production on Netlify

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          cases: cases,
          selectedCase: selectedCase
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        metadata: data.metadata,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (!open) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error querying AI assistant:', error);
      const errorMessage = {
        role: 'assistant',
        content: `I apologize, but I encountered an error processing your request. Please ensure the backend server is running and try again.

**Error details:** ${error.message}

You can start the backend server with:
\`\`\`bash
cd prototype/backend
python server.py
\`\`\``,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (query) => {
    setInput(query);
    // Auto-send the suggestion
    setTimeout(() => {
      const event = { target: { value: query } };
      setInput(query);
      // Trigger send after state updates
      setTimeout(() => handleSend(), 50);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Tooltip title="FCRM AI Assistant - Powered by Gemini 2.5" placement="left">
        <Badge badgeContent={unreadCount} color="error">
          <StyledFab
            onClick={handleOpen}
            aria-label="FCRM AI Assistant"
          >
            <AutoAwesomeIcon sx={{ fontSize: '2rem' }} />
          </StyledFab>
        </Badge>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '500px', md: '600px' },
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <HeaderBox>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: '2.5rem' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                FCRM AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Powered by Gemini 2.5 Flash
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Ask me anything about FCRM cases, risk assessments, and compliance data
          </Typography>
        </HeaderBox>

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '90%'
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: message.role === 'user' ? '#000066' : '#FF6600',
                    color: 'white',
                    flexShrink: 0
                  }}
                >
                  {message.role === 'user' ? (
                    <PersonIcon sx={{ fontSize: '1.5rem' }} />
                  ) : (
                    <SmartToyIcon sx={{ fontSize: '1.5rem' }} />
                  )}
                </Box>

                <MessageBubble isUser={message.role === 'user'} elevation={2}>
                  <Box
                    sx={{
                      '& p': { margin: '0.5em 0' },
                      '& h3': { margin: '1em 0 0.5em', fontSize: '1.1rem', fontWeight: 600 },
                      '& ul': { marginLeft: '1.5em' },
                      '& code': {
                        backgroundColor: message.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em'
                      },
                      '& pre': {
                        backgroundColor: message.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        '& code': {
                          backgroundColor: 'transparent',
                          padding: 0
                        }
                      },
                      '& strong': {
                        fontWeight: 700,
                        color: message.role === 'user' ? 'white' : 'inherit'
                      }
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </Box>

                  {message.metadata && message.metadata.caseIds && message.metadata.caseIds.length > 0 && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Referenced cases: {message.metadata.caseIds.join(', ')}
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      opacity: 0.7,
                      fontSize: '0.7rem'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </MessageBubble>
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FF6600',
                    color: 'white',
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: '1.5rem' }} />
                </Box>
                <Paper sx={{ p: 2, borderRadius: '18px 18px 18px 4px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">Analyzing...</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          {/* Contextual Suggested Queries */}
          {messages.length > 0 && !loading && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                💡 Suggested questions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {suggestedQueries.map((query, index) => (
                  <SuggestionChip
                    key={index}
                    label={query}
                    size="small"
                    onClick={() => handleSuggestion(query)}
                    icon={<AutoAwesomeIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={loading}
                  />
                ))}
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {selectedCase && (
            <Alert severity="info" sx={{ mb: 2 }} icon={false}>
              <Typography variant="caption">
                <strong>Context:</strong> Case {selectedCase.case_number} selected
              </Typography>
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about cases, parties, transactions, risk scores..."
              variant="outlined"
              size="small"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                }
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || loading}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AIAssistant;
