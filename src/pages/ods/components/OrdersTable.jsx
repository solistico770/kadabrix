// File: src/components/OrdersTable.jsx
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Checkbox, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BatchUpdateDialog from './BatchUpdateDialog';
import Pagination from '@mui/material/Pagination';

const OrdersTable = ({ 
  orders, loading, page, setPage, rowsPerPage, setRowsPerPage, totalRows, refresh, 
  odsStatuses, pickStatuses, pickers, linesInstances 
}) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrders(prev => {
      const isSelected = prev.some(o => o.docID === order.docID);
      if (isSelected) {
        return prev.filter(o => o.docID !== order.docID);
      } else {
        return [...prev, order];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedOrders(orders);
  };

  const handleClearAll = () => {
    setSelectedOrders([]);
  };

  const handleDialogClose = (success) => {
    setDialogOpen(false);
  };

  return (
    <>
      {loading ? (
        <div className="text-center text-gray-600">טוען הזמנות...</div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div>
              <Button variant="outlined" onClick={handleSelectAll} className="mr-2">
                בחר הכל
              </Button>
              <Button variant="outlined" onClick={handleClearAll} className="mr-2">
                נקה הכל
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setDialogOpen(true)} 
                disabled={selectedOrders.length === 0}
              >
                עדכון גורף ({selectedOrders.length})
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span>{`${orders.length} מתוך ${totalRows} | נבחרו ${selectedOrders.length}`}</span>
              <FormControl size="small">
                <InputLabel>רשומות לדף</InputLabel>
                <Select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  label="רשומות לדף"
                >
                  {[10, 20, 50, 100, 500].map(count => (
                    <MenuItem key={count} value={count}>{count}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Pagination
                count={Math.ceil(totalRows / rowsPerPage)}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                dir="ltr"
              />
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refresh}
                color="primary"
              >
                רענן
              </Button>
            </div>
          </div>
          <TableContainer component={Paper} className="shadow-lg">
            <Table>
              <TableHead>
                <TableRow className="bg-blue-600">
                  <TableCell className="text-white"></TableCell>
                  <TableCell className="text-white">מס’ הזמנה</TableCell>
                  <TableCell className="text-white">סטטוס ODS</TableCell>
                  <TableCell className="text-white">סטטוס ליקוט</TableCell>
                  <TableCell className="text-white">מלקט</TableCell>
                  <TableCell className="text-white">קו</TableCell>
                  <TableCell className="text-white">תאריך הפצה</TableCell>
                  <TableCell className="text-white">משאית</TableCell>
                  <TableCell className="text-white">נהג</TableCell>
                  <TableCell className="text-white">תאריך ליקוט</TableCell>
                  <TableCell className="text-white">שם מסמך</TableCell>
                  <TableCell className="text-white">סה"כ</TableCell>
                  <TableCell className="text-white">לקוח</TableCell>
                  <TableCell className="text-white">כתובת</TableCell>
                  <TableCell className="text-white">עיר</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.docID}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.some(o => o.docID === order.docID)}
                        onChange={() => handleSelectOrder(order)}
                      />
                    </TableCell>
                    <TableCell>{order.docID}</TableCell>
                    <TableCell>{order.odsStatusDesc}</TableCell>
                    <TableCell>{order.pickStatusDesc}</TableCell>
                    <TableCell>{order.pickerDesc}</TableCell>
                    <TableCell>{order.lineDesc}</TableCell>
                    <TableCell>{order.lineInstanceDate}</TableCell>
                    <TableCell>{order.vanDesc}</TableCell>
                    <TableCell>{order.driverDesc}</TableCell>
                    <TableCell>{order.pickDate}</TableCell>
                    <TableCell>{order.docName}</TableCell>
                    <TableCell>{order.grandTotal}</TableCell>
                    <TableCell>{order.customerDesc}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.city}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <BatchUpdateDialog 
            open={dialogOpen} 
            onClose={handleDialogClose} 
            selectedOrders={selectedOrders}
            odsStatuses={odsStatuses}
            pickStatuses={pickStatuses}
            pickers={pickers}
            linesInstances={linesInstances}
          />
        </>
      )}
    </>
  );
};

export default OrdersTable;
