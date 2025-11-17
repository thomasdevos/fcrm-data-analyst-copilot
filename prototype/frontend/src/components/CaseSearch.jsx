import React, { useState } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CaseSearch = ({ cases, onCaseSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter(caseData => {
    const query = searchQuery.toLowerCase();
    return (
      caseData.case_number.toLowerCase().includes(query) ||
      caseData.party.full_name.toLowerCase().includes(query) ||
      caseData.summary.toLowerCase().includes(query) ||
      caseData.case_type.toLowerCase().includes(query)
    );
  });

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Search Cases
        </Typography>
        <TextField
          fullWidth
          placeholder="Search by Case ID, Party Name, or Summary..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            }
          }}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
          {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
        </Typography>
        <List>
          {filteredCases.map((caseData, index) => (
            <React.Fragment key={caseData.case_id}>
              {index > 0 && <Divider />}
              <ListItem disablePadding>
                <ListItemButton onClick={() => onCaseSelect(caseData)} sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {caseData.case_number}
                        </Typography>
                        <Chip label={caseData.status.replace('_', ' ')} size="small" color="primary" />
                        <Chip label={caseData.priority} size="small" color="warning" />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {caseData.summary}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Party:</strong> {caseData.party.full_name} |
                          <strong> Type:</strong> {caseData.case_type.replace('_', ' ')} |
                          <strong> Opened:</strong> {new Date(caseData.opened_at).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CaseSearch;
