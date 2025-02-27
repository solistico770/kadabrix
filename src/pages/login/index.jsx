import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  InputAdornment,
  IconButton,
  Paper,
  Divider
} from '@mui/material';

// Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShieldIcon from '@mui/icons-material/Shield';
import LoginIcon from '@mui/icons-material/Login';

import kdb from '../../kadabrix/kadabrix';
import { useUserStore } from "../../kadabrix/userState";

const Login = () => {
  const userState = useUserStore(state => state.userDetails);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await kdb.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
      } else if (data?.session) {
        console.log('User authenticated:', data.session.user);
        
        // Send Supabase credentials to Service Worker
        sendCredentialsToServiceWorker(data.session.access_token);
        
        // Navigate to default screen
        navigate(userState.config.defaultScreen);
      }
    } catch (err) {
      setError('התרחשה שגיאה בעת ההתחברות. אנא נסה שוב מאוחר יותר.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendCredentialsToServiceWorker = async (accessToken) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

      console.log('Sending credentials to Service Worker');

      navigator.serviceWorker.controller.postMessage({
        type: 'SUPABASE_CREDENTIALS',
        payload: { supabaseUrl, supabaseKey, accessToken },
      });
    } else {
      console.warn('No active Service Worker to receive credentials');
    }
  };

  return (
    <Box className="min-h-screen bg-violet-600 flex items-center justify-center p-4">
      <Paper 
        elevation={3} 
        className="w-full max-w-md bg-white rounded-md overflow-hidden"
      >
        <Box className="p-6 flex flex-col items-center" dir="rtl">
          {/* Logo */}
          <Typography variant="h5" component="h1" className="font-bold text-blue-600 mb-4">
            Kadabrix <ShieldIcon className="align-middle ml-1" />
          </Typography>
          
          {/* Lock Icon */}
          <Box className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <LockOutlinedIcon className="text-white" fontSize="large" />
          </Box>
          
          {/* Header */}
          <Typography variant="h5" component="h2" className="font-bold mb-1">
            כניסה למערכת
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-6 text-center">
            ברוכים הבאים! אנא התחברו כדי להמשיך
          </Typography>

          {/* Error message */}
          {error && (
            <Alert severity="error" className="mb-4 w-full">
              {error}
            </Alert>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="w-full">
            <Box className="mb-6 relative">
              <Typography variant="caption" className="mb-1 block text-gray-600">
                דוא״ל *
              </Typography>
              <TextField
                id="email"
                type="email"
                variant="outlined"
                fullWidth
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f0f4f8'
                  }
                }}
              />
            </Box>

            <Box className="mb-6 relative">
              <Typography variant="caption" className="mb-1 block text-gray-600">
                סיסמה *
              </Typography>
              <TextField
                id="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f0f4f8'
                  }
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className="mb-3"
              sx={{
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                },
                py: 1.5
              }}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </Button>
            
            {/* Forgot password link */}
            <Box className="text-center mb-4">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                שכחת את הסיסמה?
              </Link>
            </Box>
          
            {/* Divider */}
            <Divider className="mb-4">
              <Typography variant="body2" color="textSecondary">
                או
              </Typography>
            </Divider>

            {/* Sign up button */}
            <Button
              component={Link}
              to="/signup"
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
            >
              הרשמה לחשבון חדש
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;