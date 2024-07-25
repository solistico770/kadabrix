import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

import PropTypes from 'prop-types';
import React , {  useState, useEffect,useContext } from 'react';
import kdb from "./kadabrix";
import { CartContext } from './cartState';
import {
  Container,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Typography
} from '@mui/material';

const Cart  = () => {

  const { cart , setCart } = useContext(CartContext);
  
  
  
    const currencyFormat = (num) => {
      num=Number(num);
  
      return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
   } 
   
  
  
   const clearCart = async (index) => {
  
    let data = await kdb.run({
      "module": "kdb_cart",
      "name": "reset",
      "data": { 
          index:index
       }
    });
   }
   
   const removeProduct = async (index) => {
  
    let data = await kdb.run({
      "module": "kdb_cart",
      "name": "removeItem",
      "data": { 
          index:index
       }
    });
   }
  
  
    return (
      <Container style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        <div style={{ flex: '0 0 auto', padding: '16px' }}>
          
         
         
        </div>
        {cart.items.length>0? 
        (
        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        
        
        <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>תמונה</TableCell>
                    <TableCell>שם חלק</TableCell>
                    <TableCell>תיאור</TableCell>
                    <TableCell>מחיר</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
              
                {cart.items.map((item) => (
                    <TableRow key={item.index}>
                      <TableCell>
                        <img
                          src={`https://heuayknlgusdwimnjbgs.supabase.co/storage/v1/render/image/public/images/${item.part}.jpg?width=200&height=200`}
                          alt={item.partName}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </TableCell>
                      <TableCell>{item.partName}</TableCell>
                      <TableCell>{item.partDes}</TableCell>
                      <TableCell>{currencyFormat(item.price)}</TableCell>
                      <TableCell>
                        
                      <Button onClick={() => removeProduct(item.index) }>REMOVE</Button>
  
  
                        
                        </TableCell>
                    </TableRow>
  
                     
  
  
  
  
                ))} 
  
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{currencyFormat(cart.total)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
  
  
                             </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={() => clearCart() }>CLEAR</Button>
          
        </div>

      ):(

        <h1>אין מוצרים בסל</h1>

      )}


      </Container>
    );
  }


function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

 

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>סל הקניות </DialogTitle>
      <Cart/>
      <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};



const Component = ({ children }) => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 
  return ( 
<div>  <SimpleDialog
        open={open}
        onClose={handleClose}
      />
  <ShoppingCartIcon onClick={handleClickOpen}>
  </ShoppingCartIcon> 

      
      </div>  
      
    )
}

export default Component;
