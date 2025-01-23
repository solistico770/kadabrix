

const runListeners = async () => {
    
  
    const eventModules2 = import.meta.glob('./listeners/*.js?'); // Adjust the path if necessary
    const eventModules1 = import.meta.glob('./custom/*.js?'); // Adjust the path if necessary
    
    const eventModules = { ...eventModules1, ...eventModules2 };


    for (const path in eventModules) {
    try {  
      const module = await eventModules[path]();
      if (typeof module.default === 'function') {
        module.default(); // Execute the default exported function
      }
    }  catch (error) {
      console.error(`Error in module ${path}: ${error}`);
    } 
  }
  
  };
  
  export default runListeners
