import eventBus from "../../kadabrix/event";
import {useUserStore} from "../../kadabrix/userState";



eventBus.on("postAuthStateChange", (payload) => {
  const userState = useUserStore.getState().userDetails
  if (window.location.pathname==''||window.location.pathname=='/' ||window.location.pathname=='/login') {
  eventBus.emit("navigate", userState.config.defaultScreen);
  }
  
  
});
