import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import kdb from './kadabrix';
import CartComponent from "./cartComponent"

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await kdb.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = kdb.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await kdb.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" >
          <Button color="inherit" onClick={() => navigate('/menu')}>
        KaDaBriX
          </Button>
              
          </Typography>

          <Typography variant="h6" >
          <Button color="inherit">
          <CartComponent/>

          </Button>
              
          </Typography>



          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              יציאה
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              כניסה
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Layout;
