import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
} from '@mui/material';
import kdb from '../../../kadabrix/kadabrix';

const AddBudget = ({ open, onClose, onAdd }) => {
  const [newBudget, setNewBudget] = useState({
    email: '',
    type: 1,
    val: 0,
    status: 1,
    start: Date.now(),
    desc: '',
    quantity: 1,
    period: 'monthly',
    remarks: '',
    specialAccount: 0,
  });

  const [emailOptions, setEmailOptions] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoadingEmails(true);
      try {
        const response = await kdb.run({
          module: 'kdb_budget',
          name: 'getUsers',
        });
        setEmailOptions(response.map((user) => user.email));
      } catch (error) {
        console.error('Failed to fetch emails:', error);
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchEmails();
  }, []);

  const isValidDate = (date) => !isNaN(new Date(date).getTime());

  const toUnix = (date) => Math.floor(new Date(date).getTime() / 1000);

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateBudgets = () => {
    if (!isValidDate(newBudget.start)) return [];

    const startUnix = toUnix(newBudget.start);
    const budgets = [];
    const quantity = newBudget.quantity;
    const period = newBudget.period;

    let currentStartUnix = startUnix;

    for (let i = 0; i < quantity; i++) {
      let currentEndUnix;

      if (period === 'monthly') {
        const startDate = new Date(currentStartUnix * 1000);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);
        currentEndUnix = Math.floor(endDate.getTime() / 1000);
      } 
      else if (period === 'bimonthly') {

        const startDate = new Date(currentStartUnix * 1000);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0, 23, 59, 59);
        currentEndUnix = Math.floor(endDate.getTime() / 1000);
        
      }
      else if (period === 'quarterly') {
        const startDate = new Date(currentStartUnix * 1000);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0, 23, 59, 59);
        currentEndUnix = Math.floor(endDate.getTime() / 1000);
      } else if (period === 'annual') {
        const startDate = new Date(currentStartUnix * 1000);
        const endDate = new Date(startDate.getFullYear() + 1, 0, 0, 23, 59, 59);
        currentEndUnix = Math.floor(endDate.getTime() / 1000);
      }

      budgets.push({
        email: newBudget.email,
        type: newBudget.type,
        val: newBudget.val,
        status: newBudget.status,
        desc: newBudget.desc,
        remarks: newBudget.remarks,
        specialAccount: newBudget.specialAccount,
        start: currentStartUnix,
        end: currentEndUnix,
      });

      if (period === 'monthly') {
        const nextStartDate = new Date(currentStartUnix * 1000);
        nextStartDate.setMonth(nextStartDate.getMonth() + 1);
        currentStartUnix = Math.floor(nextStartDate.getTime() / 1000);
      } else if (period === 'bimonthly') {
        const nextStartDate = new Date(currentStartUnix * 1000);
        nextStartDate.setMonth(nextStartDate.getMonth() + 2);
        currentStartUnix = Math.floor(nextStartDate.getTime() / 1000);

      } else if (period === 'quarterly') {

        const nextStartDate = new Date(currentStartUnix * 1000);
        nextStartDate.setMonth(nextStartDate.getMonth() + 3);
        currentStartUnix = Math.floor(nextStartDate.getTime() / 1000);
      } else if (period === 'annual') {
        const nextStartDate = new Date(currentStartUnix * 1000);
        nextStartDate.setFullYear(nextStartDate.getFullYear() + 1);
        currentStartUnix = Math.floor(nextStartDate.getTime() / 1000);
      }
    }

    return budgets;
  };

  const handleAdd = async () => {
    const budgets = calculateBudgets();
    await kdb.run({
      module: 'kdb_budget',
      name: 'addBudgets',
      data: budgets,
    });
    onAdd();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>הוספת תקציב חדש</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={emailOptions}
              loading={loadingEmails}
              value={newBudget.email}
              onChange={(event, value) => setNewBudget({ ...newBudget, email: value })}
              renderInput={(params) => (
                <TextField {...params} label="אימייל" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              row
              value={newBudget.type}
              onChange={(e) => setNewBudget({ ...newBudget, type: parseInt(e.target.value, 10) })}
            >
              <FormControlLabel value={1} control={<Radio />} label="חד-פעמי" />
              <FormControlLabel value={2} control={<Radio />} label="רב-פעמי" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="תיאור"
              value={newBudget.desc}
              onChange={(e) => setNewBudget({ ...newBudget, desc: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ערך תקציב"
              type="number"
              value={newBudget.val}
              onChange={(e) => setNewBudget({ ...newBudget, val: parseFloat(e.target.value) || 0 })}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="כמות תקציבים"
              type="number"
              inputProps={{ min: 1 }}
              value={newBudget.quantity}
              onChange={(e) =>
                setNewBudget({ ...newBudget, quantity: parseInt(e.target.value, 10) || 1 })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="חשבון מיוחד"
              type="number"
              value={newBudget.specialAccount}
              onChange={(e) =>
                setNewBudget({ ...newBudget, specialAccount: parseInt(e.target.value, 10) || 0 })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              dir="ltr"
              label="תאריך התחלה"
              type="date"
              value={newBudget.start}
              error={!isValidDate(newBudget.start)}
              onChange={(e) => setNewBudget({ ...newBudget, start: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Select
              value={newBudget.period}
              onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
              fullWidth
            >
              <MenuItem value="monthly">כל חודש</MenuItem>
              <MenuItem value="bimonthly">דו חודשי</MenuItem>
              <MenuItem value="quarterly">כל רבעון</MenuItem>
              <MenuItem value="annual">תקציב שנתי</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="הערות"
              value={newBudget.remarks}
              onChange={(e) => setNewBudget({ ...newBudget, remarks: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Switch
              checked={newBudget.status === 1}
              onChange={(e) => setNewBudget({ ...newBudget, status: e.target.checked ? 1 : 0 })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">תצוגה מקדימה:</Typography>
            {calculateBudgets().map((budget, index) => (
              <Typography key={index}>
                <strong>תקציב {index + 1}:</strong>{' '}
                תאריך התחלה: {formatDate(budget.start)}, תאריך סיום: {formatDate(budget.end)}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          ביטול
        </Button>
        <Button
          onClick={handleAdd}
          color="primary"
          disabled={!isValidDate(newBudget.start) || !newBudget.email || newBudget.quantity < 1}
        >
          הוספה
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBudget;
