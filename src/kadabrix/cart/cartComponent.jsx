import React, { useState, useEffect } from 'react';
import { PiShoppingCart } from 'react-icons/pi';
import PropTypes from 'prop-types';
import eventBus from '../event';
import { useCartStore } from '../cartState';
import { 
  Badge, 
  IconButton, 
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';

import CartDialog from './CartDialog';


// Main Cart Button Component
const Component = () => {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const handleOpenCart = () => {
      setOpen(true);
    };

    eventBus.on('openCart', handleOpenCart);

    return () => {

    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="סל קניות">
        <IconButton 
          onClick={handleClickOpen} 
          className="outline-none duration-300 relative"
          sx={{ 
            color: 'black',
            '&:hover': { 
              color: theme.palette.primary.main 
            },
            position: 'relative'
          }}
        >
          <Badge 
            badgeContent={cart?.items?.length || 0} 
            color="primary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: isMobile ? 10 : 12,
                minWidth: isMobile ? 16 : 20,
                height: isMobile ? 16 : 20,
                borderRadius: 10,
                fontWeight: 'bold'
              },
            }}
          >
            <PiShoppingCart 
              className="text-3xl sm:text-2xl"
            />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <CartDialog open={open} onClose={handleClose} />
    </>
  );
};

export default Component;