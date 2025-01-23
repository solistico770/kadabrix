import eventBus from "../../kadabrix/event";
const main = () => {
   
    eventBus.on("cartPriceSetItem", (payload) => {
      toast.success('Price Updated', {
        description: payload?.price ? `Price updated to $${payload.price}` : 'Price updated'
      });
    });
    
    eventBus.on("cartQuantSetItem", (payload) => {
      toast.info('Quantity Updated', {
        description: `Quantity ${payload?.quantity ? `set to ${payload.quantity}` : 'updated'}${payload?.name ? ` for ${payload.name}` : ''}`
      });
    });
    

};

export default main;