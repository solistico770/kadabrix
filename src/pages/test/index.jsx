import { set } from "date-fns";
import { useEffect,useState } from "react";
import eventBus from "../../kadabrix/event";
import { Button } from "@mui/material";




const App = () => {
  
  


  return (
    <div>
      <Button 
        onClick={() => {
          eventBus.emit("openDialog");

        }
      }
      > open </Button>

    </div>
  );
};

export default App;
