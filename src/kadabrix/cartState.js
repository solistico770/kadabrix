// HelloWorldContext.js
import React, { createContext, useState } from 'react';

// Create a context for the hello world message
const HelloWorldContext = createContext();

// Create a provider component
export function HelloWorldProvider({ children }) {
  const [message, setMessage] = useState({});

  return (
    <HelloWorldContext.Provider value={{ message, setMessage }}>
      {children}
    </HelloWorldContext.Provider>
  );
}

export default HelloWorldContext;
