import React, { useState } from 'react';
import { PiPencilSimple, PiTrash, PiNotePencil, PiCheckCircle } from 'react-icons/pi';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { supabaseUrl } from '../kdbConfig';
import eventBus from '../event';
import { updatePrice, discountSetItem, removeItem, updateLineRemarks } from '../cartCommands';
import CartQuantBtn from './CartQuantBtn';
import {
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Avatar,
  Box,
  Chip
} from '@mui/material';

// Import the separated dialog components
import PriceEditDialog from './PriceEditDialog';
import DiscountEditDialog from './DiscountEditDialog';
import LineRemarksDialog from './LineRemarksDialog';

// Cart Line Component
const CartLine = ({ 
  item, 
  index, 
  isMobile, 
  isTablet, 
  isSelected, 
  onToggleSelect, 
  showSnackbar 
}) => {  
  const [priceEditOpen, setPriceEditOpen] = useState(false);
  const [discountEditOpen, setDiscountEditOpen] = useState(false);
  const [lineRemarksOpen, setLineRemarksOpen] = useState(false);
  const theme = useTheme();
  
  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const handlePriceUpdate = async (newPrice) => {
    try {
      await updatePrice(item.index, newPrice);
      showSnackbar('success', "המחיר עודכן בהצלחה");
    } catch (error) {
      showSnackbar('error', "שגיאה בעדכון המחיר");
    }
  };

  const handleDiscountUpdate = async (newDiscount) => {
    try {
      await discountSetItem(item.index, newDiscount);
      showSnackbar('success', "ההנחה עודכנה בהצלחה");
    } catch (error) {
      showSnackbar('error', "שגיאה בעדכון ההנחה");
    }
  };

  const handleLineRemarksUpdate = async (remarks) => {
    try {
      await updateLineRemarks(item.index, remarks);
      showSnackbar('success', "ההערות עודכנו בהצלחה");
    } catch (error) {
      showSnackbar('error', "שגיאה בעדכון ההערות");
    }
  };

  const handleRemoveItem = async () => {
    try {
      await removeItem(item.index);
      showSnackbar('success', "הפריט הוסר בהצלחה");
    } catch (error) {
      showSnackbar('error', "שגיאה בהסרת הפריט");
    }
  };

  // Calculate final price after discount
  const getDiscountedPrice = () => {
    const discount = item.discount || 0;
    return item.price * (1 - discount / 100);
  };

  const imageOnError = (e) => {
    e.target.onerror = null;
    e.target.src = '/path/to/fallback-image.png'; // Set a fallback image
  };

  // Check if item has remarks
  const hasRemarks = item.remarks && item.remarks.trim().length > 0;

  return (
    <TableRow 
      hover
      selected={isSelected}
      sx={{ 
        '&.Mui-selected': {
          backgroundColor: `${theme.palette.primary.light}20`,
        },
        '&.Mui-selected:hover': {
          backgroundColor: `${theme.palette.primary.light}30`,
        }
      }}
    >
      {!isMobile && (
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelect}
          />
        </TableCell>
      )}
      <TableCell>
        <Avatar
          src={`${supabaseUrl}/storage/v1/render/image/public/images/${item.part}.jpg?width=200&height=200&resize=contain`}
          alt={item.partName}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
          imgProps={{ onError: imageOnError }}
        />
      </TableCell>
      {!isMobile && (
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {item.partName}
            </Typography>
            {isMobile && (
              <Typography variant="caption" color="text.secondary">
                {item.partDes}
              </Typography>
            )}
           
          </Box>
        </TableCell>
      )}
      {!isMobile && !isTablet && (
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {item.partDes}
          </Typography>
        </TableCell>
      )}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography 
            variant="body2" 
            sx={{ 
              textDecoration: item.discount ? 'line-through' : 'none',
              color: item.discount ? 'text.secondary' : 'text.primary'
            }}
          >
            {currencyFormat(item.price)}
          </Typography>
          <Tooltip title="ערוך מחיר">
            <IconButton 
              size="small" 
              onClick={() => setPriceEditOpen(true)}
              sx={{ color: theme.palette.primary.main }}
            >
              <PiPencilSimple />
            </IconButton>
          </Tooltip>
          {item.discount > 0 && (
            <Typography variant="body2" color="success.main" fontWeight="bold">
              {currencyFormat(getDiscountedPrice())}
            </Typography>
          )}
        </Stack>
      </TableCell>
      <TableCell>
        <CartQuantBtn item={item} />
      </TableCell>
      {!isMobile && (
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: item.discount > 0 ? 'success.main' : 'text.secondary',
                fontWeight: item.discount > 0 ? 'bold' : 'normal'
              }}
            >
              {item.discount ? `${item.discount}%` : '-'}
            </Typography>
            <Tooltip title="ערוך הנחה">
              <IconButton 
                size="small" 
                onClick={() => setDiscountEditOpen(true)}
                sx={{ color: theme.palette.secondary.main }}
              >
                <PiPencilSimple />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      )}
      <TableCell>
        <Typography 
          variant="body2" 
          fontWeight="bold"
          color={item.discount > 0 ? 'success.main' : 'text.primary'}
        >
          {currencyFormat(getDiscountedPrice() * item.quant)}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={hasRemarks ? "ערוך הערות פריט" : "הוסף הערות לפריט"}>
            <IconButton
              onClick={() => setLineRemarksOpen(true)}
              size="small"
              color="info"
              sx={{ p: 0.5 }}
            >
              {hasRemarks ? <PiCheckCircle /> : <PiNotePencil />}
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={handleRemoveItem}
            size="small"
            color="error"
            sx={{ p: 0.5 }}
          >
            <PiTrash />
          </IconButton>
        </Stack>
      </TableCell>

      {/* Price Edit Dialog */}
      <PriceEditDialog 
        open={priceEditOpen}
        onClose={() => setPriceEditOpen(false)}
        originalPrice={item.price}
        onSave={handlePriceUpdate}
      />

      {/* Discount Edit Dialog */}
      <DiscountEditDialog 
        open={discountEditOpen}
        onClose={() => setDiscountEditOpen(false)}
        originalDiscount={item.discount || 0}
        itemName={item.partName}
        onSave={handleDiscountUpdate}
      />

      {/* Line Remarks Dialog */}
      <LineRemarksDialog
        open={lineRemarksOpen}
        onClose={() => setLineRemarksOpen(false)}
        itemName={item.partName}
        currentRemarks={item.remarks || ''}
        onSave={handleLineRemarksUpdate}
      />
    </TableRow>
  );
};

CartLine.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired
};

export default CartLine;