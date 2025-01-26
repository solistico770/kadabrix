import eventBus from "../../kadabrix/event";
import injectComponent from "../../kadabrix/injectComponent";
import React, { useEffect } from "react";
import { Toaster, toast } from 'sonner';


injectComponent(() => <DialogComponent />);
const DialogComponent = () => {
  useEffect(() => {
   const e1= eventBus.on("cartRemoveItem", (payload) => {
      toast.error('Item Removed', {
        description: payload?.name ? `Removed ${payload.name} from cart` : 'Item removed from cart'
      });
    });
    
    const e2= eventBus.on("cartPriceSetItem", (payload) => {
      toast.success('Price Updated', {
        description: payload?.price ? `Price updated to $${payload.price}` : 'Price updated'
      });
    });
    
    const e3=eventBus.on("cartQuantSetItem", (payload) => {
      toast.info('Quantity Updated', {
        description: `Quantity ${payload?.quantity ? `set to ${payload.quantity}` : 'updated'}${payload?.name ? ` for ${payload.name}` : ''}`
      });
    });
  
    const e4= eventBus.on("cartAddItem", (payload) => {
      
      toast.success('Added to Cart', {
        description: `${payload?.name || 'Item'} added${payload?.quantity ? ` (Qty: ${payload.quantity})` : ''}`
      });
    });

    // Cleanup event listeners
    return () => {

      e1();
      e2();
      e3();
      e4(); 
      
    };
  }, []);

  return (
    <Toaster 
      position="top-right"
      expand={true}
      richColors
    />
  );
};

export default DialogComponent;