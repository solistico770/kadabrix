import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';


import kdb from '../../kadabrix/kadabrix';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Button,
  Alert,
  Select,
  MenuItem,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import AddBudget from './addBudget'; // Camelcase naming for AddBudget
import DetailsPopup from './detailsPopup'; // Separate DetailsPopup component

const BudgetScreen = () => {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [search, setSearch] = useState({ id: '', email: '', status: 'both' });
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [calculatingBudgets, setCalculatingBudgets] = useState(false);
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);

  const fetchBudgets = async () => {
    try {
      const data = await kdb.run({
        module: 'kdb_budget',
        name: 'getBudgets',
      });
      setBudgets(data);
      setSearch({...search,time:new Date()})
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setError('שגיאה בטעינת התקציבים');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
   
    doSearch();
    
  }, [search]);

  const doSearch = () => {

    setFilteredBudgets(
      budgets.filter((budget) => {
        const matchesId = search.id === '' || budget.id.toString().includes(search.id);
        const matchesEmail = search.email === '' || budget.email.includes(search.email);
        const matchesStatus =
        search.status === 'both' ||
          (search.status === 'active' && budget.status === 1) ||
          (search.status === 'inactive' && budget.status === 0);

        return matchesId && matchesEmail && matchesStatus;
      })
    );
    

  }

  const handleSearch = (field, value) => {
    const updatedSearch = { ...search, [field]: value };
    setSearch(updatedSearch);
  };




  
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

  const isValidDate = (dateString) => {
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  };

  const handleBlurUpdate = (index, field, value) => {
    if (field === 'start' || field === 'end') {
      if (!isValidDate(value)) {
        setError('תאריך לא תקין');
        setSnackbarOpen(true);
        return;
      }
      value = Math.floor(new Date(value).getTime() / 1000); // Convert to UNIX timestamp
    }
    handleUpdateBudget(index, field, value);
  };

  const handlePopupOpen = (budget) => {
    setPopupData(budget);
    setOpenPopup(true);
  };

  const handleDeleteVisible = async () => {
    const visibleIds = filteredBudgets.map((budget) => budget.id);
    try {
      await kdb.run({
        module: 'kdb_budget',
        name: 'deleteVisible',
        data: visibleIds,
      });
      await fetchBudgets();
    } catch (error) {
      console.error('Failed to delete budgets:', error);
      setError('שגיאה במחיקת התקציבים');
      setSnackbarOpen(true);
    }
  };

  const handleCalculateVisible = async () => {
    const visibleIds = filteredBudgets.map((budget) => budget.id);
    setCalculatingBudgets(true)
    await kdb.run({
      module: 'kdb_budget',
      name: 'calculateVisible',
      data: visibleIds
    });

    await fetchBudgets();
    setCalculatingBudgets(false)

  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        ניהול תקציבים
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item xs={4}>
          <TextField
            label="חיפוש לפי ID"
            value={search.id}
            onChange={(e) => handleSearch('id', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="חיפוש לפי אימייל"
            value={search.email}
            onChange={(e) => handleSearch('email', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            value={search.status}
            onChange={(e) => handleSearch('status', e.target.value)}
            fullWidth
          >
            <MenuItem value="both">הכל</MenuItem>
            <MenuItem value="active">פעיל</MenuItem>
            <MenuItem value="inactive">לא פעיל</MenuItem>
          </Select>
        </Grid>


<Grid container spacing={2} style={{ marginTop: '8px' }}>
  <Grid item xs={3}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<CalculateIcon />}
      onClick={handleCalculateVisible}
    >
      חשב  מוצגים
    </Button>
    {calculatingBudgets && <CircularProgress />}
  </Grid>

  <Grid item xs={3}>
  <Button
    variant="contained"
    color="error"
    startIcon={<DeleteIcon />}
    onClick={handleDeleteVisible}
  >
    מחק מוצגים
  </Button>
</Grid>

  <Grid item xs={3}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => setAddBudgetOpen(true)}
    >
      הוספת  חדש
    </Button>
  </Grid>
</Grid>

    
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>אימייל</strong></TableCell>
              <TableCell><strong>תיאור</strong></TableCell>
              <TableCell><strong>סטטוס</strong></TableCell>
              <TableCell><strong>תאריך התחלה</strong></TableCell>
              <TableCell><strong>תאריך סיום</strong></TableCell>
              <TableCell><strong>נותר</strong></TableCell>
              <TableCell><strong>ערך</strong></TableCell>
              <TableCell><strong>פרטים</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBudgets.map((budget, index) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.id}</TableCell>
                <TableCell>
                  <TextField
                    dir="ltr"
                    defaultValue={budget.email}
                    onBlur={(e) => handleBlurUpdate(index, 'email', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    dir="rtl"
                    defaultValue={budget.desc}
                    onBlur={(e) => handleBlurUpdate(index, 'desc', e.target.value)}
                    fullWidth
                  />
                </TableCell>

                
                
                <TableCell>
                  <Switch
                    checked={budget.status === 1}
                    onChange={(e) => handleUpdateBudget(index, 'status', e.target.checked ? 1 : 0)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                  dir="ltr"
                    type="date"
                    defaultValue={new Date(budget.start * 1000).toISOString().substr(0, 10)}
                    error={!isValidDate(new Date(budget.start * 1000).toISOString().substr(0, 10))}
                    onBlur={(e) => handleBlurUpdate(index, 'start', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                  dir="ltr"
                    type="date"
                    defaultValue={new Date(budget.end * 1000).toISOString().substr(0, 10)}
                    error={!isValidDate(new Date(budget.end * 1000).toISOString().substr(0, 10))}
                    onBlur={(e) => handleBlurUpdate(index, 'end', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>{budget.metaData?.remaining || '-'}</TableCell>
                <TableCell>
                  
                <TableCell>
                  
                <TextField
                    dir="ltr"
                    defaultValue={budget.val}
                    onBlur={(e) => handleBlurUpdate(index, 'val', e.target.value)}
                    fullWidth
                  />
                  
                </TableCell>


                </TableCell>
                <TableCell>
                  <Tooltip title="פרטים נוספים">
                    <IconButton onClick={() => handlePopupOpen(budget)}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <AddBudget
        open={addBudgetOpen}
        onClose={() => setAddBudgetOpen(false)}
        onAdd={() => fetchBudgets()}
      />

      <DetailsPopup
        open={openPopup}
        budget={popupData}
        onClose={() => setOpenPopup(false)}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BudgetScreen;
