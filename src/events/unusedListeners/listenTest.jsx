import eventBus from "../../kadabrix/event";
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

eventBus.on("openDialog",  () => {
  eventBus.emit("injectComponent", DialogComponent);
});

const DialogComponent = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () =>{ 
    
    setOpen(false);
    eventBus.emit("injectComponent", null);



  }

  return (
    <div>
    

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Simple Dialog</DialogTitle>
        <DialogContent>
          <p>This is a simple and functional dialog component!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

