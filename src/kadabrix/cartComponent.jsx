import { PiShoppingCart } from "react-icons/pi";import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import kdb from "./kadabrix.js";
import { Card, CardContent, Grid } from '@mui/material';
import imageOnError from './imgErr.js';
import { CartContext } from './cartState.jsx';
import  CartQuantBtn  from './cartQuantBtn.jsx';
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function SimpleDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const { cart } = useContext(CartContext);
  const [editQuant, setEditQuant] = useState(null);
  const [tempQuant, setTempQuant] = useState(0);

  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const clearCart = async () => {
    await kdb.run({
      "module": "kdb_cart",
      "name": "reset",
    });
  };

  const quantSetItemAction = async (index, action) => {
    await kdb.run({
      "module": "kdb_cart",
      "name": "quantSetItem",
      "data": {
        index: index,
        action: action
      }
    });
  };


  const placeOrder = async () => {
    await kdb.run({
      "module": "kdb_cart",
      "name": "placeOrder"
     
    });
    setEditQuant(null); // Close the editing input after successful update
  };


  const quantSetItem = async (index, quant) => {
    await kdb.run({
      "module": "kdb_cart",
      "name": "quantSetItem",
      "data": {
        index: index,
        quant: quant
      }
    });
    setEditQuant(null); // Close the editing input after successful update
  };

  const removeProduct = async (index) => {
    await kdb.run({
      "module": "kdb_cart",
      "name": "removeItem",
      "data": {
        index: index
      }
    });
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
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          src={`https://heuayknlgusdwimnjbgs.supabase.co/storage/v1/render/image/public/images/${item.part}.jpg?width=50&height=50`}
                          alt={item.partName}
                          style={{ width: '50px', height: 'auto' }}
                          onError={imageOnError}
                        />
                      </TableCell>
                      <TableCell>{item.partName}</TableCell>
                      <TableCell>{item.partDes}</TableCell>
                      <TableCell>{currencyFormat(item.price)}</TableCell>
                      <TableCell>
                       
                       <CartQuantBtn item={item}/>
                        
                      </TableCell>
                      <TableCell>{currencyFormat(item.quant * item.price)}</TableCell>
                 
                    </TableRow>
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
  const { cart } = useContext(CartContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

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
