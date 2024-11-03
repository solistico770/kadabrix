import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Autocomplete, TextField, CircularProgress ,Button} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DescriptionIcon from '@mui/icons-material/Description';


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
         startIcon={<DescriptionIcon />}
         ></Button>

      
         { props.state.docName }


    </div>)  : ''    }

  </div>
  );
};

export default Data;
