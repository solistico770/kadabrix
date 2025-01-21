import kdb from "../kadabrix/kadabrix"
import { create } from 'zustand';
import eventBus from "../kadabrix/event";

export const useCartStore = create((set) => ({
  cart: { items: [], loaded: false },
  setValue: (newValue) => {
    set({ cart: newValue })
  }
}));



eventBus.on("onAuthStateChange", async (session) => {
  
  if (session?.user?.email ) {
    await fetchCart(); 
  }
});

const fetchCart = async () => { 
  let cartData = await kdb.run({
    "module": "kdb_cart",
    "name": "getCart",
    "data": { }
  });
  
  useCartStore.getState().setValue({...cartData,loaded:true});
  

}

let debounceTimer;

const channel = kdb
  .channel('schema-db-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'kadabrix_carts' }, payload => {
    console.log('Change received!', payload);

    // Clear the previous timeout if a new event comes in within 100ms
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timeout for the fetchCart() call after 100ms
    debounceTimer = setTimeout(() => {
      fetchCart();
    }, 300);
  })
  .subscribe();