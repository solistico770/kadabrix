import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Checkbox, FormControlLabel, CircularProgress } from '@mui/material';

const Data = (props) => {
  
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(!checked);
    let state = {...props.state};
    state[props.var]=!checked;
    props.setter(state);
  };

  useEffect(() => {
    let state = {...props.state};
    state[props.var]=checked;
    props.setter(state);

  }, []);


  return (
    
      
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        
      />

  );
};

export default Data;
