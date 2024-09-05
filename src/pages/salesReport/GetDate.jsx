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
  
  
  useEffect(() => {
    setMonth();
  }, []);

  const setYear = () => {
    const startOfYear = moment().utc().startOf('year');
    const endOfYear = moment().utc().endOf('year');
    props.setFromDate(startOfYear)
    props.setToDate(endOfYear)
    
    
  };

  const setAllYear = () => {
    
    props.setFromDate( moment().utc().subtract(1, 'years'));
    props.setToDate(moment().utc().endOf('day'));
  };

  const setMonth = () => {
    
    props.setFromDate(moment().utc().startOf('month'));
    props.setToDate(moment().utc().endOf('month'));
  };

  const setDay = () => {

    props.setFromDate(moment().utc().startOf('day'));
    props.setToDate(moment().utc().endOf('day'));
  };

  const setWeek = () => {
    
    props.setFromDate(moment().utc().startOf('week'));
    props.setToDate(moment().utc().endOf('week'));
  };

  const handleFromDateChange = (date) => {
    const unixTime = date;
    props.setFromDate(date);
    
  };

  const handleToDateChange = (date) => {
    const unixTime = date;
    props.setToDate(date);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              format="DD/MM/YYYY"
              label="מתאריך"
              value={props.fromDate}
              onChange={handleFromDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
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
              <Button onClick={setAllYear}>שנה אחורה</Button>
              <Button onClick={setYear}>כל השנה</Button>
              <Button onClick={setMonth}>החודש</Button>
              <Button onClick={setWeek}>השבוע</Button>
              <Button onClick={setDay}>היום</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default Data;
