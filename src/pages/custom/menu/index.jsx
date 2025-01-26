import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, Container, Box, Typography, Avatar, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CodeIcon from '@mui/icons-material/Code';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import logo from '../../../assets/logo.png';

  import { useUserStore } from '../../../kadabrix/userState';




const mockMenuItems = [
  { key: 'catalog', label: 'קטלוג מוצרים', icon: <InventoryIcon fontSize="inherit" />, route: '/custom/catalog', permission: 'b2bCatalog', color: '#edf3f5' },
  { key: 'catalog', label: 'ניהול הזמנות', icon: <InventoryIcon fontSize="inherit" />, route: '/custom/deferredCarts', permission: 'deferredCarts', color: '#edf3f5' },
  { key: 'salesReport', label: 'דוח מכירות', icon: <BarChartIcon fontSize="inherit" />, route: '/custom/salesReport', permission: 'salesReports', color: '#f1f4f5' },

]

const Menu = () => {

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const  userDetails  = useUserStore(state => state.userDetails);

  


  const renderMenuItems = () => {
    return mockMenuItems.filter(item => userDetails.permissions.includes(item.permission)).map((item) => (
      <Grid key={item.key} item xs={12} sm={6} md={4} lg={3}>
        <Box
          onClick={() => navigate(item.route)}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            backgroundColor: item.color, // Assigning specific color to each box
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <IconButton color="primary" size="large" sx={{ transform: 'scale(1.6)' }}>
            {item.icon}
          </IconButton>
          <Typography variant="subtitle" align="center" sx={{ fontWeight: 'bold', mt: 1 }}>
            {item.label}
          </Typography>
        </Box>
      </Grid>
    ));
  };

  return (
    <Container>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >

        <img
          src={logo}
          alt="Logo"
          style={{ width: 160, height: 'auto', marginRight: '16px', mixBlendMode: 'multiply' }}
        />

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3} justifyContent="center">
          {renderMenuItems()}
        </Grid>
      </Box>
    </Container>
  );
};

export default Menu;
