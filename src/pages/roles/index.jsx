import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, Typography, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import kdb from '../../kadabrix/kadabrix';
import PermissionsPopup  from './permissionsPopup';
import ConfigPopup from './configPopup';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  
  const fetchUsers = async () => {
    try {
      const data = await kdb.run({
        "module": "kdb_roles",
        "name": "getRoles"
      });

      setUsers(data);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  

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
        ניהול תפקידים
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
              <TableCell>תפקיד</TableCell>
              <TableCell>תיאור</TableCell>
              <TableCell>הרשאות</TableCell>
              <TableCell>הרשאות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.role}>
                <TableCell>{user.role}</TableCell>
               
                <TableCell>
                {user.description}


                </TableCell>

                <TableCell>
                
                <ConfigPopup role={user.role}  />




                </TableCell>

                <TableCell>

                    <PermissionsPopup role={user.role}  />

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
