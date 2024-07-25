import React, { useState, useEffect , useContext } from 'react';
import { Button, Grid, Box, Typography, Avatar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import kdb from '../../kadabrix/kadabrix';

const Menu = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data, error } = await kdb.rpc('execute_user_query', {
          query_text: `SELECT role FROM user_roles WHERE user_id = auth.uid()`,
        });
        if (error) {
          setError(error.message);
        } else {
          setRoles(data.map(item => item.result.role));
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoles();
  }, []);

  const renderMenuItems = () => {
    const menuItems = [];

    if (roles.includes('kadmin')) {
      menuItems.push(
        <Grid item key="users">
          <Button
            onClick={() => navigate('/users')}
            variant="contained"
            startIcon={<PeopleIcon />}
            fullWidth
          >
            ניהול משתמשים
          </Button>
        </Grid>
      );
    }

    if (roles.includes('kagent') || roles.includes('kb2b')) {
      menuItems.push(
        <Grid item key="cart">
          <Button
            onClick={() => navigate('/cart')}
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            fullWidth
          >
            סל הקניות

          </Button>
        </Grid>
      );
    }

    if (roles.includes('kagent') || roles.includes('kb2b')) {
      menuItems.push(
        <Grid item key="catalog">
          <Button
            onClick={() => navigate('/catalog')}
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            fullWidth
          >
            קטלוג מוצרים
          </Button>
        </Grid>
      );
    }


    return menuItems;
  };

  return (
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

      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <DashboardIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        תפריט ראשי
      </Typography>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        {renderMenuItems()}
      </Grid>
    </Box>
  );
};

export default Menu;
