import { create } from 'zustand';
import kdb from "./kadabrix"
import eventBus from "./event";



export const useUserStore = create((set) => ({
  userDetails: { roles: [], permissions: [], user: null, loaded: false },
  setValue: (newValue) => {
    set({ userDetails: newValue })
  }
}));



eventBus.on("onAuthStateChange", async (session) => {
  
    if (session?.user?.email) {

      
   const data = await  kdb.run({
      module: "kdb_users",
      name: "getUserSpecs",
      data: {},
    })
    
      const userState = {
        loaded: true,
        user: session?.user || null,
        roles: data.roles, permissions: data.permissions, config: data.config
      }
  
      useUserStore.getState().setValue(userState);
      
   
  } 
});

