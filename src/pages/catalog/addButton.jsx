import {   Button  , IconButton ,ButtonGroup }
from '@mui/material';
import kdb from "../../kadabrix/kadabrix";
import { useContext } from 'react';
import { CartContext } from '../../kadabrix/cartState';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const AddButton = (props) => {


const { cart , setCart } = useContext(CartContext);

const inCart = (partName) => {
    return (cart.items.find((item)=>item.partName==partName))
}
    


const removeProduct = async (partName) => {

// find index in cart 
    let item = inCart(partName)
    let index = item.index;


    let data = await kdb.run({
      "module": "kdb_cart",
      "name": "removeItem",
      "data": {index:index}
    });
   }

   
 const addProduct = async (item) => {

    let data = await kdb.run({
      "module": "kdb_cart",
      "name": "addItem",
      "data": { 
          part:item.part,
          partName:item.partName,
          partDes:item.partDes,
          price:item.price,
          quant:1
       }
    });
   }
  

   
    
    return (
        <ButtonGroup variant="contained" aria-label="Basic button group">
        {(inCart(props.item.partName))? 
        <div>
                        
            <IconButton 
                onClick={() => removeProduct(props.item.partName) }
                aria-label="delete"  color="primary">
            <DeleteIcon />
            </IconButton>

            
        </div>

        : 
        
        <IconButton onClick={() => addProduct(props.item)}>
            <AddShoppingCartIcon />
        </IconButton>

        }
        </ButtonGroup>)

}
export default AddButton