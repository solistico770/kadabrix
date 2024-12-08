import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, Typography, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import kdb from '../../kadabrix/kadabrix';
import KdbInput from './kdbInput';
import RolesPopup from './rolesPopup';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newErpCust, setNewErpCust] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await kdb.run({
        "module": "kdb_users",
        "name": "getUsers"
      });

      setUsers(data);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (email) => {
    setEditing(email);
    const user = users.find(user => user.email === email);
    setNewErpCust(user.erpcust);
  };

  const handleSave = async (email) => {
    try {

      await kdb.run({
        "module": "kdb_users",
        "name": "setUser",
        "data": { email: email, erpcust: newErpCust }
      });

      fetchUsers();
      setEditing(null);
    } catch (err) {
      setError(err.message);
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
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        ניהול משתמשים
      </Typography>
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>אימייל</TableCell>
              <TableCell>משתמש ERP</TableCell>
              <TableCell>הרשאות</TableCell>
              <TableCell>הרשאות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  
                  <KdbInput 
                  
                   initialValue={user.erpcust} 
                   table="kadabrix_user_config"
                   idName="email" 
                    idValue={user.email}  
                    editField="erpcust" />

                </TableCell>
                <TableCell>
                {user.roles}


                </TableCell>

                <TableCell>

                    <RolesPopup email={user.email}  />

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
