import kdb from './kadabrix';
import eventBus from "./event";


export async  function addItem({ part, partName, partDes, quant, price }) {

      await eventBus.emit("cartAddItem", { part, partName, partDes, quant, price });
      await kdb.run({
        module: 'kdb_cart',
        name: 'addItem',
        data: {
          part,
          partName,
          partDes,
          quant,
          price
        }
      });
      await eventBus.emit("cartPostAddItem", { part, partName, partDes, quant, price });
      
  }





  // Remove item from cart
  export async  function removeItem(index) {
    
    await eventBus.emit("cartRemoveItem", { index });

      await kdb.run({
        module: 'kdb_cart',
        name: 'removeItem',
        data: { index }
      });
      
      await eventBus.emit("cartPostRemoveItem", { index });
  }
  

  // Update item quantity
  export async  function updateQuantity(index, action, quant = null) {
    
      await eventBus.emit("cartQuantSetItem", { index, action, quant });
      return await kdb.run({
        module: 'kdb_cart',
        name: 'quantSetItem',
        data: {
          index,
          action,
          quant
        }
      });
  }

  // Update item price
  export async  function updatePrice(index, price) {
    await eventBus.emit("cartPriceSetItem", { index, price });
      return await kdb.run({
        module: 'kdb_cart',
        name: 'priceSetItem',
        data: {
          index,
          price
        }
      });
  }


  // Reset cart
  export async  function resetCart() {
      return await kdb.run({
        module: 'kdb_cart',
        name: 'reset',
        data: {}
      });
  }
