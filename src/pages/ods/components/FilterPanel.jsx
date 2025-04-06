// File: src/pages/ods/components/FilterPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  FormControl, InputLabel, Select, MenuItem, TextField, 
  Checkbox, ListItemText, OutlinedInput, CircularProgress,
  Box, Typography, Chip, List, ListItem, ListItemIcon,
  Paper, Divider, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TodayIcon from '@mui/icons-material/Today';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import dayjs from 'dayjs';
import kdb from '../../../kadabrix/kadabrix';

const FilterPanel = ({ filter, setFilter, odsStatuses, pickStatuses, pickers, lines, lineInstances }) => {
  const [openFilter, setOpenFilter] = useState(null);
  const [tempFilter, setTempFilter] = useState(filter);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citySearchText, setCitySearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    setDefaultFilters();
  }, []);

  useEffect(() => {
    setTempFilter(filter);
  }, [filter]);

  // Filter cities based on search text
  useEffect(() => {
    if (cities.length > 0) {
      const filtered = cities.filter(city => 
        city.desc.toLowerCase().includes(citySearchText.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [cities, citySearchText]);

  // Fetch cities when filter dialog is opened
  const fetchDistinctCities = useCallback(async () => {
    setLoadingCities(true);
    try {
      // Create a copy of the filter without the city parameter
      const filterForCities = { ...filter };
      delete filterForCities.city;
      
      const result = await kdb.run({
        module: "OrderRouting",
        name: "getDistinctCities",
        data: { filter: filterForCities }
      });
      
      setCities(result.cities || []);
      setFilteredCities(result.cities || []);
    } catch (error) {
      console.error("שגיאה בטעינת ערים:", error);
      setCities([]);
      setFilteredCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, [filter]);

  // Load cities immediately when the city filter is opened
  useEffect(() => {
    if (openFilter?.key === 'city') {
      fetchDistinctCities();
      setCitySearchText('');
    }
  }, [openFilter, fetchDistinctCities]);

  const setDefaultFilters = () => {
    setFilter({
      orderDateFrom: dayjs().subtract(30, 'day'), // ברירת מחדל: לפני 30 יום
      orderDateTo: dayjs(), // ברירת מחדל: היום
      odsStatus: [],
      pickStatus: [],
      pickDateFrom: null,
      pickDateTo: null,
      pickers: [],
      lines: [],
      lineInstance: [],
      odsInstance: null,
      city: [], // Changed to array for multi-select
      customerName: '',
      totalFrom: '',
      totalTo: '',
    });
  };

  const filtersConfig = [
    { key: 'odsStatus', label: 'סטטוס ODS', items: odsStatuses, multiple: true },
    { key: 'pickStatus', label: 'סטטוס ליקוט', items: pickStatuses, multiple: true },
    { key: 'pickers', label: 'מלקטים', items: pickers, multiple: true },
    { key: 'lines', label: 'קווים', items: lines, multiple: true },
    { key: 'lineInstance', label: 'מופע קו', items: lineInstances || [], multiple: true },
    { key: 'lineInstanceDate', label: 'תאריך מופע קו', type: 'date' },
    { key: 'city', label: 'עיר', items: cities, dynamicItems: true, multiple: true, searchable: true },
    { key: 'customerName', label: 'שם לקוח' },
    { key: 'totalFrom', label: 'סכום מינימלי', type: 'number' },
    { key: 'totalTo', label: 'סכום מקסימלי', type: 'number' },
    { key: 'pickDateFrom', label: 'תאריך ליקוט - מ', type: 'date' },
    { key: 'pickDateTo', label: 'תאריך ליקוט - עד', type: 'date' },
    { key: 'orderDateFrom', label: 'תאריך הזמנה - מ', type: 'date' },
    { key: 'orderDateTo', label: 'תאריך הזמנה - עד', type: 'date' },
  ];

  const clearFilters = () => {
    setDefaultFilters();
    setTempFilter({
      orderDateFrom: dayjs().subtract(30, 'day'),
      orderDateTo: dayjs(),
      odsInstance: null,
      city: [], // Changed to array for multi-select
    });
  };

  const applyFilters = () => {
    setFilter(tempFilter);
  };

  const handleToggleCity = (cityId) => {
    setTempFilter(prev => {
      const newCities = [...prev.city];
      const index = newCities.indexOf(cityId);
      
      if (index === -1) {
        newCities.push(cityId);
      } else {
        newCities.splice(index, 1);
      }
      
      return {
        ...prev,
        city: newCities
      };
    });
  };

  const handleSelectAllCities = () => {
    setTempFilter(prev => ({
      ...prev,
      city: filteredCities.map(city => city.id)
    }));
  };

  const handleClearAllCities = () => {
    setTempFilter(prev => ({
      ...prev,
      city: []
    }));
  };

  const isFilterActive = (key, value) => {
    if (key === 'odsInstance') {
      return value !== null && value !== undefined;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (key === 'orderDateFrom' || key === 'orderDateTo') {
      return value !== null && value !== undefined;
    }
    return value !== '' && value !== null && value !== undefined;
  };

  const renderPopupContent = (config) => {
    if (config.type === 'date') {
      return (
        <div dir="ltr" className="flex flex-col gap-2">
          <DatePicker
            label={config.label}
            value={tempFilter[config.key] || null}
            onChange={(date) => setTempFilter({ ...tempFilter, [config.key]: date })}
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
    } else if (config.key === 'city' && config.searchable) {
      // Special case for cities with checkboxes
      return (
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="חפש עיר"
            value={citySearchText}
            onChange={(e) => setCitySearchText(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: loadingCities && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
          
          <div className="flex justify-between my-2">
            <Button size="small" onClick={handleSelectAllCities}>
              בחר הכל ({filteredCities.length})
            </Button>
            <Button size="small" onClick={handleClearAllCities}>
              נקה הכל
            </Button>
          </div>
          
          <Divider className="my-2" />
          
          {loadingCities ? (
            <div className="flex justify-center items-center p-4">
              <CircularProgress size={24} />
              <span className="mr-2">טוען ערים...</span>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              לא נמצאו ערים
            </div>
          ) : (
            <div className="max-h-64 overflow-auto border rounded">
              <List dense>
                {filteredCities.map((city) => {
                  const isSelected = tempFilter.city.includes(city.id);
                  return (
                    <ListItem 
                      key={city.id} 
                      button 
                      onClick={() => handleToggleCity(city.id)}
                      dense
                    >
                      <ListItemIcon style={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={isSelected}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={city.desc} />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          )}
          
          {tempFilter.city.length > 0 && (
            <div className="mt-4">
              <Typography variant="subtitle2" gutterBottom>
                ערים שנבחרו ({tempFilter.city.length}):
              </Typography>
              <div className="flex flex-wrap gap-1">
                {tempFilter.city.map(cityId => {
                  const cityObj = cities.find(c => c.id === cityId);
                  return cityObj ? (
                    <Chip
                      key={cityId}
                      label={cityObj.desc}
                      onDelete={() => handleToggleCity(cityId)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </Box>
      );
    } else if (config.items) {
      if (config.multiple) {
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
              {config.items.length > 0 ? (
                config.items.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={(tempFilter[config.key] || []).includes(item.id)} />
                    <ListItemText primary={item.statusDesc || item.desc || item.id} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>אין פריטים זמינים</MenuItem>
              )}
            </Select>
          </FormControl>
        );
      } else {
        return (
          <FormControl fullWidth>
            <InputLabel>{config.label}</InputLabel>
            <Select
              value={tempFilter[config.key] || ''}
              onChange={(e) => setTempFilter({ ...tempFilter, [config.key]: e.target.value })}
              input={<OutlinedInput label={config.label} />}
            >
              <MenuItem value="">ללא בחירה</MenuItem>
              {config.items.length > 0 ? (
                config.items.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.statusDesc || item.desc || item.id}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>אין פריטים זמינים</MenuItem>
              )}
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
      </div>

      {openFilter && (
        <Dialog 
          open={true} 
          onClose={() => setOpenFilter(null)} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>{openFilter.label}</DialogTitle>
          <DialogContent>
            <div className="pt-2">
              {renderPopupContent(openFilter)}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFilter(null)}>ביטול</Button>
            <Button 
              onClick={() => { 
                setFilter(tempFilter); 
                setOpenFilter(null); 
                applyFilters(); 
              }} 
              color="primary"
            >
              אישור
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default FilterPanel;