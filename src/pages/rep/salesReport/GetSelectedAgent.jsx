import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Autocomplete, TextField, CircularProgress ,Button} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import SupportAgentIcon from '@mui/icons-material/SupportAgent';


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
         startIcon={<SupportAgentIcon />}
         ></Button>

        

         {props.state.agentName} {props.state.agentDes }
         

    </div>)  : ''    }

  </div>
  );
};

export default Data;
