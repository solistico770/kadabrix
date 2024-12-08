import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import kdb from '../kadabrix/kadabrix';
import CartComponent from "../kadabrix/cartComponent";
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
      <AppBar position="static" sx={{ backgroundColor: '#c8e6c9'}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Section - Logo and Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/menu')}>
              <img 
                src={logo} 
                alt="Logo" 
                style={{ width: 60, height: 'auto', marginRight: '16px', mixBlendMode: 'multiply' }} 
              />
            </Button>
            
            {/* Cart Component Button */}
            
          </Box>

          {/* Right Section - Login/Logout Button */}
          <Box>
         
            
            {user ? (
              <div>

            <Button 
              color="success" 
              sx={{ fontSize: '1.1rem', marginLeft: '16px', color: 'green' }}
            >
              <CartComponent />
            </Button>
              
              <Button 
                sx={{ color: 'black', fontWeight: 'bold' }} 
                onClick={handleLogout}
              >
                יציאה
              </Button>
              </div>
            ) : (
              <Button 
              sx={{ color: 'black', fontWeight: 'bold' }} 

              color="inherit" onClick={() => navigate('/login')}>
                
              </Button>
            )}
            
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Layout;
