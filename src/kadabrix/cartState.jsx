import React, { createContext, useState , useEffect } from 'react';
import kdb from "../kadabrix/kadabrix"

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {

const [cart, setCart] = useState({items:[]});

  


const fetchCart = async () => { 
  let cartData = await kdb.run({
    "module": "kdb_cart",
    "name": "getCart",
    "data": { }
  });
  setCart(cartData)
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


  


  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
