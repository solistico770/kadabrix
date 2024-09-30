import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Data = (props) => {
  
  

  const handleChange = (data) => {
    props.setter(data);
  };

  return (
    
<Box sx={{ padding: 2 }}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
          קבץ לפי:
          <ButtonGroup variant="outlined" fullWidth aria-label="Basic button group">
            <Button
              onClick={() => handleChange('day')}
              sx={{ bgcolor: props.state === 'day' ? 'blue' : 'default' , color: props.state === 'day' ? 'white' : 'default'}}
            >
              יום
            </Button>
            <Button
              onClick={() => handleChange('week')}
              sx={{ bgcolor: props.state === 'week' ? 'blue' : 'default' ,color: props.state === 'week' ? 'white' : 'default'}}
            >
              שבוע
            </Button>
            <Button
              onClick={() => handleChange('month')}
              sx={{ bgcolor: props.state === 'month' ? 'blue' : 'default' ,color: props.state === 'month' ? 'white' : 'default'}}
            >
              חודש
            </Button>
            <Button
              onClick={() => handleChange('year')}
              sx={{ bgcolor: props.state === 'year' ? 'blue' : 'default' ,color: props.state === 'year' ? 'white' : 'default'}}
            >
              שנה
            </Button>
          </ButtonGroup>
          </Grid>
        </Grid>
</Box>        
 
  );
};

export default Data;
