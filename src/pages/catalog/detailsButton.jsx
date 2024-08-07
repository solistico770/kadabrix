import React, { useState, useEffect } from 'react';
import { Button , CircularProgress, FormControlLabel, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import kdb from '../../kadabrix/kadabrix';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import SecurityIcon from '@mui/icons-material/Security';


const Users = (props) => {
  const handleClose =()=> {setOpen(false)}
  const handleOpen  =()=> {setOpen(true)}
  const [partData,setPartData] = useState([])
  const [open, setOpen] = useState(false);
  const [ isLoading , setIsLoading ] = useState(false);


  useEffect(() => {
    if (open==true)  loadData();

  }, [open]);
  
  const loadData = async () => {
    setIsLoading(true)

    try {
      
      let res = await kdb.run({
        "module": "catalog",
        "name": "getInventory",
        "data": {part:props.part,cache:true}
      });
      setPartData(res);
    } catch(e){}
    try {
      let res = await kdb.run({
        "module": "catalog",
        "name": "getInventory",
        "data": {part:props.part}
      });
      setPartData(res);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Failed to load roles:", error);
    }

    
  };

  return (
    <div>
    <Button onClick={handleOpen} variant="outlined" startIcon={<SecurityIcon />}>מלאי</Button>
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>פרטי מלאי {props.partName} {props.partDes}  </DialogTitle>
      {isLoading?
            <CircularProgress
            size={68}
            sx={{
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />

        :''}

{partData.map((part, index) => (

    <List>
        <ListItem>
          <ListItemText
            primary={part.name}
            secondary={part.bal}
          />
          <ListItemSecondaryAction>
          </ListItemSecondaryAction>
        </ListItem>
    </List>

))}

    <DialogActions></DialogActions>
    </Dialog>
    </div>

  );
};

export default Users;
