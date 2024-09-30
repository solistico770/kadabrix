import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Autocomplete, TextField, CircularProgress ,Button} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AppsIcon from '@mui/icons-material/Apps';

const Data = (props) => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  


  return (
    <div>
        { (props.state!=null) ? 
    (<div> 
          <Button 
         startIcon={<HighlightOffIcon />}
         onClick={()=>{
          props.setter(null);
       }}
       
         ></Button>

        <Button 
         startIcon={<AppsIcon />}
         ></Button>

         {props.state.familyName} {props.state.familyDes }


    </div>)  : ''    }

  </div>
  );
};

export default Data;
