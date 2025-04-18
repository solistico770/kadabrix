import { useState, useEffect, useContext } from 'react';
import { useCartStore } from '../../../kadabrix/cartState';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import kdb from "../../../kadabrix/kadabrix";
import {addItem,removeItem,updateQuantity} from "../../../kadabrix/cartCommands";


const AddButton = (props) => {
  const cart = useCartStore((state) => state.cart);
  
  const [isLoading, setIsLoading] = useState(false);
  const [tempQuant, setTempQuant] = useState('');
  const [showOk, setShowOk] = useState(false);

  const inCartItem = cart.items.find(
    (item) => item.partName === props.item.partName
  );

  useEffect(() => {
    setIsLoading(false);
    if (inCartItem) {
      setTempQuant(inCartItem.quant.toString());
    }
  }, [cart, inCartItem]);

  const removeProduct = async (partName) => {
    setIsLoading(true);
    const index = inCartItem.index;
    await removeItem(index);
    setIsLoading(false);
  };

  const addProduct = async (item) => {
    setIsLoading(true);
    try { 

      await addItem({ part: item.part, partName: item.partName, partDes: item.partDes, price: item.price, quant: 1 });

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }    
  };

  const changeQuant = async (partName, newQuant) => {
    setIsLoading(true);
    const index = inCartItem.index;
    await updateQuantity(index, "set", newQuant);
    
    setShowOk(false);
    setIsLoading(false);
  };

  const handleQuantChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (value.length <= 3) {
      setTempQuant(value);
      setShowOk(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md lg:max-w-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50">
          <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-gray-800 animate-spin"></div>
        </div>
      )}
      <div className="flex flex-col gap-4 p-4 transition-transform lg:scale-100 sm:scale-50 xs:scale-75">
        {inCartItem?.partName === props.item?.partName ? (
          <div className="flex items-center justify-between w-full">
            {showOk ? (
              <button
                onClick={() =>
                  changeQuant(props.item.partName, tempQuant)
                }
                className="p-2 sm:p-3 bg-green-500 hover:bg-green-600 rounded-md text-white flex items-center justify-center"
              >
                <CheckIcon
                  className="text-lg sm:text-xl lg:text-2xl"
                />
              </button>
            ) : (
              <button
                onClick={() =>
                  removeProduct(props.item.partName)
                }
                className="p-2 sm:p-3 bg-red-500 hover:bg-red-600 rounded-md text-white flex items-center justify-center"
              >
                <DeleteIcon
                  className="text-lg sm:text-xl lg:text-2xl"
                />
              </button>
            )}
            <input
              type="number"
              value={tempQuant}
              onChange={handleQuantChange}
              className="w-16 h-10 text-center border border-gray-300 rounded-md mr-1 focus:ring focus:ring-blue-200 text-lg"
              maxLength={3}
            />
          </div>
        ) : (
          <button
            onClick={() => addProduct(props.item)}
            className="p-2 sm:p-3 bg-green-500 hover:bg-green-600 rounded-md text-white flex items-center justify-center"
          >
            <AddShoppingCartIcon
              className="text-lg sm:text-xl lg:text-2xl"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddButton;
