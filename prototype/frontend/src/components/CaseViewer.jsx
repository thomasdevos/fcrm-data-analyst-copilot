import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const CaseViewer = ({ caseData }) => {
  if (!caseData) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No case selected
        </Typography>
      </Paper>
    );
  }

  const getRiskColor = (score) => {
    if (score >= 70) return 'error';
    if (score >= 50) return 'warning';
    if (score >= 30) return 'info';
    return 'success';
  };

  const riskColor = getRiskColor(caseData.risk_assessment.risk_score);

  return (
    <Box>
      {/* Case Header */}
      <Paper sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, #FF6600 0%, #CC5200 100%)`, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {caseData.case_number}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {caseData.summary}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Chip label={caseData.status.replace('_', ' ')} color="secondary" />
            <Chip label={caseData.priority} color="warning" />
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          <strong>Case Type:</strong> {caseData.case_type.replace('_', ' ')} |
          <strong> Opened:</strong> {new Date(caseData.opened_at).toLocaleString()}
        </Typography>
      </Paper>

      {/* Alert Information */}
      {caseData.alert && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <SectionHeader variant="h6">
            <WarningAmberIcon color="warning" />
            Alert Details
          </SectionHeader>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Scenario:</strong> {caseData.alert.scenario.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Description:</strong> {caseData.alert.scenario.description}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Alert ID:</strong> {caseData.alert.alert_id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Generated:</strong> {new Date(caseData.alert.generated_at).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Priority:</strong> <Chip label={caseData.alert.priority} size="small" color="warning" />
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Party Information */}
        <Grid item xs={12} md={6}>
          <InfoCard>
            <CardContent>
              <SectionHeader variant="h6">
                <PersonIcon color="primary" />
                Party Information
              </SectionHeader>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {caseData.party.party_type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {caseData.party.full_name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Party ID:</strong> {caseData.party.party_id}
              </Typography>
              {caseData.party.date_of_birth && (
                <Typography variant="body2" gutterBottom>
                  <strong>Date of Birth:</strong> {caseData.party.date_of_birth}
                </Typography>
              )}
              {caseData.party.incorporation_date && (
                <Typography variant="body2" gutterBottom>
                  <strong>Incorporation Date:</strong> {caseData.party.incorporation_date}
                </Typography>
              )}
              <Typography variant="body2" gutterBottom>
                <strong>Nationality:</strong> {caseData.party.nationality_country_code}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>TIN/Tax ID:</strong> {caseData.party.tin_tax_id || 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>PEP Flag:</strong> {caseData.party.pep_flag ? '⚠️ Yes' : '✅ No'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Risk Category:</strong> <Chip label={caseData.party.risk_category} size="small" color={getRiskColor(caseData.party.risk_score)} />
              </Typography>

              {caseData.party.addresses && caseData.party.addresses.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                    Current Address:
                  </Typography>
                  {caseData.party.addresses.filter(a => a.is_current).map((addr, idx) => (
                    <Typography key={idx} variant="caption" color="text.secondary">
                      {addr.line1}, {addr.city}, {addr.postal_code}, {addr.country_code}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </InfoCard>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12} md={6}>
          <InfoCard>
            <CardContent>
              <SectionHeader variant="h6">
                <AccountBalanceIcon color="primary" />
                Account Information
              </SectionHeader>
              <Typography variant="body2" gutterBottom>
                <strong>Account ID:</strong> {caseData.account.account_id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Account Number:</strong> {caseData.account.account_number_hash}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Product Type:</strong> {caseData.account.product_type_code}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Status:</strong> <Chip label={caseData.account.status} size="small" color={caseData.account.status === 'OPEN' ? 'success' : 'default'} />
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Currency:</strong> {caseData.account.currency_code}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Open Date:</strong> {caseData.account.open_date}
              </Typography>
            </CardContent>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Risk Assessment */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <SectionHeader variant="h6">
          <TrendingUpIcon color="primary" />
          Risk Assessment
        </SectionHeader>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: `${riskColor}.main` }}>
                {caseData.risk_assessment.risk_score}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Risk Score
              </Typography>
              <Chip label={caseData.risk_assessment.risk_level} color={riskColor} sx={{ mt: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" gutterBottom>
              <strong>Assessment Date:</strong> {caseData.risk_assessment.as_of_date}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Method:</strong> {caseData.risk_assessment.method}
            </Typography>
            {caseData.risk_assessment.risk_factors && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  Risk Factors:
                </Typography>
                {caseData.risk_assessment.risk_factors.map((factor, idx) => (
                  <Box key={idx} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>{factor.factor_code}:</strong> {factor.value_text}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={factor.contribution}
                      sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                      color={getRiskColor(factor.contribution)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Contribution: {factor.contribution}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions */}
      {caseData.transactions && caseData.transactions.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <SectionHeader variant="h6">
            Flagged Transactions ({caseData.transactions.length})
          </SectionHeader>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Txn ID</strong></TableCell>
                  <TableCell><strong>Date/Time</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell align="right"><strong>Amount</strong></TableCell>
                  <TableCell><strong>Channel</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caseData.transactions.map((txn) => (
                  <TableRow key={txn.txn_id} hover>
                    <TableCell>{txn.txn_id}</TableCell>
                    <TableCell>{new Date(txn.txn_ts).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={txn.txn_type_code} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {txn.currency_code} {txn.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{txn.channel_code}</TableCell>
                    <TableCell>
                      {txn.location && `${txn.location.city || ''}, ${txn.location.country_code || ''}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Total Transaction Value:</strong> {caseData.account.currency_code}{' '}
              {caseData.transactions.reduce((sum, txn) => sum + txn.amount, 0).toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Screening Hit (if applicable) */}
      {caseData.screening_hit && (
        <Alert severity={caseData.screening_hit.hit_status === 'FALSE_POSITIVE' ? 'success' : 'error'} sx={{ mt: 3 }}>
          <AlertTitle>Sanctions Screening Hit</AlertTitle>
          <Typography variant="body2">
            <strong>List:</strong> {caseData.screening_hit.list_code} |
            <strong> Match Score:</strong> {caseData.screening_hit.match_score}% |
            <strong> Status:</strong> {caseData.screening_hit.hit_status}
          </Typography>
          {caseData.screening_hit.disposition && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Disposition:</strong> {caseData.screening_hit.disposition}
            </Typography>
          )}
        </Alert>
      )}

      {/* Case Notes */}
      {caseData.case_notes && caseData.case_notes.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <SectionHeader variant="h6">
            Case Notes ({caseData.case_notes.length})
          </SectionHeader>
          {caseData.case_notes.map((note, idx) => (
            <Box key={note.note_id} sx={{ mb: 2, pb: 2, borderBottom: idx < caseData.case_notes.length - 1 ? '1px solid #eee' : 'none' }}>
              <Typography variant="caption" color="text.secondary">
                <strong>{note.author}</strong> • {new Date(note.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {note.note_text}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* KYC Profile */}
      {caseData.kyc && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <SectionHeader variant="h6">
            KYC Profile
          </SectionHeader>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                <strong>KYC Level:</strong> <Chip label={caseData.kyc.kyc_level} size="small" color="info" />
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Status:</strong> <Chip label={caseData.kyc.status} size="small" color={caseData.kyc.status === 'APPROVED' ? 'success' : 'warning'} />
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>
                <strong>Last Review:</strong> {caseData.kyc.review_date}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Next Review Due:</strong> {caseData.kyc.next_review_due}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default CaseViewer;
