import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  useTheme,
  Box,
  Divider
} from '@mui/material';
import { PiNotePencil, PiCheckCircle } from 'react-icons/pi';

// Line Item Remarks Dialog Component
const LineRemarksDialog = ({ open, onClose, itemName, currentRemarks, onSave }) => {
  const [remarks, setRemarks] = useState(currentRemarks || '');
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setRemarks(currentRemarks || '');
    }
  }, [open, currentRemarks]);

  const handleSave = () => {
    onSave(remarks);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '400px',
          direction: 'rtl' // RTL support
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: theme.palette.info.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <PiNotePencil size={20} />
        <span>הערות לפריט</span>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 3 }}>
        {itemName && (
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            פריט: {itemName}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <TextField
            label="הערות לפריט"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            rows={3}
            autoFocus
            placeholder="הוסף הערות מיוחדות לפריט זה..."
          />
        </Box>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            הערות אלו יופיעו בשורת ההזמנה של פריט זה בלבד.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          ביטול
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          color="info"
          sx={{ borderRadius: 2 }}
          startIcon={<PiCheckCircle />}
        >
          שמור הערות
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LineRemarksDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemName: PropTypes.string,
  currentRemarks: PropTypes.string,
  onSave: PropTypes.func.isRequired
};

export default LineRemarksDialog;