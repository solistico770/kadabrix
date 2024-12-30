import React, { useState, useEffect } from 'react';
import { 
  Button, TextField, Grid, Box, Typography, Alert, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SecurityIcon from '@mui/icons-material/Security';
import kdb from '../../kadabrix/kadabrix';
import PermissionsPopup from './permissionsPopup';
import ConfigPopup from './configPopup';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [openNewRole, setOpenNewRole] = useState(false);
  const [newRole, setNewRole] = useState({ role: '', description: '' });
  
  const fetchUsers = async () => {
    try {
      const data = await kdb.run({
        module: "kdb_roles",
        name: "getRoles"
      });
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddRole = async () => {
    try {
      await kdb.run({
        module: "kdb_roles",
        name: "addRole",
        data: newRole
      });
      setOpenNewRole(false);
      setNewRole({ role: '', description: '' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRole = async (role) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תפקיד זה?')) {
      try {
        await kdb.run({
          module: "kdb_roles",
          name: "deleteRole",
          data: { role }
        });
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 8,
      p: 3,
      borderRadius: 2,
      boxShadow: 3,
      bgcolor: 'background.paper',
    }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        ניהול תפקידים
      </Typography>
      
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        onClick={() => setOpenNewRole(true)}
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      >
        הוסף תפקיד חדש
      </Button>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>תפקיד</TableCell>
              <TableCell>תיאור</TableCell>
              <TableCell>הגדרות</TableCell>
              <TableCell>הרשאות</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.role}>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.description}</TableCell>
                <TableCell>
                  <ConfigPopup role={user.role} />
                </TableCell>
                <TableCell>
                  <PermissionsPopup role={user.role} />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleDeleteRole(user.role)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New Role Dialog */}
      <Dialog open={openNewRole} onClose={() => setOpenNewRole(false)} maxWidth="sm" fullWidth>
        <DialogTitle>הוסף תפקיד חדש</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם התפקיד"
            fullWidth
            variant="outlined"
            value={newRole.role}
            onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            margin="dense"
            label="תיאור"
            fullWidth
            variant="outlined"
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewRole(false)}>ביטול</Button>
          <Button onClick={handleAddRole} variant="contained">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;