import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  LinearProgress,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

const StyledCard = styled(Card)(({ theme, severity }) => {
  const colors = {
    CRITICAL: { bg: '#fee', border: theme.palette.error.main },
    HIGH: { bg: '#fff3e0', border: theme.palette.warning.main },
    MEDIUM: { bg: '#e3f2fd', border: theme.palette.primary.light },
    LOW: { bg: '#f1f8e9', border: theme.palette.success.light }
  };
  const colorSet = colors[severity] || colors.MEDIUM;

  return {
    borderLeft: `4px solid ${colorSet.border}`,
    backgroundColor: colorSet.bg,
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    }
  };
});

const StatCard = styled(Paper)(({ theme, active }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: active
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.05)' : 'scale(1)',
  boxShadow: active ? theme.shadows[4] : theme.shadows[2],
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  }
}));

const FilterableStatCard = styled(Paper)(({ theme, active }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.05)' : 'scale(1)',
  boxShadow: active ? theme.shadows[4] : theme.shadows[1],
  border: active ? '3px solid' : '1px solid transparent',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[3],
  }
}));

const Dashboard = ({ cases, onCaseSelect }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const stats = {
    total: cases.length,
    new: cases.filter(c => c.status === 'NEW').length,
    inProgress: cases.filter(c => c.status === 'IN_PROGRESS').length,
    closed: cases.filter(c => c.status === 'CLOSED').length,
    critical: cases.filter(c => c.priority === 'CRITICAL').length,
    high: cases.filter(c => c.priority === 'HIGH').length,
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const getFilteredCases = () => {
    if (!activeFilter) return cases;

    switch (activeFilter) {
      case 'new':
        return cases.filter(c => c.status === 'NEW');
      case 'inProgress':
        return cases.filter(c => c.status === 'IN_PROGRESS');
      case 'closed':
        return cases.filter(c => c.status === 'CLOSED');
      case 'critical':
        return cases.filter(c => c.priority === 'CRITICAL');
      case 'high':
        return cases.filter(c => c.priority === 'HIGH');
      default:
        return cases;
    }
  };

  const filteredCases = getFilteredCases();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NEW': return <PendingIcon color="warning" />;
      case 'IN_PROGRESS': return <WarningAmberIcon color="info" />;
      case 'CLOSED': return <CheckCircleIcon color="success" />;
      default: return <ErrorIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'warning';
      case 'IN_PROGRESS': return 'info';
      case 'CLOSED': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Statistics Cards - Now Clickable Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard elevation={3} active={activeFilter === null} onClick={() => setActiveFilter(null)}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Cases
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterableStatCard
            sx={{ bgcolor: '#fff3e0', borderColor: 'warning.main' }}
            active={activeFilter === 'new'}
            onClick={() => handleFilterClick('new')}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
              {stats.new}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New Cases
            </Typography>
          </FilterableStatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterableStatCard
            sx={{ bgcolor: '#e3f2fd', borderColor: 'info.main' }}
            active={activeFilter === 'inProgress'}
            onClick={() => handleFilterClick('inProgress')}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </FilterableStatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterableStatCard
            sx={{ bgcolor: '#e8f5e9', borderColor: 'success.main' }}
            active={activeFilter === 'closed'}
            onClick={() => handleFilterClick('closed')}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
              {stats.closed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Closed
            </Typography>
          </FilterableStatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterableStatCard
            sx={{ bgcolor: '#fee', borderColor: 'error.main' }}
            active={activeFilter === 'critical'}
            onClick={() => handleFilterClick('critical')}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
              {stats.critical}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Critical
            </Typography>
          </FilterableStatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FilterableStatCard
            sx={{ bgcolor: '#fff3e0', borderColor: 'warning.main' }}
            active={activeFilter === 'high'}
            onClick={() => handleFilterClick('high')}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
              {stats.high}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Priority
            </Typography>
          </FilterableStatCard>
        </Grid>
      </Grid>

      {/* Cases List */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {activeFilter ? `Filtered Cases (${filteredCases.length})` : 'Recent Alerts & Cases'}
        </Typography>
        {activeFilter && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListOffIcon />}
            onClick={() => setActiveFilter(null)}
            sx={{ borderRadius: '20px' }}
          >
            Clear Filter
          </Button>
        )}
      </Box>

      {filteredCases.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, width: '100%' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cases found matching the current filter
          </Typography>
          <Button
            variant="contained"
            onClick={() => setActiveFilter(null)}
            sx={{ mt: 2 }}
          >
            Show All Cases
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCases.map((caseData) => (
            <Grid item xs={12} md={6} lg={4} key={caseData.case_id}>
            <StyledCard severity={caseData.priority}>
              <CardActionArea onClick={() => onCaseSelect(caseData)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {caseData.case_number}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {getStatusIcon(caseData.status)}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                    {caseData.summary}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      label={caseData.status.replace('_', ' ')}
                      size="small"
                      color={getStatusColor(caseData.status)}
                    />
                    <Chip
                      label={caseData.priority}
                      size="small"
                      color={getPriorityColor(caseData.priority)}
                    />
                    <Chip
                      label={caseData.case_type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <strong>Party:</strong> {caseData.party.full_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <strong>Account:</strong> {caseData.account.account_number_hash}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <strong>Risk Score:</strong> {caseData.risk_assessment.risk_score} ({caseData.risk_assessment.risk_level})
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <strong>Opened:</strong> {new Date(caseData.opened_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {caseData.alert && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Alert Scenario:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {caseData.alert.scenario.name}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
