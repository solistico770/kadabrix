import React, { createContext, useState , useEffect } from 'react';
import kdb from "../kadabrix/kadabrix"
import { requestForToken } from "../kadabrix/firebase";

// Create the context
export const userContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

const [userDetails, setUserDetails] = useState({roles:[],user:null,loaded:false});
 

let hasRun = false;


useEffect(() => {
   // Flag to ensure the effect runs only once for a session

  const { data: { subscription } } = kdb.auth.onAuthStateChange((event, session) => {
      if (!session?.user?.email || session?.user?.email === userDetails?.user?.email) {
          return; // Skip if session is invalid or the same user is already handled
      }


      if (!hasRun) {
          hasRun = true; // Mark as executed for this session

          const run = async () => {
              // Fetch user roles and update state
              const data = await kdb.run({
                  module: "kdb_users",
                  name: "getRoles",
                  data: {},
              });

              setUserDetails({
                  loaded:true,
                  user: session?.user || null,
                  roles: data.map(item => item.role),
              });

              // Request and register token
              const tokenID = await requestForToken();
              await kdb.run({
                  module: "kadabrix_fcm",
                  name: "register_token",
                  data: { token: tokenID },
              });
          };

          run();
      }
  });

}, []); // Empty dependency array to run only on mount






  


  return (
    <userContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </userContext.Provider>
  );
};
