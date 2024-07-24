import {   Button  , IconButton ,ButtonGroup,CircularProgress }
from '@mui/material';
import kdb from "../../kadabrix/kadabrix";
import { useState , useEffect  , useContext } from 'react';
import { CartContext } from '../../kadabrix/cartState';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const AddButton = (props) => {


const { cart , setCart } = useContext(CartContext);

const [ isLoading , setIsLoading ] = useState(false);


const inCart = (partName) => {
    return (cart.items.find((item)=>item.partName==partName))
}
    

useEffect(()=>{

    setIsLoading(false)

},[cart])

const removeProduct = async (partName) => {
    setIsLoading(true)
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
    setIsLoading(true)
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
        <div style={{ m: 1, position: 'relative' }}>{isLoading?
            <CircularProgress
            size={68}
            sx={{
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />

        :''}
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
        </ButtonGroup>
        </div>
        )
        


}
export default AddButton