// File: src/components/LinesInstanceManager.jsx
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const LinesInstanceManager = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ line: '', van: '', driver: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [lines, setLines] = useState([]);
  const [vans, setVans] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const itemsData = await kdb.run({ module: "OrderRouting", name: "manageLinesInstancesGet", data: {} });
          setItems(itemsData.items);
          const linesData = await kdb.run({ module: "OrderRouting", name: "manageLinesGet", data: {} });
          setLines(linesData.items);
          const vansData = await kdb.run({ module: "OrderRouting", name: "manageVansGet", data: {} });
          setVans(vansData.items);
          const driversData = await kdb.run({ module: "OrderRouting", name: "manageDriversGet", data: {} });
          setDrivers(driversData.items);
        } catch (error) {
          console.error("שגיאה בטעינת מופעי קווים:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open]);

  const handleOpenForm = (item = null) => {
    setFormData(item ? { ...item } : { line: '', van: '', driver: '', date: '' });
    setEditId(item ? item.id : null);
  };

  const handleSave = async () => {
    try {
      await kdb.run({
        module: "OrderRouting",
        name: editId ? "manageLinesInstancesUpdate" : "manageLinesInstancesCreate",
        data: { id: editId, ...formData },
      });
      const data = await kdb.run({ module: "OrderRouting", name: "manageLinesInstancesGet", data: {} });
      setItems(data.items);
      setEditId(null);
    } catch (error) {
      console.error("שגיאה בשמירת מופע קו:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם למחוק את מופע הקו?')) {
      try {
        await kdb.run({ module: "OrderRouting", name: "manageLinesInstancesDelete", data: { id } });
        const data = await kdb.run({ module: "OrderRouting", name: "manageLinesInstancesGet", data: {} });
        setItems(data.items);
      } catch (error) {
        console.error("שגיאה במחיקת מופע קו:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ניהול מופעי קווים</DialogTitle>
      <DialogContent>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()} className="mb-4">הוסף מופע קו</Button>
        {loading ? (
          <div>טוען...</div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-blue-600">
                  <TableCell className="text-white">מזהה</TableCell>
                  <TableCell className="text-white">קו</TableCell>
                  <TableCell className="text-white">משאית</TableCell>
                  <TableCell className="text-white">נהג</TableCell>
                  <TableCell className="text-white">תאריך</TableCell>
                  <TableCell className="text-white">פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{lines.find(l => l.id === item.line)?.desc || item.line}</TableCell>
                    <TableCell>{vans.find(v => v.id === item.van)?.desc || item.van}</TableCell>
                    <TableCell>{drivers.find(d => d.id === item.driver)?.desc || item.driver}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenForm(item)}>ערוך</Button>
                      <Button onClick={() => handleDelete(item.id)}>מחק</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {editId !== null || !editId ? (
          <div className="mt-4">
            <Select
              value={formData.line}
              onChange={(e) => setFormData({ ...formData, line: e.target.value })}
              fullWidth
              displayEmpty
              className="mb-2"
            >
              <MenuItem value="">בחר קו</MenuItem>
              {lines.map((line) => (
                <MenuItem key={line.id} value={line.id}>{line.desc}</MenuItem>
              ))}
            </Select>
            <Select
              value={formData.van}
              onChange={(e) => setFormData({ ...formData, van: e.target.value })}
              fullWidth
              displayEmpty
              className="mb-2"
            >
              <MenuItem value="">בחר משאית</MenuItem>
              {vans.map((van) => (
                <MenuItem key={van.id} value={van.id}>{van.desc}</MenuItem>
              ))}
            </Select>
            <Select
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              fullWidth
              displayEmpty
              className="mb-2"
            >
              <MenuItem value="">בחר נהג</MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>{driver.desc}</MenuItem>
              ))}
            </Select>
            <TextField
              label="תאריך"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              className="mb-2"
            />
            <Button onClick={handleSave} color="primary" className="mt-2">שמור</Button>
          </div>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>סגור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinesInstanceManager;