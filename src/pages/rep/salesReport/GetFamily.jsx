import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Autocomplete, TextField, CircularProgress,Button } from '@mui/material';

const Data = (props) => {
  
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [loading, setLoading] = useState(false);

  

  const fetchData = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await kdb.run({
        module: 'salesReport',
        name: 'getFamily',
        data: { search: searchTerm },
      });
      
      setData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Fetch data when debounced value changes
  useEffect(() => {
    if (debouncedValue) {
      fetchData(debouncedValue);
    } else {
      setData([]); // Clear data if input is empty
    }
  }, [debouncedValue]);


  useEffect(() => {
    
    fetchData();

  }, []);

  return (
    

    <div>
    { (props.state!=null) ? 
(<div> 
     <Button onClick={()=>{
        props.setter(null);
        fetchData();
     }}>X</Button>
     {props.state.familyName} {props.state.familyDes }


</div>)  : 
(<div>
 <Autocomplete
      options={data}
      onChange={(event, newValue) => {
        props.setter(newValue); // Update selected item state
      }}
      getOptionLabel={(option) => `${option.family} ${option.familyDes || ''}`}
      filterOptions={(x) => x} // Disable built-in filtering to rely on server-side filtering
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="משפחת מוצר"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      
    />

   </div>)}

</div>


  );
};

export default Data;
