import React from 'react';
import { Button, Box, Grid } from '@mui/material';
import {
  SupportAgent as SupportAgentIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Apps as AppsIcon,
  Description as DescriptionIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';

const buttonsData = [
  { label: 'לקוח', value: 'customer', icon: <PersonIcon /> },
  { label: 'סוכן', value: 'agent', icon: <SupportAgentIcon /> },
  { label: 'מוצר', value: 'product', icon: <ShoppingCartIcon /> },
  { label: 'משפחת מוצר', value: 'family', icon: <AppsIcon /> },
  { label: 'מספר מסמך', value: 'docName', icon: <DescriptionIcon /> },
  { label: 'תאריך', value: 'date', icon: <CalendarMonthIcon /> }
];

const Data = ({ state, setter }) => {

  const handleChange = (value) => {
    setter(state.includes(value) ? state.filter((i) => i !== value) : [...state, value]);
  };

  const isChecked = (value) => state.includes(value);

  return (
      <Grid container spacing={2} sx={{ py: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {buttonsData.map(({ label, value, icon }) => (
              <Grid item xs={6} sm={2} key={value}>
                <Button
                  variant="outlined"
                  startIcon={icon}
                  onClick={() => handleChange(value)}
                  sx={{
                    bgcolor: isChecked(value) ? 'blue' : 'default',
                    color: isChecked(value) ? 'white' : 'default',
                    width: '100%'
                  }}
                >
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
   
  );
};

export default Data;
