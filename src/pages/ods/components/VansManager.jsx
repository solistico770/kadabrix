// File: src/components/VansManager.jsx
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const VansManager = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ desc: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchItems = async () => {
        setLoading(true);
        try {
          const data = await kdb.run({ module: "OrderRouting", name: "manageVansGet", data: {} });
          setItems(data.items);
        } catch (error) {
          console.error("שגיאה בטעינת משאיות:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    }
  }, [open]);

  const handleOpenForm = (item = null) => {
    setFormData(item ? { ...item } : { desc: '' });
    setEditId(item ? item.id : null);
  };

  const handleSave = async () => {
    try {
      await kdb.run({
        module: "OrderRouting",
        name: editId ? "manageVansUpdate" : "manageVansCreate",
        data: { id: editId, ...formData },
      });
      const data = await kdb.run({ module: "OrderRouting", name: "manageVansGet", data: {} });
      setItems(data.items);
      setEditId(null);
    } catch (error) {
      console.error("שגיאה בשמירת משאית:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם למחוק את המשאית?')) {
      try {
        await kdb.run({ module: "OrderRouting", name: "manageVansDelete", data: { id } });
        const data = await kdb.run({ module: "OrderRouting", name: "manageVansGet", data: {} });
        setItems(data.items);
      } catch (error) {
        console.error("שגיאה במחיקת משאית:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ניהול משאיות</DialogTitle>
      <DialogContent>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()} className="mb-4">הוסף משאית</Button>
        {loading ? (
          <div>טוען...</div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-blue-600">
                  <TableCell className="text-white">מזהה</TableCell>
                  <TableCell className="text-white">תיאור</TableCell>
                  <TableCell className="text-white">פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.desc}</TableCell>
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
            <TextField
              label="תיאור"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              fullWidth
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

export default VansManager;