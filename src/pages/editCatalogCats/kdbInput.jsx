import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, Typography, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import kdb from '../../kadabrix/kadabrix';

const Users = (props) => {


  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(props.initialValue);


  const handleEdit = (email) => {
    setEditing(true);
    const user = users.find(user => user.email === email);
    setNewValue(user.erpcust);
  };


  
  const handleSave = async () => {
    try {

      await kdb.run({
        "module": "editCatalogCats",
        "name": "setValue",
        "data": { 
                 editField: props.editField,
                 idValue: props.idValue,
                 newValue:newValue
                }
      });

      setEditing(false);
    } catch (err) {
      alert(err);
    }
  };



  return (
    <span
      onDoubleClick={(e) => setEditing(true)}
    >
          
          {editing ? (
<div>
                <TextField
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                />

                <IconButton onClick={() => handleSave()}>
                      <EditIcon />
                    </IconButton>

                  </div>

                    




          ): (

            <div>
            {newValue?newValue:'(*)'} 
            
            </div>


          ) 
          }
          
    </span>
    
                
  )
};

export default Users;
