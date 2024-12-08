import React, { useState, useEffect } from 'react';
import { Button , Checkbox, FormControlLabel, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import kdb from '../../kadabrix/kadabrix';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import SecurityIcon from '@mui/icons-material/Security';


const Users = (props) => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClose =()=> {setOpen(false)}
  const handleOpen  =()=> {setOpen(true)}

 

  const toggleRole = async (permission, val) => {
    await kdb.run({
      "module": "kdb_roles",
      "name": "setUserPermission",
      "data": { role: props.role, permission: permission, value: val }
    });
  
    loadData();
  };

  

  useEffect(() => {
    if (open==true)  loadData();

  }, [open]);

  const loadData = async () => {
    try {
      let res = await kdb.run({
        "module": "kdb_roles",
        "name": "getAllPermissions",
        "data": {role:props.role}
      });
      setRoles(res);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  return (
    <div>
    <Button onClick={handleOpen} variant="outlined" startIcon={<SecurityIcon />}>נהל הרשאות</Button>
    <Dialog onClose={handleClose} open={open}   maxWidth="md"  fullWidth   > 
      <DialogTitle>הרשאות </DialogTitle>

    <List>
      {roles.map((role, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={role.permission}
            secondary={role.description}
          />


          
          <ListItemSecondaryAction>
            <FormControlLabel
              onClick={()=>{toggleRole(role.permission,(role.ispermission===1)?0:1)}}
              control={<Checkbox checked={role.ispermission === 1} />}
              label=""
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
    </Dialog>
    </div>

  );
};

export default Users;
