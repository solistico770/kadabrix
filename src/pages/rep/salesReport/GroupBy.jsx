import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

const Data = (props) => {
  

  const handleCheckboxChange = (event) => {
    props.setter(!props.state);
  };

  
  return (
    
      
      <FormControlLabel
        control={
          <Checkbox
            checked={props.state}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        
      />

  );
};

export default Data;
