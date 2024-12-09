import eventBus from "../../kadabrix/event";
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

eventBus.on("notification",  (payload) => {
  eventBus.emit("injectComponent", ()=><DialogComponent payload={payload}/>);
});




const DialogComponent = ({payload}) => {
  const [open, setOpen] = useState(true);
  const handleClose = () =>{ 
    setOpen(false);
  }

  return (
    <div>
    

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>הודעה חדשה {payload.notification.title}</DialogTitle>
        <DialogContent>
          {payload.notification.body}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>אישור</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

