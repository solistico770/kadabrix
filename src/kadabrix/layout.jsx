import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import kdb from './kadabrix';
import CartComponent from "./cartComponent";
import logo from '../assets/logo.png';

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
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/menu')}>
                
                
            <img 
              src={logo} 
              alt="Logo" 
              style={{ width: 60, height: 'auto', marginRight: '16px' ,  mixBlendMode: 'multiply'
              }} 
            />
            </Button>
            
          </Box>

          {/* Center Cart Component */}
          <Box>
            <Typography variant="h6">
              <Button color="inherit">
                <CartComponent />
              </Button>
            </Typography>
          </Box>

          {/* Login/Logout Button on the right */}
          <Box>
            {user ? (
              <Button color="inherit" onClick={handleLogout}>
                יציאה
              </Button>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                כניסה
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Layout;
