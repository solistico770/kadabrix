import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  useTheme
} from '@mui/material';

// Price Edit Dialog Component
const PriceEditDialog = ({ open, onClose, originalPrice, onSave }) => {
  const [newPrice, setNewPrice] = useState(originalPrice);
  const [discount, setDiscount] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    // Reset values when dialog opens
    if (open) {
      setNewPrice(originalPrice);
      setDiscount(0);
    }
  }, [open, originalPrice]);

  const handlePriceChange = (value) => {
    const price = parseFloat(value) || 0;
    setNewPrice(price);
    if (price === 0) {
      setDiscount(100);
    } else {
      const calculatedDiscount = ((originalPrice - price) / originalPrice) * 100;
      setDiscount(Math.round(calculatedDiscount * 100) / 100);
    }
  };

  const handleDiscountChange = (value) => {
    const discountValue = parseFloat(value) || 0;
    setDiscount(discountValue);
    const calculatedPrice = originalPrice * (1 - discountValue / 100);
    setNewPrice(Math.round(calculatedPrice * 100) / 100);
  };

  const handleSave = () => {
    onSave(newPrice);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          direction: 'rtl' // RTL support
        }
      }}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
        עדכון מחיר
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="מחיר מקורי"
              value={originalPrice}
              disabled
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₪</Typography>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="מחיר חדש"
              type="number"
              value={newPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₪</Typography>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="הנחה (%)"
              type="number"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                inputProps: { 
                  min: 0,
                  max: 100
                }
              }}
            />
          </Grid>
        </Grid>
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
          sx={{ borderRadius: 2 }}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PriceEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  originalPrice: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired
};

export default PriceEditDialog;