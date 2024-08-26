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
    const startOfYear = moment().startOf('year');
    const endOfYear = moment().endOf('year');
    props.setFromDate(startOfYear)
    props.setToDate(endOfYear)
    
    
  };

  const setAllYear = () => {
    
    props.setFromDate( moment().subtract(1, 'years'));
    props.setToDate(moment().endOf('day'));
  };

  const setMonth = () => {
    
    props.setFromDate(moment().startOf('month'));
    props.setToDate(moment().endOf('month'));
  };

  const setDay = () => {

    props.setFromDate(moment().startOf('day'));
    props.setToDate(moment().endOf('day'));
  };

  const setWeek = () => {
    
    props.setFromDate(moment().startOf('week'));
    props.setToDate(moment().endOf('week'));
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
              label="From Date"
              value={props.fromDate}
              onChange={handleFromDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              format="DD/MM/YYYY"
              adapterLocale="he"
              label="To Date"
              value={props.toDate}
              onChange={handleToDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            <ButtonGroup variant="outlined" fullWidth aria-label="Basic button group">
              <Button onClick={setAllYear}>Past Year</Button>
              <Button onClick={setYear}>This Year</Button>
              <Button onClick={setMonth}>This Month</Button>
              <Button onClick={setWeek}>This Week</Button>
              <Button onClick={setDay}>Today</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default Data;
