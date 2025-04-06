// File: src/pages/ods/components/LookupButtons.jsx
import React from 'react';
import { Button, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';

const LookupButtons = ({ handleDialogOpen }) => {
  const settingsOptions = [
    { name: 'סטטוס ODS', key: 'odsStatus', icon: <AssignmentIcon /> },
    { name: 'סטטוס ליקוט', key: 'pickStatus', icon: <TimelineIcon /> },
    { name: 'מלקטים', key: 'pickers', icon: <PersonIcon /> },
    { name: 'קווים', key: 'lines', icon: <RouteIcon /> },
    { name: 'משאיות', key: 'vans', icon: <LocalShippingIcon /> },
    { name: 'נהגים', key: 'drivers', icon: <PeopleIcon /> },
    { name: 'מסלולי הפצה', key: 'linesInstance', icon: <SettingsIcon /> },
  ];

  return (
    <Grid container spacing={3}>
      {settingsOptions.map((option) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={option.key}>
          <Button
            variant="contained"
            startIcon={option.icon}
            onClick={() => handleDialogOpen(option.key)}
            fullWidth
            className="py-4"
            style={{ justifyContent: 'flex-start', padding: '12px 20px', textAlign: 'right' }}
          >
            {option.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default LookupButtons;