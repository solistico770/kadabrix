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
import logo from '../../assets/logo.png';
import { userContext } from '../../kadabrix/userState';



const mockMenuItems = [
  { key: 'budgetSelect', label: 'בחירת תקציב', icon: <AttachMoneyIcon fontSize="inherit" />, route: '/selectBudget', permission: 'b2bBudgetUser', color: '#f0f0f0' },
  { key: 'catalog', label: 'קטלוג מוצרים', icon: <InventoryIcon fontSize="inherit" />, route: '/catalog', permission: 'b2bCatalog', color: '#edf3f5' },

  { key: 'deferredCarts', label: 'סלי משתמשים', icon: <ShoppingCartIcon fontSize="inherit" />, route: '/deferredCarts', permission: 'canDefferCart', color: '#edf3f5' },


  { key: 'invoices', label: 'מצב ההזמנות', icon: <ReceiptIcon fontSize="inherit" />, route: '/invoices', permission: 'userOrders', color: '#f2f5f6' },
  { key: 'invoices', label: 'חשבוניות', icon: <ReceiptIcon fontSize="inherit" />, route: '/invoices', permission: 'userOrders', color: '#f2f5f6' },
  { key: 'accIndex', label: 'כרטסת', icon: <AccountBalanceIcon fontSize="inherit" />, route: '/accIndex', permission: 'userIndex', color: '#e9f1f3' },


  { key: 'salesReport', label: 'דוח מכירות', icon: <BarChartIcon fontSize="inherit" />, route: '/salesReport', permission: 'salesReports', color: '#f1f4f5' },

  { key: 'users', label: 'ניהול משתמשים', icon: <PeopleIcon fontSize="inherit" />, route: '/users', permission: 'usersManager', color: '#f0f4f8' },
  { key: 'permissions', label: 'ניהול תפקידים', icon: <PeopleIcon fontSize="inherit" />, route: '/roles', permission: 'rolesManager', color: '#f0f4f8' },
  { key: 'editCatalogCats', label: 'ניהול קטגוריות', icon: <CategoryIcon fontSize="inherit" />, route: '/editCatalogCats', permission: 'b2bManager', color: '#e8f0f4' },
  { key: 'editBudgets', label: 'ניהול תקציבים', icon: <AttachMoneyIcon fontSize="inherit" />, route: '/editBudgets', permission: 'b2bManager', color: '#eaf3f5' },
  { key: 'codeEditor', label: 'עורך קוד', icon: <CodeIcon fontSize="inherit" />, route: '/codeEditor', permission: 'codeEditor', color: '#eef2f3' },
  { key: 'etlEditor', label: 'עורך ETL', icon: <CodeIcon fontSize="inherit" />, route: '/etlEditor', permission: 'etlEditor', color: '#eef2f3' },
  { key: 'editHtmlTemplates', label: 'עורך HTML', icon: <CodeIcon fontSize="inherit" />, route: '/editHtmlTemplates', permission: 'editHtmlTemplates', color: '#eef2f3' },

];

const Menu = () => {

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { userDetails } = useContext(userContext);


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
