import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment-timezone';

const Data = (props) => {
  const [fromDate, setFromDate] = useState(moment.unix(props.state.fromDate));
  const [toDate, setToDate] = useState(moment.unix(props.state.toDate));

  useEffect(() => {
    setMonth();
  }, []);

  const setYear = () => {
    const startOfYear = moment().startOf('year').unix();
    const endOfYear = moment().endOf('year').unix();
    props.setter({ ...props.state, fromDate: startOfYear, toDate: endOfYear });
    setFromDate(moment.unix(startOfYear));
    setToDate(moment.unix(endOfYear));
  };

  const setAllYear = () => {
    const startOfLastYear = moment().subtract(1, 'years').unix();
    const endOfNow = moment().endOf('day').unix();
    props.setter({ ...props.state, fromDate: startOfLastYear, toDate: endOfNow });
    setFromDate(moment.unix(startOfLastYear));
    setToDate(moment.unix(endOfNow));
  };

  const setMonth = () => {
    const startOfMonth = moment().startOf('month').unix();
    const endOfMonth = moment().endOf('month').unix();
    props.setter({ ...props.state, fromDate: startOfMonth, toDate: endOfMonth });
    setFromDate(moment.unix(startOfMonth));
    setToDate(moment.unix(endOfMonth));
  };

  const setDay = () => {
    const startOfDay = moment().startOf('day').unix();
    const endOfDay = moment().endOf('day').unix();
    props.setter({ ...props.state, fromDate: startOfDay, toDate: endOfDay });
    setFromDate(moment.unix(startOfDay));
    setToDate(moment.unix(endOfDay));
  };

  const setWeek = () => {
    const startOfWeek = moment().startOf('week').unix();
    const endOfWeek = moment().endOf('week').unix();
    props.setter({ ...props.state, fromDate: startOfWeek, toDate: endOfWeek });
    setFromDate(moment.unix(startOfWeek));
    setToDate(moment.unix(endOfWeek));
  };

  const handleFromDateChange = (date) => {
    const unixTime = date.unix();
    setFromDate(date);
    props.setter({ ...props.state, fromDate: unixTime });
  };

  const handleToDateChange = (date) => {
    const unixTime = date.unix();
    setToDate(date);
    props.setter({ ...props.state, toDate: unixTime });
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          format="DD/MM/YYYY"
          
          label="From Date"
          value={fromDate}
          onChange={handleFromDateChange}
          renderInput={(params) => <TextField {...params} />}
        />

        <DatePicker
        format="DD/MM/YYYY" 
          
          adapterLocale="he"
          label="To Date"
          value={toDate}
          onChange={handleToDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button onClick={setAllYear}>Past Year</Button>
        <Button onClick={setYear}>This Year</Button>
        <Button onClick={setMonth}>This Month</Button>
        <Button onClick={setWeek}>This Week</Button>
        <Button onClick={setDay}>Today</Button>
      </ButtonGroup>
    </Box>
  );
};

export default Data;
