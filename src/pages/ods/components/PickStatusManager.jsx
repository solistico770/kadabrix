// File: src/pages/ods/components/PickStatusManager.jsx
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const PickStatusManager = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ statusDesc: '', allowPick: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchItems = async () => {
        setLoading(true);
        try {
          const data = await kdb.run({ module: "OrderRouting", name: "managePickStatusesGet", data: {} });
          setItems(data.items);
        } catch (error) {
          console.error("שגיאה בטעינת סטטוסי ליקוט:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchItems();
    }
  }, [open]);

  const handleOpenForm = (item = null) => {
    setFormData(item ? { ...item } : { statusDesc: '', allowPick: false });
    setEditId(item ? item.id : null);
  };

  const handleSave = async () => {
    try {
      await kdb.run({
        module: "OrderRouting",
        name: editId ? "managePickStatusesUpdate" : "managePickStatusesCreate",
        data: { id: editId, ...formData },
      });
      const data = await kdb.run({ module: "OrderRouting", name: "managePickStatusesGet", data: {} });
      setItems(data.items);
      setEditId(null);
    } catch (error) {
      console.error("שגיאה בשמירת סטטוס ליקוט:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם למחוק את סטטוס הליקוט?')) {
      try {
        await kdb.run({ module: "OrderRouting", name: "managePickStatusesDelete", data: { id } });
        const data = await kdb.run({ module: "OrderRouting", name: "managePickStatusesGet", data: {} });
        setItems(data.items);
      } catch (error) {
        console.error("שגיאה במחיקת סטטוס ליקוט:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ניהול סטטוס ליקוט</DialogTitle>
      <DialogContent>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()} className="mb-4">הוסף סטטוס</Button>
        {loading ? (
          <div>טוען...</div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-blue-600">
                  <TableCell className="text-white">מזהה</TableCell>
                  <TableCell className="text-white">תיאור</TableCell>
                  <TableCell className="text-white">מאפשר ליקוט</TableCell>
                  <TableCell className="text-white">פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.statusDesc}</TableCell>
                    <TableCell>{item.allowPick ? 'כן' : 'לא'}</TableCell>
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
              value={formData.statusDesc}
              onChange={(e) => setFormData({ ...formData, statusDesc: e.target.value })}
              fullWidth
              className="mb-2"
            />
            <div className="flex items-center mb-2">
              <Checkbox
                checked={formData.allowPick}
                onChange={(e) => setFormData({ ...formData, allowPick: e.target.checked })}
              /> 
              <span>מאפשר ליקוט</span>
            </div>
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

export default PickStatusManager;