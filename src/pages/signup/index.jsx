import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import kdb from '../../kadabrix/kadabrix';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    const { user, error } = await kdb.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccessDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate('/login'); // Optionally navigate to login or another page
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
        הרשמה
      </Typography>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
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
          inputProps={{ dir: 'ltr' }}
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
          inputProps={{ dir: 'ltr' }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="אשר סיסמה"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputProps={{ dir: 'ltr' }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          הרשמה
        </Button>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button href="/login" variant="body2">
              כבר יש לך חשבון? התחבר
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={successDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">ברוכים הבאים למערכת קדבריקס</DialogTitle>
        <DialogContent>
          <Typography>
            נרשמת בהצלחה. עליך לאשר את המייל שנשלח אליך.
            <br />
            אנחנו כבר יודעים שנרשמת ונאשר אותך בהקדם.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignUp;
