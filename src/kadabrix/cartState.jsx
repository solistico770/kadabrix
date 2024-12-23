import React, { createContext, useState , useEffect } from 'react';
import kdb from "../kadabrix/kadabrix"
import eventBus from "./event";






// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {

const [cart, setCart] = useState({items:[],loaded:false});

  


const fetchCart = async () => { 
  let cartData = await kdb.run({
    "module": "kdb_cart",
    "name": "getCart",
    "data": { }
  });
  setCart({...cartData,loaded:true})
  eventBus.emit("updateCart", {...cartData,loaded:true});
  
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


useEffect(() => {
  // Flag to ensure the effect runs only once for a session

 const { data: { subscription } } = kdb.auth.onAuthStateChange((event, session) => {
     if (session?.user?.email ) {
      fetchCart();
     }
    
})

}, []); // Empty dependency array to run only on mount

  


  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
