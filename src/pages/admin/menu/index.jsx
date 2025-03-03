import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, Container, Box, Typography, Avatar, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import CodeIcon from '@mui/icons-material/Code';
import logo from '../../../assets/logo.png';
import { useUserStore } from '../../../kadabrix/userState';

const mockMenuItems = [
  { key: 'config', label: 'תפריט B2B', icon: <PeopleIcon fontSize="inherit" />, route: '/b2b/menu', permission: '', color: '#f0f4f8' },
  { key: 'config', label: 'תפריט REP', icon: <PeopleIcon fontSize="inherit" />, route: '/rep/menu', permission: '', color: '#f0f4f8' },
  { key: 'config', label: 'קונפיגורציה', icon: <PeopleIcon fontSize="inherit" />, route: '/admin/editConfig', permission: 'configEditor', color: '#f0f4f8' },
  { key: 'configCustom', label: 'קוסטום קונפיגורציה', icon: <PeopleIcon fontSize="inherit" />, route: '/admin/editConfigCustom', permission: 'configEditor', color: '#f0f4f8' },
  { key: 'permissions', label: 'ניהול תפקידים', icon: <PeopleIcon fontSize="inherit" />, route: '/admin/roles', permission: 'rolesManager', color: '#f0f4f8' },
  { key: 'users', label: 'ניהול משתמשים', icon: <PeopleIcon fontSize="inherit" />, route: '/admin/users', permission: 'usersManager', color: '#f0f4f8' },
  { key: 'codeEditor', label: 'עורך קוד', icon: <CodeIcon fontSize="inherit" />, route: '/admin/codeEditor', permission: 'codeEditor', color: '#eef2f3' },
  { key: 'etlEditor', label: 'עורך ETL', icon: <CodeIcon fontSize="inherit" />, route: '/admin/etlEditor', permission: 'etlEditor', color: '#eef2f3' },
  { key: 'editHtmlTemplates', label: 'עורך HTML', icon: <CodeIcon fontSize="inherit" />, route: '/admin/editHtmlTemplates', permission: 'editHtmlTemplates', color: '#eef2f3' },
];


const Menu = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const  userDetails  = useUserStore(state => state.userDetails);
  
  

  const renderMenuItems = () => {
    return mockMenuItems
      .filter(item => !item.permission || userDetails.permissions.includes(item.permission))
      .map((item) => (
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
