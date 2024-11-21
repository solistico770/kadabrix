import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Box, Button, CircularProgress, Typography, Paper, Grid, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.css'; // For custom animations

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await kdb.run({
          module: 'kdb_budget',
          name: 'getUserBudgets',
        });
        // Sort budgets to make valid ones appear first
        const sortedBudgets = response.sort((a, b) => b.status - a.status);
        setBudgets(sortedBudgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const formatBudgetType = (type) => {
    return type === 1 ? 'תקציב חד פעמי' : 'תקציב רב פעמי';
  };

  const formatStatus = (status) => {
    return status === 0 ? 'לא פעיל' : 'פעיל';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateRemaining = (budget) => {
    const total = parseFloat(budget.metaData.total);
    const value = parseFloat(budget.val);
    return value - total;
  };

  return (
    <Box sx={{ padding: theme.spacing(4), backgroundColor: theme.palette.background.default }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', marginBottom: theme.spacing(5) }}>
        בחירת תקציב!
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TransitionGroup>
          {budgets.map((budget) => {
            const metaData = JSON.parse(budget.metaData);
            const remaining = metaData.remaining
            return (
              <CSSTransition key={budget.id} timeout={500} classNames="budget-item">
                <Paper elevation={4} sx={{ padding: theme.spacing(4), marginBottom: theme.spacing(4), borderRadius: '12px' }}>
                  <Grid container spacing={3} alignItems="flex-start">
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                        מספר תקציב: {budget.id}
                      </Typography>
                      <Divider sx={{ marginY: theme.spacing(1) }} />
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        סוג תקציב: {formatBudgetType(budget.type)}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        מצב תקציב: {formatStatus(budget.status)}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        תאריך התחלה: {formatDate(budget.start)}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        תאריך סיום: {formatDate(budget.end)}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        ערך תקציב: {budget.val}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                        מצב תקציב
                      </Typography>
                      <Divider sx={{ marginY: theme.spacing(1) }} />
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        הזמנות במערכת: {metaData.orders}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        תעודות משלוח: {metaData.ship}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(1) }}>
                        חשבוניות: {metaData.inv}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                        ניצול תקציב
                      </Typography>
                      <Divider sx={{ marginY: theme.spacing(1) }} />
                      <Typography variant="body1" sx={{ marginBottom: theme.spacing(2) }}>
                        סה"כ ניצול תקציב: {metaData.total}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginBottom: theme.spacing(2), color: remaining > 0 ? 'green' : 'red' }}
                      >
                        יתרה לניצול: {remaining}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={budget.status === 0}
                        sx={{ filter: budget.status === 0 ? 'blur(2px)' : 'none' }}
                        onClick={() => alert(`בחרת את התקציב ${budget.id}`)}
                      >
                        בחר תקציב
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      )}
    </Box>
  );
};

export default BudgetPage;
