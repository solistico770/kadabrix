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
  const [stockDetails, setStockDetails] = useState([]);
  const [priceDetails, setPriceDetails] = useState([]);

  // Fetch stock details when the tab is active
  useEffect(() => {
    if (open && activeTab === 0) {
      const fetchStockDetails = async () => {
        const data = await kdb.run({
          module: "repCatalog",
          name: "getInventory",
          data: { part },
        });
        setStockDetails(data.stockDetails);
      };
      fetchStockDetails();
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Product Details: Part {part}</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="מלאי (Stock)" />
          <Tab label="מחירים (Prices)" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <div>
              <Typography variant="h6" gutterBottom>
                מלאי (Stock)
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Balance</TableCell>
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
                מחירים (Prices)
              </Typography>
              <Paper elevation={3} sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Price List</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Price</TableCell>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsPopup;