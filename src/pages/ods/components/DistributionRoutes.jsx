// File: src/pages/ods/components/DistributionRoutes.jsx
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, FormControl, InputLabel, Select, MenuItem, 
  TextField, Typography, Chip, CircularProgress, Box, Grid, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import NoteIcon from '@mui/icons-material/Note';
import Tooltip from '@mui/material/Tooltip';

const DistributionRoutes = ({ handleDialogOpen, onViewOrders }) => {
  const [dateRange, setDateRange] = useState({
    from: dayjs(),
    to: dayjs().add(30, 'day')
  });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await kdb.run({
        module: "OrderRouting",
        name: "getDistributionRoutesByDateRange",
        data: { 
          fromDate: dateRange.from.format('YYYY-MM-DD'),
          toDate: dateRange.to.format('YYYY-MM-DD'),
          status: selectedStatus || null
        }
      });
      
      setRoutes(response.routes || []);
    } catch (error) {
      console.error("שגיאה בטעינת מסלולי הפצה:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load statuses once on component mount
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const statusesData = await kdb.run({ 
          module: "OrderRouting", 
          name: "manageLinesInstanceStatusesGet", 
          data: {} 
        });
        setStatuses(statusesData.items || []);
      } catch (error) {
        console.error("שגיאה בטעינת סטטוסים:", error);
      }
    };
    
    fetchStatuses();
    // Fetch routes on initial load
    fetchRoutes();
  }, []);
  
  // Get status color
  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    // You can customize colors based on status IDs
    switch(parseInt(status, 10)) {
      case 1: return 'primary'; // Active/In Progress
      case 2: return 'success'; // Completed
      case 3: return 'error';   // Problem
      case 4: return 'warning'; // Delayed
      default: return 'default';
    }
  };
  
  const handleRefresh = () => {
    fetchRoutes();
  };
  
  const handleEditRoute = (routeId) => {
    handleDialogOpen('linesInstance');
  };
  
  const handleViewRouteOrders = (routeId) => {
    if (onViewOrders) {
      onViewOrders(routeId);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      {/* Filter controls */}
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12} md={3}>
          <DatePicker
            label="תאריך מ"
            value={dateRange.from}
            onChange={(date) => setDateRange({...dateRange, from: date})}
            className="w-full"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="תאריך עד"
            value={dateRange.to}
            onChange={(date) => setDateRange({...dateRange, to: date})}
            className="w-full"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>סטטוס</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="סטטוס"
            >
              <MenuItem value="">כל הסטטוסים</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.statusDesc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3} className="flex items-end">
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            className="ml-2"
          >
            רענן
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => handleDialogOpen('linesInstance')}
            className="mr-2"
          >
            הוסף מסלול חדש
          </Button>
        </Grid>
      </Grid>
      
      {/* Table of distribution routes */}
      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-10">
          <Typography variant="h6" color="textSecondary">
            אין מסלולי הפצה בטווח התאריכים שנבחר
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            className="mt-4"
            onClick={() => handleDialogOpen('linesInstance')}
          >
            הוסף מסלול חדש
          </Button>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-blue-600">
                <TableCell className="text-white font-bold">קו</TableCell>
                <TableCell className="text-white font-bold">תאריך</TableCell>
                <TableCell className="text-white font-bold">משאית</TableCell>
                <TableCell className="text-white font-bold">נהג</TableCell>
                <TableCell className="text-white font-bold">סטטוס</TableCell>
                <TableCell className="text-white font-bold">כמות הזמנות</TableCell>
                <TableCell className="text-white font-bold">הערות</TableCell>
                <TableCell className="text-white font-bold">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id} hover>
                  <TableCell>{route.lineDesc || `קו ${route.line}`}</TableCell>
                  <TableCell>{dayjs(route.date).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{route.vanDesc || route.van}</TableCell>
                  <TableCell>{route.driverDesc || route.driver}</TableCell>
                  <TableCell>
                    <Chip 
                      label={route.statusDesc || `סטטוס ${route.status}`}
                      color={getStatusColor(route.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{route.orderCount || 0}</TableCell>
                  <TableCell>
                    {route.notes ? (
                      <Tooltip title={route.notes}>
                        <IconButton size="small">
                          <NoteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : ""}
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Tooltip title="צפה בהזמנות">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewRouteOrders(route.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ערוך מסלול">
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleEditRoute(route.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default DistributionRoutes;