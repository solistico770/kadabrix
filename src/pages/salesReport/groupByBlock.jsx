import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const Data = (props) => {
  
  const handleChange = (data) => {
    if (props.state.indexOf(data)==-1) {
      props.setter([...props.state,data])
    } else {
       props.setter([...props.state.filter((i)=>i!=data)])
    }
  };

  const isChecked = (data) => {
    return (props.state.indexOf(data)!=-1)
  };

  

  return (
    
<Box sx={{ padding: 2 , direction:"ltr"}}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
          קבץ לפי:
          <ButtonGroup variant="outlined" fullWidth aria-label="Basic button group">
           
            <Button
             startIcon={<CloudUploadIcon />}
             onClick={() => handleChange('customer')}
             sx={{ bgcolor: isChecked('customer') ? 'blue' : 'default' ,
                   color: isChecked('customer') ? 'white' : 'default'}}
            >
            לקוח
            </Button>

            <Button
             startIcon={<CloudUploadIcon />}
             onClick={() => handleChange('agent')}
             sx={{ bgcolor: isChecked('agent') ? 'blue' : 'default' ,
                   color: isChecked('agent') ? 'white' : 'default'}}
            >
            סוכן
            </Button>

            <Button
             startIcon={<CloudUploadIcon />}
             onClick={() => handleChange('product')}
             sx={{ bgcolor: isChecked('product') ? 'blue' : 'default' ,
                   color: isChecked('product') ? 'white' : 'default'}}
            >
            מוצר
            </Button>

            <Button
             startIcon={<CloudUploadIcon />}
             onClick={() => handleChange('family')}
             sx={{ bgcolor: isChecked('family') ? 'blue' : 'default' ,
                   color: isChecked('family') ? 'white' : 'default'}}
            >
            משפחת מוצר
            </Button>
            <Button
             startIcon={<CloudUploadIcon />}
             onClick={() => handleChange('docName')}
             sx={{ bgcolor: isChecked('docName') ? 'blue' : 'default' ,
                   color: isChecked('docName') ? 'white' : 'default'}}
            >
            
               מספר מסמך 

            </Button>

            <Button
             startIcon={<CloudUploadIcon />}
             onClick={() => handleChange('date')}
             sx={{ bgcolor: isChecked('date') ? 'blue' : 'default' ,
                   color: isChecked('date') ? 'white' : 'default'}}
            >
            
               תאריך 

            </Button>


           
           
           




          </ButtonGroup>


          
          </Grid>
        </Grid>
</Box>        
 
  );
};

export default Data;
