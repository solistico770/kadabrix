import React, { useState, useEffect } from 'react';
import { PiPencilSimple, PiTrash, PiPercent, PiShoppingCart, PiCheckCircle } from 'react-icons/pi';
import PropTypes from 'prop-types';
import kdb from '../kadabrix.js';
import { useCartStore } from '../cartState.jsx';
import { resetCart } from '../cartCommands.js';
import eventBus from '../event.js';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Checkbox,
  Divider,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid
} from '@mui/material';

// Import the separated components
import CartLine from './CartLine.jsx';
import BatchDiscountDialog from './BatchDiscountDialog.jsx';

// Main Cart Dialog Component
function CartDialog(props) {
  const { onClose, open } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const cart = useCartStore((state) => state.cart);
  const [selectedItems, setSelectedItems] = useState([]);
  const [batchDiscountOpen, setBatchDiscountOpen] = useState(false);
  const [orderConfirmOpen, setOrderConfirmOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Reset selected items when cart changes
    setSelectedItems([]);
  }, [cart]);

  const handleClose = () => {
    setSelectedItems([]);
    onClose();
  };

  const clearCart = async () => {
    try {
      await resetCart();
      eventBus.emit("toast", { type: 'success', title: "הצלחה", text: "הסל נוקה בהצלחה" });
    } catch (error) {
      eventBus.emit("toast", { type: 'error', title: "שגיאה", text: "שגיאה בניקוי הסל" });
    }
  };

  const placeOrder = async () => {
    try {
      setIsProcessing(true);
      const result = await kdb.run({
        'module': 'kdb_cart',
        'name': 'placeOrder'
      });
      
      // The API returns the order number
      setOrderNumber(result);
      setOrderConfirmOpen(true);
      
    } catch (error) {
      eventBus.emit("toast", { type: 'error', title: "שגיאה", text: error.message || "שגיאה בשליחת ההזמנה" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrderConfirmClose = () => {
    setOrderConfirmOpen(false);
    handleClose(); // Close the cart dialog as well
  };

  const toggleItemSelection = (index) => {
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index) 
        : [...prev, index]
    );
  };

  const handleBatchDiscount = () => {
    if (selectedItems.length === 0) {
      eventBus.emit("toast", { type: 'warning', title: "אזהרה", text: "יש לבחור פריטים תחילה" });
      return;
    }
    setBatchDiscountOpen(true);
  };

  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  // Determine if the dialog should be fullscreen based on screen size
  const fullScreen = isMobile;

  return (
    <>
      <Dialog 
        onClose={handleClose} 
        open={open} 
        maxWidth="lg" 
        fullWidth
        fullScreen={fullScreen}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: 'up',
          timeout: { enter: 400, exit: 300 }
        }}
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 2,
            overflowY: 'hidden',
            height: fullScreen ? '100%' : 'auto',
            maxHeight: fullScreen ? '100%' : '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: 'rtl' // RTL support
        }}>
          <Typography variant="h6" component="div">
            סל הקניות
          </Typography>
          {selectedItems.length > 0 && (
            <Box>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<PiPercent />}
                onClick={handleBatchDiscount}
                sx={{ ml: 2 }}
              >
                הנחה מרוכזת ({selectedItems.length})
              </Button>
            </Box>
          )}
        </DialogTitle>

        <DialogContent 
          sx={{ 
            p: isMobile ? 1 : 3, 
            overflowY: 'auto',
            direction: 'rtl' // RTL support
          }}
        >
          <Container 
            disableGutters 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              width: '100%',
              height: fullScreen ? 'calc(100vh - 180px)' : '60vh'
            }}
          >
            {cart.items && cart.items.length > 0 ? (
              <Box sx={{ flex: '1 1 auto', overflowY: 'auto' }}>
                <TableContainer 
                  component={Paper} 
                  elevation={3}
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                        {!isMobile && (
                          <TableCell padding="checkbox">
                            <Checkbox 
                              indeterminate={selectedItems.length > 0 && selectedItems.length < cart.items.length}
                              checked={selectedItems.length === cart.items.length && cart.items.length > 0}
                              onChange={() => {
                                if (selectedItems.length === cart.items.length) {
                                  setSelectedItems([]);
                                } else {
                                  setSelectedItems(cart.items.map(item => item.index));
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell>תמונה</TableCell>
                        {!isMobile && <TableCell>פריט</TableCell>}
                        {!isMobile && !isTablet && <TableCell>תיאור</TableCell>}
                        <TableCell>מחיר</TableCell>
                        <TableCell>כמות</TableCell>
                        {!isMobile && <TableCell>הנחה</TableCell>}
                        <TableCell>סה"כ</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.items.map((item, index) => (
                        <CartLine 
                          key={item.index} 
                          item={item} 
                          index={index} 
                          isMobile={isMobile}
                          isTablet={isTablet}
                          isSelected={selectedItems.includes(item.index)}
                          onToggleSelect={() => toggleItemSelection(item.index)}
                          
                        />
                      ))}
                      <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                        <TableCell colSpan={isMobile ? 3 : (isTablet ? 5 : 6)}></TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>סה"כ:</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                          {currencyFormat(cart?.total?.total || 0)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {cart?.total?.totalQ || 0}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {cart.budget && (
                  <Zoom in={true} timeout={500}>
                    <Card 
                      sx={{ 
                        maxWidth: 400, 
                        mt: 2, 
                        mb: 2, 
                        p: 0, 
                        alignSelf: 'flex-end',
                        borderRadius: 2,
                        boxShadow: 3
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" component="div" gutterBottom sx={{ color: theme.palette.primary.main }}>
                          תקציב הזמנה
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>ערך תקציב:</span>
                              <strong>{currencyFormat(cart?.budget?.val || 0)}</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>יתרה בתקציב:</span>
                              <strong>{currencyFormat(cart?.budget?.metaData?.remaining || 0)}</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                color: (cart?.total?.remainingBudget < 0) ? 'error.main' : 'success.main',
                                fontWeight: 'bold'
                              }}
                            >
                              <span>יתרה להזמנה:</span>
                              <span>{currencyFormat(cart?.total?.remainingBudget || 0)}</span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Zoom>
                )}
              </Box>
            ) : (
              <EmptyCart />
            )}
          </Container>
        </DialogContent>

        <DialogActions sx={{ 
          backgroundColor: theme.palette.grey[100],
          p: 2,
          direction: 'rtl' // RTL support
        }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={placeOrder}
            disabled={!cart.items || cart.items.length === 0 || isProcessing}
            sx={{ borderRadius: 2 }}
          >
            {isProcessing ? 'מעבד...' : 'שלח הזמנה'}
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={clearCart}
            disabled={!cart.items || cart.items.length === 0 || isProcessing}
            sx={{ borderRadius: 2 }}
          >
            נקה סל
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            disabled={isProcessing}
            sx={{ borderRadius: 2 }}
          >
            סגור חלון
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog
        open={orderConfirmOpen}
        onClose={handleOrderConfirmClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', direction: 'rtl' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 3 
          }}>
            <PiCheckCircle 
              size={80} 
              color={theme.palette.success.main} 
              style={{ marginBottom: '16px' }}
            />
            <Typography variant="h5" gutterBottom color="success.main" fontWeight="bold">
              ההזמנה התקבלה בהצלחה
            </Typography>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              הזמנה מספר #{orderNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              פרטי ההזמנה נשלחו למערכת ויטופלו בהקדם
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2, pb: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOrderConfirmClose}
            sx={{ 
              borderRadius: 2,
              minWidth: 120
            }}
          >
            אישור
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Discount Dialog */}
      <BatchDiscountDialog 
        open={batchDiscountOpen} 
        onClose={() => setBatchDiscountOpen(false)}
        selectedItems={selectedItems}
      />
    </>
  );
}

// Empty Cart Component
const EmptyCart = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}
    >
      <PiShoppingCart size={80} color={theme.palette.grey[400]} />
      <Typography 
        variant="h5" 
        component="div" 
        align="center" 
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        אין מוצרים בסל
      </Typography>
      <Typography 
        variant="body1" 
        align="center" 
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        ניתן להוסיף מוצרים מהקטלוג
      </Typography>
    </Box>
  );
};

CartDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default CartDialog;