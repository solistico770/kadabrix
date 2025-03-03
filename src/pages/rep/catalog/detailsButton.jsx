// Frontend component
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';

const ProductDetailsPopup = ({ part, open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventorySummary, setInventorySummary] = useState({});
  const [stockDetails, setStockDetails] = useState([]);
  const [priceDetails, setPriceDetails] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [lastPurchases, setLastPurchases] = useState([]);

  // Fetch inventory summary and stock details when the tab is active
  useEffect(() => {
    if (open && activeTab === 0) {
      const fetchInventorySummary = async () => {
        const summary = await kdb.run({
          module: "repCatalog",
          name: "getInventorySummary",
          data: { part },
        });
        setInventorySummary(summary);

        const stockData = await kdb.run({
          module: "repCatalog",
          name: "getInventory",
          data: { part },
        });
        setStockDetails(stockData.stockDetails);
      };
      fetchInventorySummary();
    }
  }, [open, activeTab, part]);

  // Fetch price details when the tab is active
  useEffect(() => {
    if (open && activeTab === 1) {
      const fetchPriceDetails = async () => {
        const data = await kdb.run({
          module: "repCatalog",
          name: "getPriceList",
          data: { part },
        });
        setPriceDetails(data.priceDetails);
      };
      fetchPriceDetails();
    }
  }, [open, activeTab, part]);

  // Fetch open orders when the tab is active
  useEffect(() => {
    if (open && activeTab === 2) {
      const fetchOpenOrders = async () => {
        const data = await kdb.run({
          module: "repCatalog",
          name: "getOpenOrders",
          data: { part },
        });
        setOpenOrders(data.openOrders);
      };
      fetchOpenOrders();
    }
  }, [open, activeTab, part]);

  // Fetch purchase orders when the tab is active
  useEffect(() => {
    if (open && activeTab === 3) {
      const fetchPurchaseOrders = async () => {
        const data = await kdb.run({
          module: "repCatalog",
          name: "getPurchaseOrders",
          data: { part },
        });
        setPurchaseOrders(data.purchaseOrders);
      };
      fetchPurchaseOrders();
    }
  }, [open, activeTab, part]);

  // Fetch last purchases when the tab is active
  useEffect(() => {
    if (open && activeTab === 4) {
      const fetchLastPurchases = async () => {
        const data = await kdb.run({
          module: "repCatalog",
          name: "getLastPurchases",
          data: { part },
        });
        setLastPurchases(data.lastPurchases);
      };
      fetchLastPurchases();
    }
  }, [open, activeTab, part]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>פרטי פריט: {part}</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="מלאי" />
          <Tab label="מחירים" />
          <Tab label="הזמנות פתוחות" />
          <Tab label="הזמנות רכש" />
          <Tab label="רכישות אחרונות" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <div>
              <Typography variant="h6" gutterBottom>
                סיכום מלאי
              </Typography>
              <Typography>מלאי כולל: {inventorySummary.inventoryBalance}</Typography>
              <Typography>סה״כ הזמנות: {inventorySummary.ordersBalance}</Typography>
              <Typography>סה״כ הזמנות רכש: {inventorySummary.purchaseOrdersBalance}</Typography>
              <Typography>מלאי זמין: {inventorySummary.availableStock}</Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                מלאי לפי מחסנים
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>מחסן</TableCell>
                      <TableCell align="right">יתרה</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockDetails.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.warhs}</TableCell>
                        <TableCell align="right">{row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <Typography variant="h6" gutterBottom>
                מחירים
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>רשימת מחיר</TableCell>
                      <TableCell align="right">מחיר</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceDetails.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.pldes}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <Typography variant="h6" gutterBottom>
                הזמנות פתוחות
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>תאריך</TableCell>
                      <TableCell>שם מסמך</TableCell>
                      <TableCell align="right">כמות</TableCell>
                      <TableCell align="right">יתרה</TableCell>
                      <TableCell>שם לקוח</TableCell>
                      <TableCell>תיאור לקוח</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {openOrders.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.orderDate}</TableCell>
                        <TableCell>{row.docName}</TableCell>
                        <TableCell align="right">{row.quant}</TableCell>
                        <TableCell align="right">{row.quantBalance}</TableCell>
                        <TableCell>{row.custName}</TableCell>
                        <TableCell>{row.custDes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <Typography variant="h6" gutterBottom>
                הזמנות רכש
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>תאריך</TableCell>
                      <TableCell>מסמך</TableCell>
                      <TableCell align="right">כמות</TableCell>
                      <TableCell align="right">יתרה</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrders.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.docName}</TableCell>
                        <TableCell align="right">{row.quant}</TableCell>
                        <TableCell align="right">{row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}

          {activeTab === 4 && (
            <div>
              <Typography variant="h6" gutterBottom>
                רכישות אחרונות
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>תאריך</TableCell>
                      <TableCell>מסמך</TableCell>
                      <TableCell align="right">כמות</TableCell>
                      <TableCell align="right">מחיר</TableCell>
                      <TableCell>לקוח</TableCell>
                      <TableCell>תיאור פריט</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lastPurchases.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.docName}</TableCell>
                        <TableCell align="right">{row.quant}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell>{row.cust}</TableCell>
                        <TableCell>{row.partDes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsPopup;
