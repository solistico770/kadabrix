// File: src/pages/ods/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Tabs, Tab, Box, Paper, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterPanel from './components/FilterPanel';
import LookupButtons from './components/LookupButtons';
import OrdersTable from './components/OrdersTable';
import OdsStatusManager from './components/OdsStatusManager';
import PickStatusManager from './components/PickStatusManager';
import PickersManager from './components/PickersManager';
import LinesManager from './components/LinesManager';
import VansManager from './components/VansManager';
import DriversManager from './components/DriversManager';
import LinesInstanceManager from './components/LinesInstanceManager';
import DistributionRoutes from './components/DistributionRoutes';
import TabPanel from './components/TabPanel';
import 'dayjs/locale/he';

const Index = () => {
  const currentRequestRef = useRef(null);
  const [tabValue, setTabValue] = useState(0);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalRows, setTotalRows] = useState(0);
  const [filter, setFilter] = useState({
    odsStatus: [],
    pickStatus: [],
    pickDateFrom: null,
    pickDateTo: null,
    pickers: [],
    lines: [],
    city: '',
    customerName: '',
    totalFrom: '',
    totalTo: '',
    orderDateFrom: null,
    orderDateTo: null,
    odsInstance: null, // Added for filtering by route
  });
  const [odsStatuses, setOdsStatuses] = useState([]);
  const [pickStatuses, setPickStatuses] = useState([]);
  const [pickers, setPickers] = useState([]);
  const [lines, setLines] = useState([]);
  const [linesInstances, setLinesInstances] = useState([]);
  const [vans, setVans] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const refresh = async () => {
    const requestId = {};
    currentRequestRef.current = requestId;
  
    setLoading(true);
    try {
      const ordersData = await kdb.run({ 
        module: "OrderRouting", 
        name: "getAllOrders", 
        data: { filter, limit: rowsPerPage, offset: page * rowsPerPage } 
      });
  
      // Only update state if this is the latest request
      if (currentRequestRef.current === requestId) {
        setOrders(ordersData.orders);
        setTotalRows(ordersData.total);
      }
    } catch (error) {
      console.error("שגיאה בטעינת נתונים:", error);
    } finally {
      if (currentRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }

  const fetchInitialData = async () => {
    try {
      const odsStatusesData = await kdb.run({ module: "OrderRouting", name: "manageOdsStatusesGet", data: {} });
      setOdsStatuses(odsStatusesData.items);

      const pickStatusesData = await kdb.run({ module: "OrderRouting", name: "managePickStatusesGet", data: {} });
      setPickStatuses(pickStatusesData.items);

      const pickersData = await kdb.run({ module: "OrderRouting", name: "managePickersGet", data: {} });
      setPickers(pickersData.items);

      const linesData = await kdb.run({ module: "OrderRouting", name: "manageLinesGet", data: {} });
      setLines(linesData.items);

      const linesInstancesData = await kdb.run({ module: "OrderRouting", name: "manageLinesInstancesGet", data: {} });
      setLinesInstances(linesInstancesData.items);
      
      const vansData = await kdb.run({ module: "OrderRouting", name: "manageVansGet", data: {} });
      setVans(vansData.items);
      
      const driversData = await kdb.run({ module: "OrderRouting", name: "manageDriversGet", data: {} });
      setDrivers(driversData.items);
    } catch (error) {
      console.error("שגיאה בטעינת נתונים ראשוניים:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      refresh();
    }
  }, [filter, page, rowsPerPage, tabValue]);

  const handleDialogOpen = (dialog, routeId = null) => {
    setDialogOpen({
      type: dialog,
      id: routeId
    });
  };
  
  const handleDialogClose = () => {
    setDialogOpen(null);
    fetchInitialData(); // Refresh lookup data after closing dialog
  };
  
  const handleViewRouteOrders = (routeId) => {
    // Reset page to first page
    setPage(0);
    
    // Switch to orders tab
    setTabValue(0);
    
    // Set filter to show only orders for this route
    const newFilter = {
      ...filter,
      odsInstance: routeId
    };
    setFilter(newFilter);
    
    // Show active filter notification
    setActiveFilter('route');
    
    // This will trigger a refresh because we changed the filter
  };
  
  const clearActiveFilter = () => {
    setFilter({
      ...filter,
      odsInstance: null
    });
    setActiveFilter(null);
  };
  
  // Get route name by ID
  const getRouteName = (id) => {
    const route = linesInstances.find(r => r.id === id);
    if (!route) return `מסלול ${id}`;
    
    const line = lines.find(l => l.id === route.line);
    return `${line?.desc || route.line} - ${route.date ? new Date(route.date).toLocaleDateString() : ''}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">מסך עבודה לניתוב הזמנות</h1>

        <Paper className="mb-6">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            className="border-b border-gray-200"
          >
            <Tab label="הזמנות" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="מסלולי הפצה" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="הגדרות" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Paper>

        {/* Orders Tab */}
        <TabPanel value={tabValue} index={0}>
          {activeFilter === 'route' && filter.odsInstance && (
            <Alert 
              severity="info"
              className="mb-4"
              action={
                <IconButton
                  aria-label="clear"
                  color="inherit"
                  size="small"
                  onClick={clearActiveFilter}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              מציג הזמנות למסלול: {getRouteName(filter.odsInstance)}
            </Alert>
          )}
          
          <FilterPanel 
            filter={filter} 
            setFilter={setFilter} 
            odsStatuses={odsStatuses}
            pickStatuses={pickStatuses}
            pickers={pickers}
            lines={lines}
            lineInstances={linesInstances}
          />
          <OrdersTable 
            refresh={refresh}
            orders={orders} 
            loading={loading} 
            page={page} 
            setPage={setPage} 
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalRows={totalRows} 
            odsStatuses={odsStatuses}
            pickStatuses={pickStatuses}
            pickers={pickers}
            linesInstances={linesInstances}
          />
        </TabPanel>

        {/* Distribution Routes Tab */}
        <TabPanel value={tabValue} index={1}>
          <DistributionRoutes
            handleDialogOpen={handleDialogOpen}
            onViewOrders={handleViewRouteOrders}
          />
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">הגדרות המערכת</h2>
            <LookupButtons handleDialogOpen={handleDialogOpen} />
          </div>
        </TabPanel>

        {/* Dialogs */}
        <OdsStatusManager open={dialogOpen && dialogOpen.type === 'odsStatus'} onClose={handleDialogClose} />
        <PickStatusManager open={dialogOpen && dialogOpen.type === 'pickStatus'} onClose={handleDialogClose} />
        <PickersManager open={dialogOpen && dialogOpen.type === 'pickers'} onClose={handleDialogClose} />
        <LinesManager open={dialogOpen && dialogOpen.type === 'lines'} onClose={handleDialogClose} />
        <VansManager open={dialogOpen && dialogOpen.type === 'vans'} onClose={handleDialogClose} />
        <DriversManager open={dialogOpen && dialogOpen.type === 'drivers'} onClose={handleDialogClose} />
        <LinesInstanceManager 
          open={dialogOpen && dialogOpen.type === 'linesInstance'} 
          onClose={handleDialogClose} 
          editId={dialogOpen?.id} 
        />
      </div>
    </LocalizationProvider>
  );
};

export default Index;