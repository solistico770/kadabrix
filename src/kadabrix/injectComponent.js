
import eventBus from "./event";

const injectComponent = (component)=>{
    eventBus.emit("injectComponent", component );
}

export default injectComponent;

