import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment-timezone';

const Data = (props) => {
  
  const [currentDateType,setCurrentDateType] = useState("none")
  
  useEffect(() => {
    setMonth();
  }, []);

  const setYear = () => {
    const startOfYear = moment().utc().startOf('year');
    const endOfYear = moment().utc();
    props.setFromDate(startOfYear)
    props.setToDate(endOfYear)
    setCurrentDateType("year")
    
    
  };

  const setAllYear = () => {
    setCurrentDateType("allYear")
    props.setFromDate( moment().utc().subtract(1, 'years'));
    props.setToDate(moment().utc().endOf('day'));
  };

  const setMonth = () => {
    setCurrentDateType("month")
    props.setFromDate(moment().utc().startOf('month'));
    props.setToDate(moment().utc().endOf('month'));
  };

  const setDay = () => {
    setCurrentDateType("day")
    props.setFromDate(moment().utc().startOf('day'));
    props.setToDate(moment().utc().endOf('day'));
  };

  const setWeek = () => {
    setCurrentDateType("week")
    props.setFromDate(moment().utc().startOf('week'));
    props.setToDate(moment().utc().endOf('week'));
  };

  const handleFromDateChange = (date) => {
    setCurrentDateType("none")
    const unixTime = date;
    props.setFromDate(date);
    
  };

  const handleToDateChange = (date) => {
    setCurrentDateType("none")
    const unixTime = date;
    props.setToDate(date);
  };

  const differenceInTime = props.toDate - props.fromDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24))+1 ;

  return (
    <Box sx={{ padding: 2 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <DatePicker
              views={['year', 'month', 'day']}

              format="DD/MM/YYYY"
              

              label="מתאריך"
              value={props.fromDate}
              onChange={handleFromDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={2}>

          <b> { differenceInDays } ימים </b>


          </Grid>
          <Grid item xs={12} sm={5}>
            <DatePicker
              views={['year', 'month', 'day']}

              format="DD/MM/YYYY"
              adapterLocale="he"
              label="עד תאריך"
              value={props.toDate}
              onChange={handleToDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            <ButtonGroup variant="outlined" fullWidth aria-label="Basic button group">
              
              
            <Button 
              sx={{ 
                bgcolor: currentDateType === 'day' ? 'blue' : 'default', 
                color: currentDateType === 'day' ? 'white' : 'black' 
              }}

              onClick={setDay}>היום</Button>


              <Button 
              sx={{ 
              bgcolor: currentDateType === 'week' ? 'blue' : 'default', 
              color: currentDateType === 'week' ? 'white' : 'black' 
              }}
              onClick={setWeek}>השבוע</Button>

              <Button 
              sx={{ 
              bgcolor: currentDateType === 'month' ? 'blue' : 'default', 
              color: currentDateType === 'month' ? 'white' : 'black' 
              }}

              onClick={setMonth}>החודש</Button>

              
              <Button onClick={setAllYear}
              
              sx={{ 
                bgcolor: currentDateType === 'allYear' ? 'blue' : 'default', 
                color: currentDateType === 'allYear' ? 'white' : 'black' 
              }}

              >12 חודשים</Button> 
              <Button 
              
              sx={{ 
                bgcolor: currentDateType === 'year' ? 'blue' : 'default', 
                color: currentDateType === 'year' ? 'white' : 'black' 
              }}

              onClick={setYear}>מתחילת השנה</Button>
     
       
              
            </ButtonGroup>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default Data;
