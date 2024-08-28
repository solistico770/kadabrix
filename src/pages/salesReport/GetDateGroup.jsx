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
    
<Box>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            <ButtonGroup variant="outlined" fullWidth aria-label="Basic button group">
              <Button onClick={()=>{handleChange("day")}} >יום</Button>
              <Button onClick={()=>{handleChange("week")}} >שבוע</Button>
              <Button onClick={()=>{handleChange("month")}} >חודש</Button>
              <Button onClick={()=>{handleChange("year")}} >שנה</Button>
              <Button onClick={()=>{handleChange("none")}} >ללא</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
</Box>        
 
  );
};

export default Data;
