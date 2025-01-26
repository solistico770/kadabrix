import eventBus from "./event";
import React, { useEffect } from "react";
import { Toaster, toast } from 'sonner';

const DialogComponent = () => {
  useEffect(() => {
    // Registering to the "toast" event
    const unpublish = eventBus.on("toast", ({ type = "success", title, text }) => {
      // Handling the toast type
      switch (type) {
        case "success":
          toast.success(title, {
            description: text,
          });
          break;
        case "inform":
          toast(title, {
            description: text,
          });
          break;
        case "error":
          toast.error(title, {
            description: text,
          });
          break;
        default:
          toast(title, {
            description: text,
          });
      }
    });

    // Cleanup event listeners
    return () => {
      unpublish();
    };
  }, []);

  return (
    <Toaster
      position="top-right"
      expand={true}
      className="rtl-toaster" // Add a custom clas
      richColors
    />
  );
};

export default DialogComponent;
