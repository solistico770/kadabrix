import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppsIcon from '@mui/icons-material/Apps';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';




const Data = (props) => {
  
  const handleChange = (data) => {
    if (props.state.indexOf(data)==-1) {
      props.setter([...props.state,data])
    } else {
       props.setter([...props.state.filter((i)=>i!=data)])
    }
  };

  const isChecked = (data) => {
    return (props.state.indexOf(data)!=-1)
  };

  

  return (
    <Box sx={{ padding: 2, direction: "ltr" }}>
  <Grid container spacing={2} sx={{ marginTop: 2 }}>
    <Grid item xs={12}>
      קבץ לפי:
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            startIcon={<PersonIcon />}
            onClick={() => handleChange('customer')}
            sx={{
              bgcolor: isChecked('customer') ? 'blue' : 'default',
              color: isChecked('customer') ? 'white' : 'default',
              width: '100%',
            }}
          >
            לקוח
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            startIcon={<SupportAgentIcon />}
            onClick={() => handleChange('agent')}
            sx={{
              bgcolor: isChecked('agent') ? 'blue' : 'default',
              color: isChecked('agent') ? 'white' : 'default',
              width: '100%',
            }}
          >
            סוכן
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            startIcon={<ShoppingCartIcon />}
            onClick={() => handleChange('product')}
            sx={{
              bgcolor: isChecked('product') ? 'blue' : 'default',
              color: isChecked('product') ? 'white' : 'default',
              width: '100%',
            }}
          >
            מוצר
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            startIcon={<AppsIcon />}
            onClick={() => handleChange('family')}
            sx={{
              bgcolor: isChecked('family') ? 'blue' : 'default',
              color: isChecked('family') ? 'white' : 'default',
              width: '100%',
            }}
          >
            משפחת מוצר
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            startIcon={<DescriptionIcon />}
            onClick={() => handleChange('docName')}
            sx={{
              bgcolor: isChecked('docName') ? 'blue' : 'default',
              color: isChecked('docName') ? 'white' : 'default',
              width: '100%',
            }}
          >
            מספר מסמך
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            startIcon={<CalendarMonthIcon />}
            onClick={() => handleChange('date')}
            sx={{
              bgcolor: isChecked('date') ? 'blue' : 'default',
              color: isChecked('date') ? 'white' : 'default',
              width: '100%',
            }}
          >
            תאריך
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Box>

           




          </ButtonGroup>


          
          </Grid>
        </Grid>
</Box>        
 
  );
};

export default Data;
