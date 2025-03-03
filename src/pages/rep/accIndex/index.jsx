import React, { useEffect, useState } from 'react';
import { 
  Box,
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button, 
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterListIcon,
  Print as PrintIcon,
  GetApp as GetAppIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import kdb from '../../../kadabrix/kadabrix';

function CustomerIndexScreen() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    openingBalance: 0,
    closingBalance: 0,
    totalCredit: 0,
    totalDebit: 0,
    documentTypeCounts: {}
  });

  // Fetch transactions data
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTransactions = await kdb.run({
        "module": "accIndex",
        "name": "getIndex"
      });

      const processedTransactions = processTransactionData(fetchedTransactions);
      setTransactions(processedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  // Process transaction data
  const processTransactionData = (data) => {
    let sum = 0;
    let id = 0;
    
    return data.map(item => {
      item.price = Number(item.price);
      sum += item.price;
      id++;
      
      return {
        ...item,
        id: id,
        balance: Math.round(sum * 100) / 100, // Round to 2 decimal places
        C: item.price > 0 ? Math.round(item.price * 100) / 100 : 0,
        D: item.price < 0 ? Math.abs(Math.round(item.price * 100) / 100) : 0
      };
    });
  };

  // Extract years from transaction data
  useEffect(() => {
    if (transactions.length > 0) {
      const uniqueYears = new Set();
      transactions.forEach((row) => {
        const date = new Date(row.valueDate * 1000);
        uniqueYears.add(date.getFullYear());      
      });
      
      const yearsArray = Array.from(uniqueYears).sort((a, b) => b - a); // Sort descending
      
      setYears(yearsArray);
      
      if (yearsArray.length > 0) {
        setSelectedYear(yearsArray[0]); // Set to most recent year
      }
    }
  }, [transactions]);

  // Filter data by selected year and calculate summary
  useEffect(() => {
    const filtered = transactions.filter((row) => {
      const date = new Date(row.valueDate * 1000);
      return date.getFullYear() === selectedYear;
    });
    
    setFilteredData(filtered);
    
    if (filtered.length > 0) {
      // Calculate summary data
      const openingBalance = Math.round((filtered[0].balance - filtered[0].price) * 100) / 100;
      const closingBalance = filtered[filtered.length - 1].balance;
      const totalCredit = filtered.reduce((sum, row) => sum + row.C, 0);
      const totalDebit = filtered.reduce((sum, row) => sum + row.D, 0);
      
      // Count document types
      const documentTypeCounts = {};
      filtered.forEach(row => {
        const type = row.docType || 'אחר';
        documentTypeCounts[type] = (documentTypeCounts[type] || 0) + 1;
      });
      
      setSummary({
        openingBalance,
        closingBalance,
        totalCredit,
        totalDebit,
        documentTypeCounts
      });
    } else {
      setSummary({
        openingBalance: 0,
        closingBalance: 0,
        totalCredit: 0,
        totalDebit: 0,
        documentTypeCounts: {}
      });
    }
  }, [transactions, selectedYear]);

  // Format unix timestamp to DD/MM/YYYY
  const formatDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format currency with thousands separator
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle print function
  const handlePrint = () => {
    window.print();
  };

  // Handle export function - export to CSV
  const handleExport = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['תאריך', 'מספר תנועה', 'סוג מסמך', 'שם מסמך', 'זכות', 'חובה', 'יתרה'];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        formatDate(row.valueDate),
        row.transId,
        row.docType || '',
        row.docName,
        row.C,
        row.D,
        row.balance
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `כרטסת-לקוח-${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get color based on balance value
  const getBalanceColor = (balance) => {
    if (balance > 0) return 'success.main';
    if (balance < 0) return 'error.main';
    return 'text.primary';
  };

  // Get document type chip color
  const getDocTypeColor = (docType) => {
    const types = {
      'חשבונית מס': 'primary',
      'קבלה': 'success',
      'זיכוי': 'warning',
      'חיוב': 'error'
    };
    
    return types[docType] || 'default';
  };

  // Calculate screen height for table container
  const screenHeight = window.innerHeight * 0.6; // 60% of screen height

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      direction: 'rtl',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Card sx={{ 
        mb: 3, 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(to right, #3f51b5, #2196f3)'
      }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                כרטסת לקוח
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                ניהול ומעקב תנועות פיננסיות
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="רענן נתונים">
                  <IconButton 
                    color="inherit" 
                    onClick={fetchTransactions}
                    disabled={loading}
                    sx={{ color: 'white' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="הדפסה">
                  <IconButton 
                    color="inherit" 
                    onClick={handlePrint}
                    sx={{ color: 'white' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="ייצוא לקובץ CSV">
                  <IconButton 
                    color="inherit" 
                    onClick={handleExport}
                    sx={{ color: 'white' }}
                    disabled={filteredData.length === 0}
                  >
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Year Selection */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 1, 
              borderRadius: 2,
              display: 'inline-block',
              background: 'white'
            }}
          >
            <ButtonGroup 
              variant="contained" 
              size={isMobile ? "small" : "medium"}
              aria-label="שנים"
            >
              {years.map((year) => (
                <Button 
                  key={year} 
                  onClick={() => setSelectedYear(year)}
                  sx={{
                    backgroundColor: year === selectedYear ? '#1e88e5' : 'white',
                    color: year === selectedYear ? 'white' : '#1e88e5',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: year === selectedYear ? '#1565c0' : '#e3f2fd',
                    },
                    borderColor: '#1e88e5'
                  }}
                >
                  {year} 
                </Button>
              ))}
            </ButtonGroup>
          </Paper>
        )}
      </Box>

      {/* Summary Cards */}
      {!loading && filteredData.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Opening Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)' },
                bgcolor: '#f5f5f5'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    יתרת פתיחה
                  </Typography>
                  <DateRangeIcon color="primary" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: getBalanceColor(summary.openingBalance),
                    direction: 'ltr',
                    textAlign: 'right'
                  }}
                >
                  {formatCurrency(summary.openingBalance)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedYear} תחילת שנת
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Total Credit */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)' },
                bgcolor: '#e8f5e9'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                    סה"כ זכות
                  </Typography>
                  <ArrowUpwardIcon color="success" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'success.main',
                    direction: 'ltr',
                    textAlign: 'right'
                  }}
                >
                  {formatCurrency(summary.totalCredit)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedYear} סך הזיכויים בשנת
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Total Debit */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)' },
                bgcolor: '#ffebee'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.dark' }}>
                    סה"כ חובה
                  </Typography>
                  <ArrowDownwardIcon color="error" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'error.main',
                    direction: 'ltr',
                    textAlign: 'right'
                  }}
                >
                  {formatCurrency(summary.totalDebit)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedYear} סך החיובים בשנת
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Closing Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)' },
                bgcolor: '#e3f2fd'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    יתרת סגירה
                  </Typography>
                  <AttachMoneyIcon color="primary" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: getBalanceColor(summary.closingBalance),
                    direction: 'ltr',
                    textAlign: 'right'
                  }}
                >
                  {formatCurrency(summary.closingBalance)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  יתרה נוכחית מעודכנת
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Document Types Summary */}
      {!loading && filteredData.length > 0 && Object.keys(summary.documentTypeCounts).length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ mr: 1 }} />
            סוגי מסמכים
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(summary.documentTypeCounts).map(([type, count]) => (
              <Chip 
                key={type}
                label={`${type}: ${count}`}
                color={getDocTypeColor(type)}
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Transactions Table */}
      <Card sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <BarChartIcon sx={{ mr: 1 }} />
            תנועות כרטסת
            {filteredData.length > 0 && (
              <Chip 
                label={`${filteredData.length} רשומות`}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary">
                שנה: {selectedYear}
              </Typography>
            )}
          </Box>
        </Box>
        
        <TableContainer 
          sx={{ maxHeight: screenHeight, overflowY: 'auto', bgcolor: 'white' }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredData.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                אין נתונים לשנה זו
              </Typography>
            </Box>
          ) : (
            <Table stickyHeader aria-label="customer index table">
              <TableHead>
                <TableRow>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      bgcolor: '#1976d2', 
                      color: 'white', 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    תאריך
                  </TableCell>
                  {!isMobile && (
                    <TableCell 
                      align="right" 
                      sx={{ 
                        bgcolor: '#1976d2', 
                        color: 'white', 
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      מספר תנועה
                    </TableCell>
                  )}
                  <TableCell 
                    align="right" 
                    sx={{ 
                      bgcolor: '#1976d2', 
                      color: 'white', 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    סוג מסמך
                  </TableCell>
                  {!isMobile && (
                    <TableCell 
                      align="right" 
                      sx={{ 
                        bgcolor: '#1976d2', 
                        color: 'white', 
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      שם מסמך
                    </TableCell>
                  )}
                  <TableCell 
                    align="right" 
                    sx={{ 
                      bgcolor: '#1976d2', 
                      color: 'white', 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    זכות
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      bgcolor: '#1976d2', 
                      color: 'white', 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    חובה
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      bgcolor: '#1976d2', 
                      color: 'white', 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    יתרה
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    sx={{
                      bgcolor: index % 2 === 0 ? 'white' : '#f8f9fa',
                      '&:hover': {
                        bgcolor: '#e3f2fd',
                      }
                    }}
                  >
                    <TableCell 
                      align="right"
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatDate(row.valueDate)}
                    </TableCell>
                    {!isMobile && (
                      <TableCell 
                        align="right"
                        sx={{
                          borderBottom: '1px solid #e0e0e0',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {row.transId}
                      </TableCell>
                    )}
                    <TableCell 
                      align="right"
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {row.docType ? (
                        <Chip 
                          label={row.docType}
                          size="small"
                          color={getDocTypeColor(row.docType)}
                          variant="outlined"
                        />
                      ) : '-'}
                    </TableCell>
                    {!isMobile && (
                      <TableCell 
                        align="right"
                        sx={{
                          borderBottom: '1px solid #e0e0e0',
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Tooltip title={row.docName}>
                          <span>{row.docName}</span>
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell 
                      align="right"
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        color: 'success.main',
                        fontWeight: row.C > 0 ? 'bold' : 'normal',
                        direction: 'ltr',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {row.C > 0 ? formatCurrency(row.C) : '-'}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        color: 'error.main',
                        fontWeight: row.D > 0 ? 'bold' : 'normal',
                        direction: 'ltr',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {row.D > 0 ? formatCurrency(row.D) : '-'}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        color: getBalanceColor(row.balance),
                        fontWeight: 'bold',
                        direction: 'ltr',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatCurrency(row.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        
        {/* Table Footer with Totals */}
        {!loading && filteredData.length > 0 && (
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '2px solid #e0e0e0', 
              bgcolor: '#f5f5f5', 
              display: 'flex', 
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              סה"כ רשומות: {filteredData.length}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 } }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main', direction: 'ltr' }}>
                סה"כ זכות: {formatCurrency(summary.totalCredit)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'error.main', direction: 'ltr' }}>
                סה"כ חובה: {formatCurrency(summary.totalDebit)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', direction: 'ltr' }}>
                יתרה: {formatCurrency(summary.closingBalance)}
              </Typography>
            </Box>
          </Box>
        )}
      </Card>
      
      {/* Additional Info Footer */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          המידע מעודכן לתאריך {new Date().toLocaleDateString('he-IL')}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomerIndexScreen;