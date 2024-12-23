import eventBus from "../../kadabrix/event";
import kdb from "../../kadabrix/kadabrix";
import injectComponent from "../../kadabrix/injectComponent";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

let cartData;
let userState;
let isOpen = false;

eventBus.on("updateCart", (payload) => {
  cartData = payload;
  checkCart();
});

eventBus.on("updateUserState", (payload) => {
  userState = payload;
  checkCart();
});

const checkCart = () => {
  if (
    !isOpen &&
    userState.config.custom_aluf_require_details === "true" &&
    !cartData.alufCustDetails
  ) {
    isOpen = true;
    injectComponent(() => <DialogComponent />);
  }
};

const DialogComponent = () => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleClose = () => {
    setOpen(false);
    isOpen = false;
  };

  const handleConfirm = async () => {
    try {
      await kdb.run({
        module: "kdb_cart",
        name: "aluf_add_user_details",
        data: { name, phone },
      });
      handleClose(); // Close dialog after success
      isOpen = false;
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  const isConfirmEnabled = name.trim() !== "" && phone.trim() !== "";

  const handlePhoneChange = (e) => {
    const input = e.target.value
    setPhone(input);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        fullWidth
      >
        <DialogTitle>הזן פרטי לקוח</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם לקוח"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="טלפון"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={handlePhoneChange}
            inputProps={{
              dir: "ltr", // Left-to-right input for phone
            }}

            type="tel"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
