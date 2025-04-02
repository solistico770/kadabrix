// File: src/index.jsx
import React, { useState, useEffect ,useRef} from 'react';
import kdb from '../../kadabrix/kadabrix';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import 'dayjs/locale/he';

const Index = () => {
  const currentRequestRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100); // שינוי ל-state
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
  });
  const [odsStatuses, setOdsStatuses] = useState([]);
  const [pickStatuses, setPickStatuses] = useState([]);
  const [pickers, setPickers] = useState([]);
  const [lines, setLines] = useState([]);
  const [linesInstances, setLinesInstances] = useState([]);


  
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
      console.error("שגיאה בטעינת נתונים ראשוניים:", error);
    } finally {
      if (currentRequestRef.current === requestId) {
        setLoading(false);
      }
    }


  }

  const fetchInitialData = async () => {
  setLoading(true);
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


  } catch (error) {
    console.error("שגיאה בטעינת נתונים ראשוניים:", error);
  } finally {
    if (currentRequestRef.current === requestId) {
      setLoading(false);
    }
  }
};


useEffect(() => {
  refresh();
}, [filter,page, rowsPerPage]);



  useEffect(() => {
    refresh();
  }, [filter,page, rowsPerPage]);

  

  const handleDialogOpen = (dialog) => setDialogOpen(dialog);
  const handleDialogClose = () => setDialogOpen(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">מסך עבודה לניתוב הזמנות</h1>

        <LookupButtons handleDialogOpen={handleDialogOpen} />
        <FilterPanel 
          filterOpen={filterOpen} 
          setFilterOpen={setFilterOpen} 
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
          setRowsPerPage={setRowsPerPage} // הוספת setRowsPerPage
          totalRows={totalRows} 
          odsStatuses={odsStatuses}
          pickStatuses={pickStatuses}
          pickers={pickers}
          linesInstances={linesInstances}
        />
  
        <OdsStatusManager open={dialogOpen === 'odsStatus'} onClose={handleDialogClose} />
        <PickStatusManager open={dialogOpen === 'pickStatus'} onClose={handleDialogClose} />
        <PickersManager open={dialogOpen === 'pickers'} onClose={handleDialogClose} />
        <LinesManager open={dialogOpen === 'lines'} onClose={handleDialogClose} />
        <VansManager open={dialogOpen === 'vans'} onClose={handleDialogClose} />
        <DriversManager open={dialogOpen === 'drivers'} onClose={handleDialogClose} />
        <LinesInstanceManager open={dialogOpen === 'linesInstance'} onClose={handleDialogClose} />
      </div>
    </LocalizationProvider>
  );
};

export default Index;