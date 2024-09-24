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
    let data = await kdb.run({
      "module": "kdb_users",
      "name": "getRoles",
      "data": {}
    });
    
    setRoles(data.map(item => item.role));

  } catch(err){

    setError(err);

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

    

  
      if (roles.includes('kadmin')) {
        menuItems.push(
          <Grid item key="codeEditor">
            <Button
              onClick={() => navigate('/codeEditor')}
              variant="contained"
              startIcon={<PeopleIcon />}
              fullWidth
            >
              codeEditor
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


    if (roles.includes('ksalesAdmin')) {
      menuItems.push(
        <Grid item key="salesReport">
          <Button
            onClick={() => navigate('/salesReport')}
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            fullWidth
          >
            דוח מכירות
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
