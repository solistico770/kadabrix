import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useMediaQuery,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  ArrowBackIos as ArrowBackIcon, 
  Search as SearchIcon,
  AccountBalance as AccountIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  BusinessCenter as BusinessCenterIcon,
  Clear as ClearIcon,
  FilterAlt as FilterAltIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import kdb from '../../../kadabrix/kadabrix';

// ==================== UTILITY FUNCTIONS ====================

// Format currency in ILS
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date from unix timestamp
const formatDate = (unixTime) => {
  if (!unixTime) return '';
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString('he-IL');
};

// ==================== HEADER COMPONENT ====================

const ReportHeader = ({ 
  tabValue, 
  setTabValue, 
  summary, 
  searchTerm, 
  setSearchTerm, 
  showSearch, 
  setShowSearch,
  exportToCSV,
  printReport,
  fetchData,
  loading,
  filteredDataLength,
  isFiltering,
  clearFilters,
  isMobile,
  data
}) => {
  return (
    <Paper elevation={3} square className="py-3 px-4 mb-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <BusinessCenterIcon className="text-blue-600 mr-2" />
          <Typography variant="h5" className="font-bold">
            גיול חובות
          </Typography>
          {isFiltering && (
            <Chip 
              label={`מסננים פעילים (${filteredDataLength})`} 
              color="primary" 
              size="small" 
              onDelete={clearFilters}
              className="mr-2 ml-2"
            />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {showSearch ? (
            <div className="flex items-center">
              <TextField
                placeholder="חיפוש..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        size="small" 
                        onClick={() => setSearchTerm('')}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <IconButton onClick={() => setShowSearch(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          ) : (
            <IconButton 
              color="primary" 
              onClick={() => setShowSearch(true)}
              className="ml-2"
            >
              <SearchIcon />
            </IconButton>
          )}
          
          <Tooltip title="ייצא לקובץ CSV">
            <IconButton
              color="primary"
              onClick={exportToCSV}
              disabled={loading || filteredDataLength === 0}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="הדפסה">
            <IconButton
              color="primary"
              onClick={printReport}
              disabled={loading || filteredDataLength === 0}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="רענון">
            <IconButton
              color="primary"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      
      {/* Tabs for quick filtering */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons="auto"
        className="mt-3"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab 
          label={
            <Badge badgeContent={data.length} color="primary" max={999} showZero={false}>
              <span className="px-2">הכל</span>
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={summary.overdueCount} color="error" max={999} showZero={false}>
              <span className="px-2">חובות עבר</span>
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={summary.highDebtCount} color="warning" max={999} showZero={false}>
              <span className="px-2">חוב גבוה</span>
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={summary.creditCount} color="success" max={999} showZero={false}>
              <span className="px-2">בזכות</span>
            </Badge>
          } 
        />
      </Tabs>
    </Paper>
  );
};

// ==================== FILTERS COMPONENT ====================

const FilterControls = ({ 
  includePositiveBalance, 
  setIncludePositiveBalance, 
  selectedAgent, 
  setSelectedAgent, 
  agents, 
  lastUpdated 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <FormControlLabel
        control={
          <Checkbox
            checked={includePositiveBalance}
            onChange={(e) => setIncludePositiveBalance(e.target.checked)}
            color="primary"
          />
        }
        label="כולל חשבונות בזכות"
        className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200"
      />
      
      {agents.length > 0 && (
        <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
          <Typography variant="body2" className="ml-2">סוכן:</Typography>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="border-0 bg-transparent outline-none pr-2 pl-6"
          >
            <option value="">הכל</option>
            {agents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
          {selectedAgent && (
            <IconButton size="small" onClick={() => setSelectedAgent('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      )}
      
      {lastUpdated && (
        <Typography variant="body2" className="text-gray-500 ml-auto">
          עודכן לאחרונה: {lastUpdated.toLocaleTimeString('he-IL')}
        </Typography>
      )}
    </div>
  );
};

// ==================== SUMMARY CARDS COMPONENT ====================

const SummaryCard = ({ title, amount, icon, color }) => (
  <Paper elevation={1} className="p-4 h-full">
    <div className="flex items-center justify-between">
      <div>
        <Typography variant="body2" className="text-gray-500 mb-1">
          {title}
        </Typography>
        <Typography variant="h6" className={`font-bold ${color}`}>
          {amount}
        </Typography>
      </div>
      <div className={`p-3 rounded-full bg-${color.replace('text-', 'bg-opacity-10')}`}>
        {icon}
      </div>
    </div>
  </Paper>
);

const SummaryCards = ({ totals, summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <SummaryCard 
        title="סה״כ חוב" 
        amount={formatCurrency(totals.openDebt)}
        icon={<AccountIcon className="text-blue-600" />}
        color={totals.openDebt < 0 ? "text-green-600" : "text-red-600"}
      />
      <SummaryCard 
        title="חובות עבר"
        amount={formatCurrency(totals.oldDebt)}
        icon={<BarChartIcon className="text-orange-600" />}
        color="text-orange-600"
      />
      <SummaryCard 
        title="ממוצע לחשבון"
        amount={formatCurrency(summary.avgDebt)}
        icon={<PieChartIcon className="text-purple-600" />}
        color="text-purple-600"
      />
      <SummaryCard 
        title="מספר לקוחות"
        amount={summary.totalCustomers.toLocaleString()}
        icon={<BusinessCenterIcon className="text-blue-600" />}
        color="text-blue-600"
      />
    </div>
  );
};

// ==================== DESKTOP TABLE COMPONENT ====================

const DesktopTable = ({ 
  filteredAndSortedData, 
  headers, 
  sortConfig, 
  requestSort, 
  totals,
  fetchCustomerDetails 
}) => {
  // Render table header with sorting
  const renderSortableHeader = (key, label) => (
    <TableCell 
      className={`font-semibold cursor-pointer transition-colors ${sortConfig.key === key ? 'bg-blue-50' : ''}`}
      onClick={() => requestSort(key)}
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {sortConfig.key === key && (
          <span className="mr-1 text-blue-600">
            {sortConfig.direction === 'asc' ? '▲' : '▼'}
          </span>
        )}
      </div>
    </TableCell>
  );

  return (
    <TableContainer component={Paper} className="mb-4 overflow-x-auto print:overflow-visible shadow-md">
      <Table stickyHeader aria-label="debt aging table">
        <TableHead>
          <TableRow className="bg-gray-50">
            {renderSortableHeader('custName', 'קוד')}
            {renderSortableHeader('custDes', 'תיאור')}
            {renderSortableHeader('oldDebt', headers.oldDebt || 'קודם')}
            {renderSortableHeader('month2', headers.month2 || 'חודש 2')}
            {renderSortableHeader('month1', headers.month1 || 'חודש 1')}
            {renderSortableHeader('month0', headers.month0 || 'חודש 0')}
            {renderSortableHeader('futureDebt', headers.futureDebt || 'עתידי')}
            {renderSortableHeader('openDebt', headers.openDebt || 'סה"כ')}
            {renderSortableHeader('agent', 'סוכן')}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAndSortedData.map((row) => (
            <TableRow 
              key={row.cust}
              hover
              className="hover:bg-blue-50 transition-colors"
            >
              <TableCell 
                className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline font-medium"
                onClick={() => fetchCustomerDetails(row.cust, row.custName)}
              >
                {row.custName}
              </TableCell>
              <TableCell>
                {row.custDes}
              </TableCell>
              <TableCell className={`font-mono text-right ${row.oldDebt < 0 ? 'text-green-600' : row.oldDebt > 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(row.oldDebt)}
              </TableCell>
              <TableCell className={`font-mono text-right ${row.month2 < 0 ? 'text-green-600' : row.month2 > 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(row.month2)}
              </TableCell>
              <TableCell className={`font-mono text-right ${row.month1 < 0 ? 'text-green-600' : row.month1 > 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(row.month1)}
              </TableCell>
              <TableCell className={`font-mono text-right ${row.month0 < 0 ? 'text-green-600' : row.month0 > 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(row.month0)}
              </TableCell>
              <TableCell className={`font-mono text-right ${row.futureDebt < 0 ? 'text-green-600' : row.futureDebt > 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(row.futureDebt)}
              </TableCell>
              <TableCell className={`font-mono text-right font-semibold ${row.openDebt < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(row.openDebt)}
              </TableCell>
              <TableCell>
                {row.agent || '-'}
              </TableCell>
            </TableRow>
          ))}
          
          {/* Totals row */}
          <TableRow className="bg-gray-100 font-bold">
            <TableCell colSpan={2} className="border-t-2 border-gray-300">
              סה"כ ({filteredAndSortedData.length} לקוחות)
            </TableCell>
            <TableCell className={`font-mono text-right border-t-2 border-gray-300 ${totals.oldDebt < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.oldDebt)}
            </TableCell>
            <TableCell className={`font-mono text-right border-t-2 border-gray-300 ${totals.month2 < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.month2)}
            </TableCell>
            <TableCell className={`font-mono text-right border-t-2 border-gray-300 ${totals.month1 < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.month1)}
            </TableCell>
            <TableCell className={`font-mono text-right border-t-2 border-gray-300 ${totals.month0 < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.month0)}
            </TableCell>
            <TableCell className={`font-mono text-right border-t-2 border-gray-300 ${totals.futureDebt < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.futureDebt)}
            </TableCell>
            <TableCell className={`font-mono text-right font-semibold border-t-2 border-gray-300 ${totals.openDebt < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.openDebt)}
            </TableCell>
            <TableCell className="border-t-2 border-gray-300"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ==================== MOBILE VIEW COMPONENT ====================

const MobileView = ({ 
  filteredAndSortedData, 
  headers, 
  totals, 
  expandedRows, 
  toggleRowExpansion,
  fetchCustomerDetails
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
        <div className="flex justify-between items-center">
          <Typography variant="subtitle1" className="font-bold">
            סיכום
          </Typography>
          <Typography 
            variant="h6" 
            className={totals.openDebt < 0 ? 'text-green-600' : 'text-red-600'}
          >
            {formatCurrency(totals.openDebt)}
          </Typography>
        </div>
        <Divider className="my-2" />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">לקוחות:</div>
          <div className="text-right font-medium">
            {filteredAndSortedData.length}
          </div>
          <div className="text-gray-600">חובות עבר:</div>
          <div className={`text-right ${totals.oldDebt < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totals.oldDebt)}
          </div>
        </div>
      </div>
      
      {filteredAndSortedData.map((row) => (
        <Paper key={row.cust} className="overflow-hidden rounded-lg shadow-sm">
          <div 
            className="flex justify-between items-center p-3 cursor-pointer border-r-4"
            style={{ 
              borderRightColor: row.openDebt < 0 ? '#16a34a' : 
                                row.oldDebt > 0 ? '#dc2626' : '#2563eb'
            }}
            onClick={() => toggleRowExpansion(row.cust)}
          >
            <div>
              <Typography variant="subtitle1" className="font-bold">
                {row.custName}
              </Typography>
              <Typography variant="body2" className="text-gray-600 text-sm">
                {row.custDes}
                {row.agent && <span className="text-gray-500 mr-2">| {row.agent}</span>}
              </Typography>
            </div>
            <div className="flex items-center">
              <Typography 
                variant="h6" 
                className={`font-mono ${row.openDebt < 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {formatCurrency(row.openDebt)}
              </Typography>
              <div className="mr-2">
                {expandedRows[row.cust] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </div>
          </div>
          
          {expandedRows[row.cust] && (
            <div className="bg-gray-50 p-3 border-t">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-gray-600 text-sm">קודם:</div>
                <div className={`text-right ${row.oldDebt < 0 ? 'text-green-600' : row.oldDebt > 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(row.oldDebt)}
                </div>
                
                <div className="text-gray-600 text-sm">{headers.month2 || 'חודש 2'}:</div>
                <div className={`text-right ${row.month2 < 0 ? 'text-green-600' : row.month2 > 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(row.month2)}
                </div>
                
                <div className="text-gray-600 text-sm">{headers.month1 || 'חודש 1'}:</div>
                <div className={`text-right ${row.month1 < 0 ? 'text-green-600' : row.month1 > 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(row.month1)}
                </div>
                
                <div className="text-gray-600 text-sm">{headers.month0 || 'חודש 0'}:</div>
                <div className={`text-right ${row.month0 < 0 ? 'text-green-600' : row.month0 > 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(row.month0)}
                </div>
                
                <div className="text-gray-600 text-sm">עתידי:</div>
                <div className={`text-right ${row.futureDebt < 0 ? 'text-green-600' : row.futureDebt > 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(row.futureDebt)}
                </div>
              </div>
              
              <div className="mt-3 flex justify-center">
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => fetchCustomerDetails(row.cust, row.custName)}
                  className="w-full"
                >
                  לפרטים נוספים
                </Button>
              </div>
            </div>
          )}
        </Paper>
      ))}
    </div>
  );
};

// ==================== DETAILS DIALOG COMPONENT ====================

const CustomerDetailsDialog = ({
  detailsOpen,
  setDetailsOpen,
  selectedCustomerName,
  customerDetails
}) => {
  return (
    <Dialog
      open={detailsOpen}
      onClose={() => setDetailsOpen(false)}
      maxWidth="md"
      fullWidth
      dir="rtl"
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          <Typography variant="h6" className="flex items-center">
            <AccountIcon className="mr-2 text-blue-600" />
            פירוט חובות - {selectedCustomerName}
          </Typography>
          <IconButton onClick={() => setDetailsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        {customerDetails.length === 0 ? (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ת.מסמך</TableCell>
                  <TableCell>ת.תשלום</TableCell>
                  <TableCell>אסמכתא</TableCell>
                  <TableCell>תיאור</TableCell>
                  <TableCell align="right">סכום</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerDetails.map((detail) => (
                  <TableRow key={detail.id} hover>
                    <TableCell>{detail.formattedDocDate || '-'}</TableCell>
                    <TableCell>{detail.formattedDate || '-'}</TableCell>
                    <TableCell>{detail.reference || '-'}</TableCell>
                    <TableCell>{detail.description || '-'}</TableCell>
                    <TableCell 
                      align="right"
                      className={`font-mono ${detail.openDebt < 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatCurrency(detail.openDebt)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100">
                  <TableCell colSpan={4} align="right" className="font-bold">
                    סה"כ
                  </TableCell>
                  <TableCell 
                    align="right"
                    className={`font-mono font-bold ${
                      customerDetails.reduce((sum, detail) => sum + Number(detail.openDebt || 0), 0) < 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(
                      customerDetails.reduce((sum, detail) => sum + Number(detail.openDebt || 0), 0)
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setDetailsOpen(false)}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==================== EMPTY STATE COMPONENT ====================

const EmptyState = ({ isFiltering, clearFilters }) => {
  return (
    <Paper className="p-8 text-center">
      <Typography variant="h6" className="text-gray-500 mb-2">
        לא נמצאו נתונים
      </Typography>
      <Typography variant="body2" className="text-gray-400">
        {isFiltering ? 'נסה לשנות את הסינון או לרענן את הנתונים' : 'לא נמצאו רשומות. נסה לרענן את הנתונים.'}
      </Typography>
      {isFiltering && (
        <Button 
          variant="outlined" 
          color="primary"
          onClick={clearFilters}
          className="mt-4"
          startIcon={<ClearIcon />}
        >
          נקה סינון
        </Button>
      )}
    </Paper>
  );
};

// ==================== MAIN COMPONENT ====================

const DebtAgingReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [includePositiveBalance, setIncludePositiveBalance] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [headers, setHeaders] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'openDebt', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await kdb.run({
        module: "repDebtAging",
        name: "getDebtAging",
        data: { 
          includePositiveBalance
        }
      });
      
      setData(response.rows || []);
      setHeaders(response.headers || {});
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('לא ניתן לטעון נתונים. אנא נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };


  // Fetch customer details
  const fetchCustomerDetails = async (cust, custName) => {
    try {
      setDetailsOpen(true);
      setSelectedCustomerName(custName);
      setCustomerDetails([]);
      
      const response = await kdb.run({
        module: "repDebtAging",
        name: "getCustomerDebtDetails",
        data: { cust }
      });
      
      setCustomerDetails(response.rows || []);
    } catch (err) {
      console.error('Error fetching customer details:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [includePositiveBalance]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get all unique agents for filtering
  const agents = useMemo(() => {
    const uniqueAgents = [...new Set(data.map(item => item.agent).filter(Boolean))];
    return uniqueAgents.sort();
  }, [data]);

  // Filter and Sort data
  const filteredAndSortedData = useMemo(() => {
    let filteredItems = [...data];
    
    // First apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        (item.custName && item.custName.toString().toLowerCase().includes(lowerSearchTerm)) ||
        (item.custDes && item.custDes.toString().toLowerCase().includes(lowerSearchTerm)) ||
        (item.agent && item.agent.toString().toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Then apply agent filter
    if (selectedAgent) {
      filteredItems = filteredItems.filter(item => item.agent === selectedAgent);
    }
    
    // Apply tab filtering
    if (tabValue === 1) { // Overdue
      filteredItems = filteredItems.filter(item => item.oldDebt > 0);
    } else if (tabValue === 2) { // High Debt
      filteredItems = filteredItems.filter(item => item.openDebt > 5000); // Threshold can be adjusted
    } else if (tabValue === 3) { // Credit
      filteredItems = filteredItems.filter(item => item.openDebt < 0);
    }
    
    // Then sort
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        // Handle numeric and string sorting
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Convert to strings for comparison
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setIsFiltering(searchTerm !== '' || selectedAgent !== '' || tabValue !== 0);
    
    return filteredItems;
  }, [data, searchTerm, selectedAgent, tabValue, sortConfig]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredAndSortedData.reduce((acc, row) => {
      acc.openDebt += Number(row.openDebt || 0);
      acc.oldDebt += Number(row.oldDebt || 0);
      acc.month2 += Number(row.month2 || 0);
      acc.month1 += Number(row.month1 || 0);
      acc.month0 += Number(row.month0 || 0);
      acc.futureDebt += Number(row.futureDebt || 0);
      return acc;
    }, { 
      openDebt: 0, 
      oldDebt: 0, 
      month2: 0, 
      month1: 0, 
      month0: 0, 
      futureDebt: 0 
    });
  }, [filteredAndSortedData]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalCustomers = filteredAndSortedData.length;
    const highDebtCount = filteredAndSortedData.filter(row => row.openDebt > 5000).length;
    const creditCount = filteredAndSortedData.filter(row => row.openDebt < 0).length;
    const overdueCount = filteredAndSortedData.filter(row => row.oldDebt > 0).length;
    
    return {
      totalCustomers,
      highDebtCount,
      creditCount,
      overdueCount,
      avgDebt: totalCustomers ? totals.openDebt / totalCustomers : 0
    };
  }, [filteredAndSortedData, totals]);

  // Toggle row expansion (for mobile view)
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAgent('');
    setTabValue(0);
  };

  // Export data as CSV
  const exportToCSV = () => {
    let csvContent = "קוד,תיאור,קודם," + 
                    `${headers.month2 || 'חודש 2'},` + 
                    `${headers.month1 || 'חודש 1'},` + 
                    `${headers.month0 || 'חודש 0'},` + 
                    `עתידי,סה"כ,סוכן\n`;
                    
    filteredAndSortedData.forEach(row => {
      csvContent += `"${row.custName || ''}","${row.custDes || ''}",${row.oldDebt},${row.month2},` +
                    `${row.month1},${row.month0},${row.futureDebt},${row.openDebt},"${row.agent || ''}"\n`;
    });
    
    // Add totals row
    csvContent += `"סה"כ","",${totals.oldDebt},${totals.month2},` +
                  `${totals.month1},${totals.month0},${totals.futureDebt},${totals.openDebt},""\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'debt_aging_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  return (
    <div className="max-w-full bg-gray-50 min-h-screen overflow-hidden" dir="rtl">
      {/* Header with search and actions */}
      <ReportHeader
        tabValue={tabValue}
        setTabValue={setTabValue}
        summary={summary}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        exportToCSV={exportToCSV}
        printReport={printReport}
        fetchData={fetchData}
        loading={loading}
        filteredDataLength={filteredAndSortedData.length}
        isFiltering={isFiltering}
        clearFilters={clearFilters}
        isMobile={isMobile}
        data={data}
      />

      <div className="px-4 pb-4">
        {/* Filters */}
        <FilterControls
          includePositiveBalance={includePositiveBalance}
          setIncludePositiveBalance={setIncludePositiveBalance}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          agents={agents}
          lastUpdated={lastUpdated}
        />
        
        {/* Summary cards - only on desktop */}
        {!isMobile && (
          <SummaryCards
            totals={totals}
            summary={summary}
          />
        )}

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <Fade in>
            <div className="flex flex-col items-center justify-center my-12">
              <CircularProgress color="primary" />
              <Typography variant="body2" className="mt-2 text-gray-600">
                טוען נתונים...
              </Typography>
            </div>
          </Fade>
        ) : (
          <>
            {filteredAndSortedData.length === 0 ? (
              <EmptyState 
                isFiltering={isFiltering} 
                clearFilters={clearFilters} 
              />
            ) : (
              <>
                {/* Desktop view */}
                {!isMobile && (
                  <DesktopTable
                    filteredAndSortedData={filteredAndSortedData}
                    headers={headers}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    totals={totals}
                    fetchCustomerDetails={fetchCustomerDetails}
                  />
                )}

                {/* Mobile view */}
                {isMobile && (
                  <MobileView
                    filteredAndSortedData={filteredAndSortedData}
                    headers={headers}
                    totals={totals}
                    expandedRows={expandedRows}
                    toggleRowExpansion={toggleRowExpansion}
                    fetchCustomerDetails={fetchCustomerDetails}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectedCustomerName={selectedCustomerName}
        customerDetails={customerDetails}
      />

      <div className="text-gray-500 text-sm mt-4 text-center px-4 pb-4">
        צפה בחובות לקוחות לפי חודשים, לחץ על שם לקוח כדי לראות פרטים, השתמש בסינון כדי למצוא מידע ספציפי.
      </div>
    </div>
  );
};

export default DebtAgingReport;
