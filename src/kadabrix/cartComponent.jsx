import eventBus from "./event";
import { PiShoppingCart } from "react-icons/pi";
import PropTypes from 'prop-types';
import React, { useState, useContext ,useEffect} from 'react';
import kdb from "./kadabrix.js";
import { Card, CardContent, Grid } from '@mui/material';
import imageOnError from './imgErr.js';
import { useCartStore } from './cartState.jsx';
import  CartQuantBtn  from './cartQuantBtn.jsx';
import {resetCart} from "./cartCommands";
import { supabaseUrl } from "./kdbConfig";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PiPencilSimple } from "react-icons/pi";

import {updatePrice} from "./cartCommands";

import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField
} from '@mui/material';


function SimpleDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const cart = useCartStore((state) => state.cart);
  
  const [editQuant, setEditQuant] = useState(null);
  const [tempQuant, setTempQuant] = useState(0);

 
  const clearCart = async () => {
    await resetCart();
    
  };

  

  const placeOrder = async () => {
    await kdb.run({
      "module": "kdb_cart",
      "name": "placeOrder"
     
    });
    setEditQuant(null); // Close the editing input after successful update
  };


  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
  

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg">
      <DialogTitle>סל הקניות</DialogTitle>


      <Container style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        {cart.items.length > 0 ? (
          <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>תמונה</TableCell>
                    <TableCell>פריט</TableCell>
                    <TableCell>תיאור</TableCell>
                    <TableCell>מחיר</TableCell>
                    <TableCell>כמות</TableCell>
                    <TableCell>סה"כ</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((item, index) => (
                   <CartLine item={item} index={index} key={index} />
                  ))}
                  <TableRow>
                    <TableCell colSpan={4}></TableCell>
                    <TableCell>סה"כ:</TableCell>
                    <TableCell><b>{currencyFormat(cart?.total?.total)}</b></TableCell>
                    <TableCell><b>{cart?.total?.totalQ}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {  (cart.budget)?(
            <Card sx={{ maxWidth: 400, mt: 4, p: 2, alignSelf: 'flex-end' }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  תקציב הזמנה
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>ערך תקציב:</strong> {cart?.budget?.val}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>יתרה בתקציב:</strong> {cart?.budget?.metaData?.remaining}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>יתרה להזמנה:</strong> {cart?.total?.remainingBudget}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ):null}

          </div>

        ) : (
          <Typography variant="h4" component="div" align="center">
            אין מוצרים בסל
          </Typography>
        )}
      </Container>

      <DialogActions>
        <Button onClick={placeOrder}>שלח הזמנה</Button>
        <Button onClick={clearCart}>נקה סל</Button>
        <Button onClick={handleClose}>סגור חלון</Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const Component = () => {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const handleClickOpen = () => {
    setOpen(true);
  };

  eventBus.on('openCart', () => {
    
    setOpen(true);

  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <button
            className="text-3xl sm:text-2xl outline-none text-black hover:text-primary duration-300 relative">
      <SimpleDialog open={open} onClose={handleClose} />
      <PiShoppingCart onClick={handleClickOpen} style={{ cursor: 'pointer' }}  />
      {!cart.items.length > 0 ? null : 
      <span className="absolute -top-2 bg-primary text-white px-1 rounded-full -right-2 text-xs sm:text-[10px]">
              {cart.items.length}
      </span>
      } 
  </button>
  );
};

export default Component;

const CartLine = ({ item, index }) => {  
  const [priceEditOpen, setPriceEditOpen] = useState(false);
  
  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const handlePriceUpdate = async (newPrice) => {
    await updatePrice(item.index, newPrice);
  };

  return (
    <TableRow>
      <TableCell>
        <img
          src={`${supabaseUrl}/storage/v1/render/image/public/images/${item.part}.jpg?width=200&height=200`}
          alt={item.partName}
          style={{ width: '50px', height: 'auto' }}
          onError={imageOnError}
        />
      </TableCell>
      <TableCell>{item.partName}</TableCell>
      <TableCell>{item.partDes}</TableCell>
      <TableCell>
        {currencyFormat(item.price)}
        <IconButton 
          size="small" 
          onClick={() => setPriceEditOpen(true)}
        >
          <PiPencilSimple />
        </IconButton>
      </TableCell>
      <TableCell>
        <CartQuantBtn item={item}/>
      </TableCell>
      <TableCell>{currencyFormat(item.quant * item.price)}</TableCell>
      <PriceEditDialog 
        open={priceEditOpen}
        onClose={() => setPriceEditOpen(false)}
        originalPrice={item.price}
        onSave={handlePriceUpdate}
      />
    </TableRow>
  );
}


const PriceEditDialog = ({ open, onClose, originalPrice, onSave }) => {
  const [newPrice, setNewPrice] = useState(originalPrice);
  const [discount, setDiscount] = useState(0);

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>עדכון מחיר</DialogTitle>
      <DialogContent className="space-y-4">
        <div className="mt-4">
          <TextField
            label="מחיר מקורי"
            value={originalPrice}
            disabled
            fullWidth
            className="mb-4"
          />
        </div>
        <div>
          <TextField
            label="מחיר חדש"
            type="number"
            value={newPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            fullWidth
            className="mb-4"
          />
        </div>
        <div>
          <TextField
            label="הנחה (%)"
            type="number"
            value={discount}
            onChange={(e) => handleDiscountChange(e.target.value)}
            fullWidth
            InputProps={{
              inputProps: { 
                min: 0,
                max: 100
              }
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSave} variant="contained">שמור</Button>
      </DialogActions>
    </Dialog>
  );
};



