"use client";

import { useState, useEffect } from 'react';
import kdb from "../../kadabrix/kadabrix";
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
const [cart, setcart] = useState({items:[]});


const fetchCart = async () => { 
  let data = await kdb.run({
    "module": "kdb_cart",
    "name": "getCart",
    "data": { }
  });
  setcart(data);
}



const channel = kdb
.channel('schema-db-changes')
.on('postgres_changes', { event: '*', schema: 'public', table: 'kadabrix_carts' }, payload => {
  console.log('Change received!', payload);
  fetchCart();
})
.subscribe();


useEffect(()=>{
  fetchCart();
},[])



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
                ))}              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={() => clearCart() }>CLEAR</Button>
      </div>
    </Container>
  );
};

export default Cart;
