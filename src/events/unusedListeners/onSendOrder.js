import eventBus from "../../../kadabrix/event";
import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Install this package or create a custom confirm dialog.
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS for react-confirm-alert.

eventBus.on("prePlaceOrder", async (msg) => {
  alert(msg)
  let confirmed = confirmObligoDialog();
  if (!confirmed) {
    throw new Error("User canceled due to obligo issue");
  }
});


// Helper function to show a confirm dialog
function confirmObligoDialog() {
  return new Promise((resolve) => {
    confirmAlert({
      title: "Obligo Issue",
      message: "Your cart exceeds the obligo. Do you want to proceed anyway?",
      buttons: [
        {
          label: "Yes",
          onClick: () => resolve(true),
        },
        {
          label: "No",
          onClick: () => resolve(false),
        },
      ],
    });
  });
}

  
