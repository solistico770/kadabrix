import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import kdb from '../../../kadabrix/kadabrix';

const Users = (props) => {
  const [configs, setConfigs] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loadData = async () => {
    try {
      const res = await kdb.run({
        module: "kdb_roles",
        name: "getAllConfig",
        data: { role: props.role },
      });
      setConfigs(res);
    } catch (error) {
      console.error("Failed to load configs:", error);
    }
  };

  const setLocalConfig = (conf, val) => {
    const updatedConfigs = configs.map((c) =>
      c.name === conf.name ? { ...c, rvalue: val } : c
    );
    setConfigs(updatedConfigs);
  };

  const setConfig = async (config, val) => {
    await kdb.run({
      module: "kdb_roles",
      name: "setRoleConfig",
      data: { role: props.role, config, val },
    });
    
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" startIcon={<SecurityIcon />}>
        קונפיגורציה
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <DialogTitle>קונפיגורציה</DialogTitle>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם קונפיגורציה</TableCell>
                <TableCell>תיאור </TableCell>

                <TableCell>מערכת</TableCell>
                <TableCell>לפי תפקיד</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {configs.map((conf, index) => (
                <TableRow key={index}>
                  <TableCell>{conf.name}</TableCell>
                  <TableCell>{conf.desc}</TableCell>

                  <TableCell>{conf.value}</TableCell>
                  <TableCell>
                    <TextField
                      value={conf.rvalue || ''}
                      onChange={(e) => setLocalConfig(conf, e.target.value)}
                      onBlur={(e) => setConfig(conf.name, e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ dir: 'ltr' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </div>
  );
};

export default Users;