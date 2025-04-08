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

// Order Remarks Dialog Component
const OrderRemarksDialog = ({ open, onClose, currentRemarks, onSave }) => {
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
          minWidth: '450px',
          direction: 'rtl' // RTL support
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: theme.palette.primary.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <PiNotePencil size={20} />
        <span>הערות להזמנה</span>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          הוסף הערות כלליות להזמנה
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <TextField
            label="הערות"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            rows={4}
            autoFocus
            placeholder="הוסף הערות חשובות להזמנה כאן..."
          />
        </Box>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            הערות אלו יופיעו בטופס ההזמנה ויועברו למחלקת המכירות.
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
          color="primary"
          sx={{ borderRadius: 2 }}
          startIcon={<PiCheckCircle />}
        >
          שמור הערות
        </Button>
      </DialogActions>
    </Dialog>
  );
};

OrderRemarksDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentRemarks: PropTypes.string,
  onSave: PropTypes.func.isRequired
};

export default OrderRemarksDialog;