import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCartStore } from '../cartState';
import { updateQuantity } from '../cartCommands';
import { 
  ButtonGroup, 
  IconButton, 
  TextField, 
  CircularProgress,
  Box,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  PiPlus, 
  PiMinus, 
  PiCheck
} from 'react-icons/pi';

// Cart Quantity Button Component
const CartQuantBtn = ({ item }) => {
  const theme = useTheme();
  const cart = useCartStore((state) => state.cart);
  
  const [isLoading, setIsLoading] = useState(false);
  const [tempQuant, setTempQuant] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (item) {
      setTempQuant(item.quant.toString());
    }
    setIsLoading(false);
  }, [item, cart]);

  const incrementQuantity = async () => {
    setIsLoading(true);
    try {
      await updateQuantity(item.index, "+");
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const decrementQuantity = async () => {
    if (item.quant > 1) {
      setIsLoading(true);
      try {
        await updateQuantity(item.index, "-");
      } catch (error) {
        console.error("Error decrementing quantity:", error);
      }
    }
  };

  const changeQuantity = async () => {
    if (tempQuant !== item.quant.toString()) {
      setIsLoading(true);
      try {
        const newQuant = parseInt(tempQuant) || 1;
        await updateQuantity(item.index, "set", newQuant);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
      setShowConfirm(false);
    }
  };

  const handleQuantChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (value === '' || parseInt(value) === 0) {
      setTempQuant('1');
    } else if (value.length <= 3) {
      setTempQuant(value);
    }
    setShowConfirm(true);
  };

  return (
    <Box position="relative" display="flex" alignItems="center">
      {isLoading && (
        <CircularProgress
          size={32}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-16px',
            marginLeft: '-16px',
            zIndex: 1
          }}
        />
      )}
      
      <ButtonGroup 
        variant="outlined" 
        size="small"
        sx={{ 
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: 1,
          overflow: 'hidden',
          '& .MuiButtonGroup-grouped': {
            borderColor: theme.palette.grey[300]
          }
        }}
      >
        <Tooltip title="הוסף יחידה">
          <IconButton
            onClick={incrementQuantity}
            disabled={isLoading}
            sx={{ 
              borderRadius: 0,
              color: theme.palette.primary.main
            }}
          >
            <PiPlus />
          </IconButton>
        </Tooltip>
        
        <TextField
          value={tempQuant}
          onChange={handleQuantChange}
          disabled={isLoading}
          variant="outlined"
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
            style: { 
              textAlign: 'center',
              padding: '4px',
              width: '36px'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none'
              },
              '&:hover fieldset': {
                border: 'none'
              },
              '&.Mui-focused fieldset': {
                border: 'none'
              }
            },
            '& .MuiInputBase-input': {
              textAlign: 'center'
            }
          }}
        />
        
        {showConfirm ? (
          <Tooltip title="אשר שינוי">
            <IconButton
              onClick={changeQuantity}
              disabled={isLoading}
              sx={{ 
                borderRadius: 0,
                color: theme.palette.success.main
              }}
            >
              <PiCheck />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="הפחת יחידה">
            <IconButton
              onClick={decrementQuantity}
              disabled={isLoading || item.quant <= 1}
              sx={{ 
                borderRadius: 0,
                color: item.quant <= 1 ? theme.palette.grey[400] : theme.palette.error.main
              }}
            >
              <PiMinus />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </Box>
  );
};

CartQuantBtn.propTypes = {
  item: PropTypes.object.isRequired
};

export default CartQuantBtn;