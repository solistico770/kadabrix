import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Autocomplete, TextField, CircularProgress ,Button} from '@mui/material';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import moment from 'moment';



const Data = (props) => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  
  let fromDate = '';
  let toDate = '';

  if (props.state!=null) {
    
     fromDate = moment.unix(props.state.fromDate).format("DD/MM/YYYY");
     toDate   = moment.unix(props.state.toDate).format("DD/MM/YYYY");
  }
  

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
         startIcon={<CalendarMonth />}
         ></Button>

       

         {fromDate} - {toDate }


    </div>)  : ''    }

  </div>
  );
};

export default Data;
