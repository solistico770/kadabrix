import { ButtonGroup, CircularProgress, IconButton, TextField } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { useCartStore } from './cartState';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import kdb from "./kadabrix";

const AddButton = (props) => {
    const cart = useCartStore((state) => state.cart);
    
    const [isLoading, setIsLoading] = useState(false);
    const [tempQuant, setTempQuant] = useState('');
    const [showOk, setShowOk] = useState(false);

    const inCartItem = props.item

    useEffect(() => {
        setIsLoading(false);
        if (inCartItem) {
            setTempQuant(inCartItem.quant.toString());
        }
    }, [cart, inCartItem]);

    const removeProduct = async (partName) => {
        setIsLoading(true);
        const index = inCartItem.index;
        await kdb.run({
            module: "kdb_cart",
            name: "removeItem",
            data: { index },
        });
    };

    const addProduct = async (item) => {
        setIsLoading(true);
        await kdb.run({
            module: "kdb_cart",
            name: "addItem",
            data: {
                part: item.part,
                partName: item.partName,
                partDes: item.partDes,
                price: item.price,
                quant: 1,
            },
        });
    };

    const changeQuant = async (partName, newQuant) => {
        setIsLoading(true);
        const index = inCartItem.index;
        await kdb.run({
            module: "kdb_cart",
            name: "quantSetItem",
            data: { index, quant: newQuant },
        });
        setShowOk(false);
    };

    const handleQuantChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        if (value.length <= 3) {
            setTempQuant(value);
            setShowOk(true);
        }
    };

    return (
        <div style={{ margin: 1, position: 'relative' }}>
            {isLoading && (
                <CircularProgress
                    size={68}
                    sx={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                    }}
                />
            )}
            <ButtonGroup variant="contained" aria-label="Basic button group">
                {inCartItem?.partName === props.item?.partName ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {showOk ? (
                            <IconButton
                                onClick={() => changeQuant(props.item.partName, tempQuant)}
                                color="success"
                            >
                                <CheckIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => removeProduct(props.item.partName)}
                                aria-label="delete"
                                color="primary"
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                        <TextField
                            size="small"
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                maxLength: 3,
                                style: { textAlign: 'center' }, // Center align text
                            }}
                            value={tempQuant}
                            onChange={handleQuantChange}
                            sx={{ width: '60px', marginLeft: '8px' }}
                        />
                    </div>
                ) : (
                    <IconButton onClick={() => addProduct(props.item)}>
                        <AddShoppingCartIcon />
                    </IconButton>
                )}
            </ButtonGroup>
        </div>
    );
};

export default AddButton;
