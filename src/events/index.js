const runListeners = async () => {
    const eventModules = import.meta.glob('./listeners/*.js?'); // Adjust the path if necessary
  
    for (const path in eventModules) {
      const module = await eventModules[path]();
      if (typeof module.default === 'function') {
        module.default(); // Execute the default exported function
      }
    }
  };
  
  export default runListeners
