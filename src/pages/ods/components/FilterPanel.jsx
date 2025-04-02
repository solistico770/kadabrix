// File: src/components/FilterPanel.jsx
import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TodayIcon from '@mui/icons-material/Today';
import dayjs from 'dayjs';

const FilterPanel = ({ filter, setFilter, handleFilter, odsStatuses, pickStatuses, pickers, lines, lineInstances }) => {
  const [openFilter, setOpenFilter] = useState(null);
  const [tempFilter, setTempFilter] = useState(filter);

  const filtersConfig = [
    { key: 'odsStatus', label: 'סטטוס ODS', items: odsStatuses, multiple: true },
    { key: 'pickStatus', label: 'סטטוס ליקוט', items: pickStatuses, multiple: true },
    { key: 'pickers', label: 'מלקטים', items: pickers, multiple: true },
    { key: 'lines', label: 'קווים', items: lines, multiple: true },
    { key: 'lineInstance', label: 'מופע קו', items: lineInstances, multiple: false }, // בחירה בודדת
    { key: 'lineInstanceDate', label: 'תאריך מופע קו', type: 'date' },
    { key: 'city', label: 'עיר' },
    { key: 'customerName', label: 'שם לקוח' },
    { key: 'totalFrom', label: 'סכום מינימלי', type: 'number' },
    { key: 'totalTo', label: 'סכום מקסימלי', type: 'number' },
    { key: 'pickDateFrom', label: 'תאריך ליקוט - מ', type: 'date' },
    { key: 'pickDateTo', label: 'תאריך ליקוט - עד', type: 'date' },
    { key: 'orderDateFrom', label: 'תאריך הזמנה - מ', type: 'date' },
    { key: 'orderDateTo', label: 'תאריך הזמנה - עד', type: 'date' },
  ];

  const clearFilters = () => {
    setFilter({
      orderDateFrom: dayjs().subtract(30, 'day'), // ברירת מחדל: לפני 30 יום
      orderDateTo: dayjs(), // ברירת מחדל: היום
    });
    setTempFilter({
      orderDateFrom: dayjs().subtract(30, 'day'),
      orderDateTo: dayjs(),
    });
    handleFilter(); // רענון הטבלה לאחר ניקוי
  };

  const applyFilters = () => {
    setFilter(tempFilter);
    handleFilter(); // רענון הטבלה לאחר אישור
  };

  const isFilterActive = (key, value) => {
    if (Array.isArray(value)) {
      return value.length > 0; // מערכים (כמו odsStatus) נחשבים פעילים אם יש לפחות ערך אחד
    }
    if (key === 'lineInstance') {
      return value !== '' && value !== null && value !== undefined; // עבור lineInstance (בחירה בודדת)
    }
    if (key === 'orderDateFrom' || key === 'orderDateTo') {
      return value !== null && value !== undefined; // תאריכים תמיד פעילים כי יש להם ברירת מחדל
    }
    return value !== '' && value !== null && value !== undefined; // שדות טקסט/מספר
  };

  const renderPopupContent = (config) => {
    if (config.type === 'date') {
      return (
        <div dir="ltr" className="flex flex-col gap-2">
          <DatePicker
            label={config.label}
            value={tempFilter[config.key] || null}
            onChange={(date) => setTempFilter({ ...tempFilter, [config.key]: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={() => setTempFilter({ ...tempFilter, [config.key]: dayjs() })}
            >
              היום
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                const currentDate = tempFilter[config.key] || dayjs();
                setTempFilter({ ...tempFilter, [config.key]: dayjs(currentDate).add(1, 'day') });
              }}
            >
              +1
            </Button>
            <Button
              variant="outlined"
              startIcon={<RemoveIcon />}
              onClick={() => {
                const currentDate = tempFilter[config.key] || dayjs();
                setTempFilter({ ...tempFilter, [config.key]: dayjs(currentDate).subtract(1, 'day') });
              }}
            >
              -1
            </Button>
          </div>
        </div>
      );
    } else if (config.items) {
      if (config.multiple) {
        // בחירה מרובה (למשל odsStatus, pickers)
        return (
          <FormControl fullWidth>
            <InputLabel>{config.label}</InputLabel>
            <Select
              multiple
              value={tempFilter[config.key] || []}
              onChange={(e) => setTempFilter({ ...tempFilter, [config.key]: e.target.value })}
              input={<OutlinedInput label={config.label} />}
              renderValue={(selected) => selected.map(id => {
                const item = config.items.find(item => item.id === id);
                return item ? (item.desc || item.statusDesc || item.id) : id;
              }).join(', ')}
            >
              {config.items.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  <Checkbox checked={(tempFilter[config.key] || []).includes(item.id)} />
                  <ListItemText primary={item.statusDesc || item.desc || item.id} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      } else {
        // בחירה בודדת (למשל lineInstance)
        return (
          <FormControl fullWidth>
            <InputLabel>{config.label}</InputLabel>
            <Select
              value={tempFilter[config.key] || ''}
              onChange={(e) => setTempFilter({ ...tempFilter, [config.key]: e.target.value })}
              input={<OutlinedInput label={config.label} />}
            >
              <MenuItem value="">ללא בחירה</MenuItem>
              {config.items.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.desc || `${item.line} - ${item.van} - ${item.driver} (${item.date})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    } else {
      return (
        <TextField
          label={config.label}
          type={config.type || 'text'}
          value={tempFilter[config.key] || ''}
          onChange={(e) => setTempFilter({ ...tempFilter, [config.key]: e.target.value })}
          fullWidth
        />
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold">פילטרים</h2>
      <div className="flex flex-wrap gap-2 mt-4">
        {filtersConfig.map(config => (
          <Button
            key={config.key}
            variant="contained"
            color={isFilterActive(config.key, filter[config.key]) ? 'success' : 'inherit'}
            onClick={() => { setOpenFilter(config); setTempFilter(filter); }}
          >
            {config.label}
          </Button>
        ))}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ClearIcon />}
          onClick={clearFilters}
        >
          נקה פילטרים
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={applyFilters}
        >
          אישור
        </Button>
      </div>

      {openFilter && (
        <Dialog open={true} onClose={() => setOpenFilter(null)}>
          <DialogTitle>{openFilter.label}</DialogTitle>
          <DialogContent>{renderPopupContent(openFilter)}</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFilter(null)}>ביטול</Button>
            <Button onClick={() => { setFilter(tempFilter); setOpenFilter(null); applyFilters(); }} color="primary">אישור</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default FilterPanel;