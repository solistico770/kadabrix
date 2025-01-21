import kdb from "./kadabrix"
import eventBus from "./event";
let prevLogin;


const { data: { subscription } } = kdb.auth.onAuthStateChange((event, session) => {
    if (JSON.stringify(prevLogin) === JSON.stringify(session)) return;
    prevLogin = session;
    
    
    (async () =>  {
        await eventBus.emit("onAuthStateChange",session)
        await eventBus.emit("postAuthStateChange",session)
    })()


    
});

