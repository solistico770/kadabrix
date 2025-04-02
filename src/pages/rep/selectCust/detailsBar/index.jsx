import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Button,
  Box,
} from '@mui/material';

import injectComponent from '../../../../kadabrix/injectComponent';

export default function openDialog(part,cust) {
  injectComponent(() => <DetailsDialog part={part}  cust={cust}/>);
}

function DetailsDialog({ part  , cust }) {
  const [open, setOpen] = useState(true);
  const [bars, setBars] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadBars = async () => {
      const modules = import.meta.glob('./bars/*.jsx');
      const loaded = [];

      for (const path in modules) {
        const mod = await modules[path]();
        if (mod.default?.label && mod.default?.barComponent) {
          loaded.push({
            label: mod.default.label,
            barComponent: mod.default.barComponent,
            priority: mod.default.priority ?? 1000, // ברירת מחדל אם לא הוגדר
          });
        }
      }

      // מיון לפי priority (מהנמוך לגבוה)
      loaded.sort((a, b) => a.priority - b.priority);

      setBars(loaded);
    };

    loadBars();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        {bars.map((bar, index) => (
          <Tab key={index} label={bar.label} />
        ))}
      </Tabs>

      <DialogContent dividers>
        {bars.length > 0 && (
          <Box p={2}>
            {React.createElement(bars[activeTab].barComponent, { part , cust } )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}
