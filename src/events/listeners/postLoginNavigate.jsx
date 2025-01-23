import eventBus from "../../kadabrix/event";
import {useUserStore} from "../../kadabrix/userState";
import {useCartStore } from "../../kadabrix/cartState";


eventBus.on("postAuthStateChange", (payload) => {
  const userState = useUserStore.getState().userDetails
  eventBus.emit("navigate", userState.config.defaultScreen);

});
