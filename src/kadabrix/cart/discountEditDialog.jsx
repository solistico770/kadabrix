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
  Slider,
  Box
} from '@mui/material';

// Discount Edit Dialog Component
const DiscountEditDialog = ({ open, onClose, originalDiscount, itemName, onSave }) => {
  const [discount, setDiscount] = useState(originalDiscount);
  const theme = useTheme();

  useEffect(() => {
    // Reset values when dialog opens
    if (open) {
      setDiscount(originalDiscount);
    }
  }, [open, originalDiscount]);

  const handleSliderChange = (event, newValue) => {
    setDiscount(newValue);
  };

  const handleInputChange = (event) => {
    const value = parseFloat(event.target.value);
    setDiscount(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  const handleSave = () => {
    onSave(discount);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          direction: 'rtl', // RTL support
          minWidth: '350px'
        }
      }}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.secondary.main, color: 'white' }}>
        עדכון הנחה
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 3 }}>
        {itemName && (
          <Typography variant="subtitle1" gutterBottom>
            פריט: {itemName}
          </Typography>
        )}
        
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography id="discount-slider" gutterBottom>
            הנחה: {discount}%
          </Typography>
          <Slider
            value={discount}
            onChange={handleSliderChange}
            aria-labelledby="discount-slider"
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={100}
            marks={[
              { value: 0, label: '0%' },
              { value: 25, label: '25%' },
              { value: 50, label: '50%' },
              { value: 75, label: '75%' },
              { value: 100, label: '100%' }
            ]}
            sx={{ 
              color: theme.palette.secondary.main,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16
              }
            }}
          />
        </Box>
        
        <TextField
          label="הנחה באחוזים"
          type="number"
          value={discount}
          onChange={handleInputChange}
          fullWidth
          autoFocus
          margin="normal"
          InputProps={{
            endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
            inputProps: { 
              min: 0,
              max: 100,
              step: 1
            }
          }}
        />
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
          color="secondary"
          sx={{ borderRadius: 2 }}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DiscountEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  originalDiscount: PropTypes.number.isRequired,
  itemName: PropTypes.string,
  onSave: PropTypes.func.isRequired
};

export default DiscountEditDialog;