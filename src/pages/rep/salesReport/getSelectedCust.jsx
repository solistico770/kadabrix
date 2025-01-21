import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Autocomplete, TextField, CircularProgress ,Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


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
         }}></Button>


          <Button 
         startIcon={<PersonIcon />}
         ></Button>

       

         {props.state.custName} {props.state.custDes }


    </div>)  : ''    }

  </div>
  );
};

export default Data;
