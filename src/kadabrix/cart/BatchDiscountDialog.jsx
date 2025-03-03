import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCartStore } from '../cartState';
import { discountSetItem } from '../cartCommands';
import eventBus from '../event';
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
  List,
  ListItem,
  ListItemText,
  Slider,
  Divider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { PiPercent, PiCheckCircle } from 'react-icons/pi';

// Batch Discount Dialog Component
const BatchDiscountDialog = ({ open, onClose, selectedItems, showSnackbar }) => {
  const [discount, setDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const theme = useTheme();
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    if (open) {
      setDiscount(0);
      setIsApplying(false);
    }
  }, [open]);

  const handleSliderChange = (event, newValue) => {
    setDiscount(newValue);
  };

  const handleInputChange = (event) => {
    const value = parseFloat(event.target.value);
    setDiscount(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
  };

  const handleSave = async () => {
    try {
      setIsApplying(true);
      
      // Apply discount to all selected items
      for (const itemIndex of selectedItems) {
        await discountSetItem(itemIndex, discount);
      }
      
      setIsApplying(false);
      eventBus.emit("toast", { 
        type: 'success', 
        title: "הצלחה", 
        text: `ההנחה עודכנה בהצלחה ל-${selectedItems.length} פריטים` 
      });
      onClose();
    } catch (error) {
      setIsApplying(false);
      eventBus.emit("toast", { type: 'error', title: "שגיאה", text: "שגיאה בעדכון ההנחה" });
    }
  };

  // Get total value before and after discount
  const calculateTotals = () => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;
    
    selectedItems.forEach(itemIndex => {
      const item = cart.items.find(i => i.index === itemIndex);
      if (item) {
        totalBeforeDiscount += item.price * item.quant;
        totalAfterDiscount += (item.price * (1 - discount/100)) * item.quant;
      }
    });
    
    return {
      before: totalBeforeDiscount,
      after: totalAfterDiscount,
      saved: totalBeforeDiscount - totalAfterDiscount
    };
  };

  const totals = calculateTotals();
  
  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isApplying ? onClose : undefined}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '400px',
          maxWidth: '550px',
          direction: 'rtl' // RTL support
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: theme.palette.secondary.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <PiPercent size={20} />
        <span>הנחה מרוכזת</span>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          עדכון הנחה ל-{selectedItems.length} פריטים
        </Typography>
        
        {selectedItems.length > 0 && (
          <Box sx={{ mb: 3, mt: 2 }}>
            <Divider sx={{ mb: 2 }}>
              <Chip label="פריטים נבחרים" size="small" />
            </Divider>
            <List dense sx={{ 
              maxHeight: '150px', 
              overflowY: 'auto', 
              bgcolor: theme.palette.grey[50],
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`
            }}>
              {selectedItems.map(itemIndex => {
                const item = cart.items.find(i => i.index === itemIndex);
                return item ? (
                  <ListItem key={itemIndex} dense>
                    <ListItemText 
                      primary={item.partName} 
                      secondary={`מחיר: ${currencyFormat(item.price)} x ${item.quant}`} 
                    />
                  </ListItem>
                ) : null;
              })}
            </List>
          </Box>
        )}

        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography id="batch-discount-slider" gutterBottom>
            שיעור ההנחה: {discount}%
          </Typography>
          <Slider
            value={discount}
            onChange={handleSliderChange}
            aria-labelledby="batch-discount-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
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
        
        {discount > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              סיכום שינויים:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">סה"כ לפני הנחה:</Typography>
              <Typography variant="body2" fontWeight="bold">{currencyFormat(totals.before)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">סה"כ אחרי הנחה:</Typography>
              <Typography variant="body2" fontWeight="bold" color="success.main">
                {currencyFormat(totals.after)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">חיסכון:</Typography>
              <Typography variant="body2" fontWeight="bold" color="secondary.main">
                {currencyFormat(totals.saved)}
              </Typography>
            </Box>
          </Box>
        )}
        
        {selectedItems.length > 10 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            הערה: עדכון הנחה לריבוי פריטים עשוי לקחת מספר שניות.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
          disabled={isApplying}
        >
          ביטול
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 2 }}
          disabled={isApplying}
          startIcon={isApplying ? <CircularProgress size={20} color="inherit" /> : <PiCheckCircle />}
        >
          {isApplying ? 'מעדכן...' : 'החל הנחה'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BatchDiscountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  showSnackbar: PropTypes.func.isRequired
};

export default BatchDiscountDialog;