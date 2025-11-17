import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Fade,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CaseSearch from './components/CaseSearch';
import CaseViewer from './components/CaseViewer';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';

// ING Theme with official colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6600', // ING Orange
      dark: '#CC5200',
      light: '#FF8533',
    },
    secondary: {
      main: '#000066', // ING Navy Blue
      dark: '#000044',
      light: '#000088',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#FF6600',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#FFFFFF',
      paper: '#ffffff',
    },
    text: {
      primary: '#000066',
      secondary: 'rgba(0, 0, 102, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 8px 24px rgba(0,0,0,0.12)',
    '0 12px 32px rgba(0,0,0,0.15)',
    ...Array(20).fill('0 4px 12px rgba(0,0,0,0.08)'),
  ],
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCase, setSelectedCase] = useState(null);
  const [casesData, setCasesData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load mock FCRM cases from local data
    // In production, this would fetch from the backend API
    import('./data/mockCases.js').then(module => {
      setCasesData(module.default);
      setIsLoaded(true);
    }).catch(err => {
      console.error('Error loading mock cases:', err);
      setIsLoaded(true);
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCaseSelect = (caseData) => {
    setSelectedCase(caseData);
    setCurrentTab(2); // Switch to case details tab
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <StyledAppBar position="static" elevation={0}>
          <Toolbar sx={{ padding: { xs: 2, md: 3 } }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>
                FCRM Data Analyst Copilot
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, color: 'white' }}>
                GenAI-Powered Financial Crime Investigation Assistant
              </Typography>
            </Box>
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="navigation tabs">
              <Tab
                icon={<DashboardIcon />}
                iconPosition="start"
                label="Dashboard"
                sx={{ fontWeight: 600 }}
              />
              <Tab
                icon={<SearchIcon />}
                iconPosition="start"
                label="Case Search"
                sx={{ fontWeight: 600 }}
              />
              <Tab
                icon={<AssessmentIcon />}
                iconPosition="start"
                label="Case Details"
                sx={{ fontWeight: 600 }}
                disabled={!selectedCase}
              />
            </Tabs>
          </Paper>

          {currentTab === 0 && (
            <Fade in={isLoaded} timeout={800}>
              <Box>
                <Dashboard cases={casesData} onCaseSelect={handleCaseSelect} />
              </Box>
            </Fade>
          )}

          {currentTab === 1 && (
            <Fade in timeout={800}>
              <Box>
                <CaseSearch cases={casesData} onCaseSelect={handleCaseSelect} />
              </Box>
            </Fade>
          )}

          {currentTab === 2 && selectedCase && (
            <Fade in timeout={800}>
              <Box>
                <CaseViewer caseData={selectedCase} />
              </Box>
            </Fade>
          )}
        </Container>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Powered by Gemini 2.5 Flash | FCRM Data Model | HCLTech + ING Co-Innovation
          </Typography>
        </Box>

        {/* AI Assistant - Floating button and drawer */}
        <AIAssistant cases={casesData} selectedCase={selectedCase} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
