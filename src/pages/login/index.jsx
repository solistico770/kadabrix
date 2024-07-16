import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography, Avatar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import kdb from '../../kadabrix/kadabrix';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const { user, error } = await kdb.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {

  if (user) {
    const token = user.access_token; // or data.session.access_token
    const decodedToken = jwtDecode(token);
    console.log('Decoded JWT:', decodedToken);
  }
  
      navigate('/menu');
    }
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
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        כניסה
      </Typography>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="כתובת אימייל"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="סיסמה"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          כניסה
        </Button>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button href="/forgot" variant="body2">
              שכחת סיסמה?
            </Button>
          </Grid>
          <Grid item>
            <Button href="/signup" variant="body2">
              {"אין לך חשבון? הרשם"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
