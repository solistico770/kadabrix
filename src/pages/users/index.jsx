import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, Typography, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import kdb from '../../kadabrix/kadabrix';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newErpCust, setNewErpCust] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await kdb.rpc('execute_user_query', {
          query_text: `SELECT * FROM get_user_info()`,
        });
        if (error) {
          setError(error.message);
        } else {
          setUsers(data.map(item => item.result));
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (email) => {
    setEditing(email);
    const user = users.find(user => user.email === email);
    setNewErpCust(user.erpcust);
  };

  const handleSave = async (email) => {
    try {
      const user = users.find(user => user.email === email);
      const userId = user.user_id; // Assuming you have user_id in the result
      const query = user.erpcust
        ? `UPDATE user_config SET "erpcust" = '${newErpCust}' WHERE "user_id" = '${userId}'`
        : `INSERT INTO user_config (user_id, erpcust) VALUES ('${userId}', '${newErpCust}')`;

      await kdb.rpc('execute_user_query', { query_text: query });
      setUsers(users.map(user => (user.email === email ? { ...user, erpcust: newErpCust } : user)));
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
              <TableCell>ERP Cust</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editing === user.email ? (
                    <TextField
                      value={newErpCust}
                      onChange={(e) => setNewErpCust(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    user.erpcust
                  )}
                </TableCell>
                <TableCell>
                  {editing === user.email ? (
                    <IconButton onClick={() => handleSave(user.email)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(user.email)}>
                      <EditIcon />
                    </IconButton>
                  )}
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
