import React, { useState, useEffect } from 'react';
import { 
  Button, Checkbox, FormControlLabel, List, ListItem, ListItemText, 
  ListItemSecondaryAction, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Alert
} from '@mui/material';
import kdb from '../../kadabrix/kadabrix';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const PermissionsPopup = (props) => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [openNewPermission, setOpenNewPermission] = useState(false);
  const [error, setError] = useState(null);
  const [newPermission, setNewPermission] = useState({
    permission: '',
    description: ''
  });

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleOpen = () => setOpen(true);

  const toggleRole = async (permission, val) => {
    try {
      await kdb.run({
        module: "kdb_roles",
        name: "setUserPermission",
        data: { role: props.role, permission: permission, value: val }
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPermission = async () => {
    try {
      await kdb.run({
        module: "kdb_roles",
        name: "addPermission",
        data: newPermission
      });
      setOpenNewPermission(false);
      setNewPermission({ permission: '', description: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePermission = async (permission) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הרשאה זו?')) {
      try {
        await kdb.run({
          module: "kdb_roles",
          name: "deletePermission",
          data: { permission }
        });
        loadData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  const loadData = async () => {
    try {
      let res = await kdb.run({
        module: "kdb_roles",
        name: "getAllPermissions",
        data: { role: props.role }
      });
      setRoles(res);
      setError(null);
    } catch (error) {
      setError("Failed to load permissions: " + error.message);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" startIcon={<SecurityIcon />}>
        נהל הרשאות
      </Button>
      
      <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>הרשאות</span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewPermission(true)}
              size="small"
            >
              הוסף הרשאה
            </Button>
          </div>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <List>
            {roles.map((role, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={role.permission}
                  secondary={role.description}
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    onClick={() => {
                      toggleRole(role.permission, (role.ispermission === 1) ? 0 : 1);
                    }}
                    control={<Checkbox checked={role.ispermission === 1} />}
                    label=""
                  />
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDeletePermission(role.permission)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* New Permission Dialog */}
      <Dialog 
        open={openNewPermission} 
        onClose={() => setOpenNewPermission(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>הוסף הרשאה חדשה</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם ההרשאה"
            fullWidth
            variant="outlined"
            value={newPermission.permission}
            onChange={(e) => setNewPermission({ 
              ...newPermission, 
              permission: e.target.value 
            })}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            margin="dense"
            label="תיאור"
            fullWidth
            variant="outlined"
            value={newPermission.description}
            onChange={(e) => setNewPermission({ 
              ...newPermission, 
              description: e.target.value 
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewPermission(false)}>ביטול</Button>
          <Button onClick={handleAddPermission} variant="contained">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PermissionsPopup;