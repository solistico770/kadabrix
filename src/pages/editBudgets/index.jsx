import kdb from '../../kadabrix/kadabrix';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const BudgetScreen = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    id: '',
    email: '',
    type: 1,
    val: 0,
    status: 1,
    start: '',
    end: '',
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await kdb.run({
          module: 'kdb_budget',
          name: 'getBudgets',
        });
        setBudgets(data);
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
        setError('שגיאה בטעינת התקציבים');
        setSnackbarOpen(true);
      }
    };

    fetchBudgets();
  }, [kdb]);

  const handleUpdateBudget = async (index, field, value) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index][field] = value;
    setBudgets(updatedBudgets);

    try {
      await kdb.run({
        module: 'kdb_budget',
        name: 'setValue',
        data: {
          editField: field,
          idValue: budgets[index].id,
          newValue: value,
        },
      });
    } catch (error) {
      console.error('Failed to update budget:', error);
      setError(`שגיאה בעדכון שדה ${field}`);
      setSnackbarOpen(true);
    }
  };

  const handleAddBudget = () => {
    const newId = budgets.length ? budgets[budgets.length - 1].id + 1 : 1;
    setBudgets([...budgets, { ...newBudget, id: newId }]);
    setNewBudget({ id: '', email: '', type: 1, val: 0, status: 1, start: '', end: '' });
    setOpen(false);
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const convertToUnix = (dateString) => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        ניהול תקציבים
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>סוג תקציב</TableCell>
              <TableCell>ערך</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>תאריך התחלה</TableCell>
              <TableCell>תאריך סיום</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((budget, index) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.id}</TableCell>
                <TableCell>
                  <TextField
                    value={budget.email}
                    onChange={(e) => handleUpdateBudget(index, 'email', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={budget.type}
                    onChange={(e) => handleUpdateBudget(index, 'type', parseInt(e.target.value, 10))}
                  >
                    <FormControlLabel value={1} control={<Radio />} label="חד-פעמי" />
                    <FormControlLabel value={2} control={<Radio />} label="רב-פעמי" />
                  </RadioGroup>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={budget.val}
                    onChange={(e) => handleUpdateBudget(index, 'val', parseInt(e.target.value, 10))}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={budget.status === 1}
                    onChange={(e) => handleUpdateBudget(index, 'status', e.target.checked ? 1 : 2)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={budget.start ? new Date(budget.start * 1000).toISOString().substr(0, 10) : ''}
                    error={budget.start && !isValidDate(new Date(budget.start * 1000).toISOString().substr(0, 10))}
                    helperText={budget.start && !isValidDate(new Date(budget.start * 1000).toISOString().substr(0, 10)) ? 'תאריך לא חוקי' : ''}
                    onChange={(e) => handleUpdateBudget(index, 'start', convertToUnix(e.target.value))}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={budget.end ? new Date(budget.end * 1000).toISOString().substr(0, 10) : ''}
                    error={budget.end && !isValidDate(new Date(budget.end * 1000).toISOString().substr(0, 10))}
                    helperText={budget.end && !isValidDate(new Date(budget.end * 1000).toISOString().substr(0, 10)) ? 'תאריך לא חוקי' : ''}
                    onChange={(e) => handleUpdateBudget(index, 'end', convertToUnix(e.target.value))}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <IconButton color="primary" onClick={() => setOpen(true)} style={{ marginTop: 20 }}>
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>הוספת תקציב חדש</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="אימייל"
                value={newBudget.email}
                onChange={(e) => setNewBudget({ ...newBudget, email: e.target.value })}
                fullWidth
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
                type="number"
                label="ערך"
                value={newBudget.val}
                onChange={(e) => setNewBudget({ ...newBudget, val: parseInt(e.target.value, 10) })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Switch
                checked={newBudget.status === 1}
                onChange={(e) => setNewBudget({ ...newBudget, status: e.target.checked ? 1 : 2 })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="date"
                label="תאריך התחלה"
                value={newBudget.start}
                error={!isValidDate(newBudget.start)}
                helperText={!isValidDate(newBudget.start) ? 'תאריך לא חוקי' : ''}
                onChange={(e) => setNewBudget({ ...newBudget, start: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="date"
                label="תאריך סיום"
                value={newBudget.end}
                error={!isValidDate(newBudget.end)}
                helperText={!isValidDate(newBudget.end) ? 'תאריך לא חוקי' : ''}
                onChange={(e) => setNewBudget({ ...newBudget, end: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            ביטול
          </Button>
          <Button onClick={handleAddBudget} color="primary">
            הוספה
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BudgetScreen;