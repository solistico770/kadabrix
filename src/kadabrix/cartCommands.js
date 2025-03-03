import kdb from './kadabrix';
import eventBus from "./event";
import { useCartStore } from "./cartState";
 
export const discountSetItem = async (index, discount) => {
    try {
        const cartData = useCartStore.getState().cart;
        const cartItem = cartData.items.find((item) => item.index === index);

        await eventBus.emit("discountSetItem", { index, discount });
        await kdb.run({
            module: 'kdb_cart',
            name: 'discountSetItem',
            data: {
                index,
                discount
            }
        });
        await eventBus.emit("discountPostSetItem", { index, discount });
        eventBus.emit("toast", { title: "הנחה עודכן", text: `הנחה המוצר ${cartItem.partDes} עודכן ל-${discount}` });
    } catch (error) {
        eventBus.emit("toast", { type:'error', title: "שגיאה", text: error });
    }
}



export async function addItem({ part, partName, partDes, quant, price }) {
    try {
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
        eventBus.emit("toast", { title: "מוצר נוסף", text: `מוצר ${partDes} נוסף לסל` });
    } catch (error) {
        eventBus.emit("toast", { type:'error',title: "שגיאה", text: error });
    }
}

export async function removeItem(index) {
    try {
        const cartData = useCartStore.getState().cart;
        const cartItem = cartData.items.find((item) => item.index === index);

        await eventBus.emit("cartRemoveItem", { index });
        await kdb.run({
            module: 'kdb_cart',
            name: 'removeItem',
            data: { index }
        });
        await eventBus.emit("cartPostRemoveItem", { index });
        eventBus.emit("toast", { title: "מוצר הוסר", text: `המוצר ${cartItem.partDes} הוסר מהסל` });
    } catch (error) {
        eventBus.emit("toast", {type:'error', title: "שגיאה", text: error });
    }
}

export async function updateQuantity(index, action, quant = null) {
    try {
        const cartData = useCartStore.getState().cart;
        const cartItem = cartData.items.find((item) => item.index === index);

        await eventBus.emit("cartQuantSetItem", { index, action, quant });
        await kdb.run({
            module: 'kdb_cart',
            name: 'quantSetItem',
            data: {
                index,
                action,
                quant
            }
        });
        await eventBus.emit("cartPostQuantSetItem", { index, action, quant });
        eventBus.emit("toast", { title: "כמות עודכנה", text: `כמות המוצר ${cartItem.partDes} עודכנה` });
    } catch (error) {
        eventBus.emit("toast", { type:'error',title: "שגיאה", text: error });
    }
}

export async function updatePrice(index, price) {
    try {
        const cartData = useCartStore.getState().cart;
        const cartItem = cartData.items.find((item) => item.index === index);

        await eventBus.emit("priceSetItem", { index, price });
        await kdb.run({
            module: 'kdb_cart',
            name: 'priceSetItem',
            data: {
                index,
                price
            }
        });
        await eventBus.emit("pricePostSetItem", { index, price });
        eventBus.emit("toast", { title: "מחיר עודכן", text: `מחיר המוצר ${cartItem.partDes} עודכן ל-${price}` });
    } catch (error) {
        eventBus.emit("toast", { type:'error', title: "שגיאה", text: error });
    }
}

export async function resetCart() {
    try {
        await eventBus.emit("cartReset");
        await kdb.run({
            module: 'kdb_cart',
            name: 'reset',
            data: {}
        });
        await eventBus.emit("cartPostReset");
        eventBus.emit("toast", { title: "עגלת הקניות אופסה", text: "כל המוצרים הוסרו מהסל" });
    } catch (error) {
        eventBus.emit("toast", { type:'error', title: "שגיאה", text: error });
    }
}
