// File: src/components/BatchUpdateDialog.jsx
import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, FormControl, InputLabel, Select, MenuItem, TextField 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import kdb from '../../../kadabrix/kadabrix'; // התאם את הנתיב
import dayjs from 'dayjs';

const BatchUpdateDialog = ({ open, onClose, selectedOrders, odsStatuses, pickStatuses, pickers, linesInstances }) => {
  const [updates, setUpdates] = useState({
    odsStatus: '',
    pickStatus: '',
    picker: '',
    odsInstance: '',
    pickDate: null,
  });

  // סינון lineInstances כך שיוצגו רק מופעי קווים מהיום והלאה
  const today = dayjs();
  const filteredLinesInstances = linesInstances.filter(instance => {
    const instanceDate = dayjs(instance.date);
    return instanceDate.isSame(today, 'day') || instanceDate.isAfter(today, 'day');
  });

  const handleUpdate = async () => {
    const docIDs = selectedOrders
      .filter(order => order.docID !== null && order.docID !== undefined && order.docID !== "")
      .map(order => parseInt(order.docID, 10));
    console.log("docIDs being sent:", docIDs);

    if (docIDs.length === 0) {
      console.error("No valid docIDs to update");
      onClose(false);
      return;
    }

    try {
      await kdb.run({
        module: "OrderRouting",
        name: "batchUpdateOrders",
        data: { docIDs, updates }
      });
      onClose(true);
    } catch (error) {
      console.error("שגיאה בעדכון גורף:", error);
      onClose(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth dir="rtl">
      <DialogTitle>עדכון גורף</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-1 gap-4 mt-2">
          <FormControl fullWidth>
            <InputLabel>סטטוס ODS</InputLabel>
            <Select
              value={updates.odsStatus}
              onChange={(e) => setUpdates({ ...updates, odsStatus: e.target.value })}
            >
              <MenuItem value="">ללא שינוי</MenuItem>
              {odsStatuses.map(status => (
                <MenuItem key={status.id} value={status.id}>{status.statusDesc}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>סטטוס ליקוט</InputLabel>
            <Select
              value={updates.pickStatus}
              onChange={(e) => setUpdates({ ...updates, pickStatus: e.target.value })}
            >
              <MenuItem value="">ללא שינוי</MenuItem>
              {pickStatuses.map(status => (
                <MenuItem key={status.id} value={status.id}>{status.statusDesc}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>מלקט</InputLabel>
            <Select
              value={updates.picker}
              onChange={(e) => setUpdates({ ...updates, picker: e.target.value })}
            >
              <MenuItem value="">ללא שינוי</MenuItem>
              {pickers.map(picker => (
                <MenuItem key={picker.id} value={picker.id}>{picker.desc}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>מופע קו</InputLabel>
            <Select
              value={updates.odsInstance}
              onChange={(e) => setUpdates({ ...updates, odsInstance: e.target.value })}
            >
              <MenuItem value="">ללא שינוי</MenuItem>
              {filteredLinesInstances.map(instance => (
                <MenuItem key={instance.id} value={instance.id}>
                  {instance.desc || `${instance.line} - ${instance.van} - ${instance.driver} (${instance.date})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="תאריך ליקוט"
            value={updates.pickDate}
            onChange={(date) => setUpdates({ ...updates, pickDate: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>ביטול</Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">אישור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchUpdateDialog;