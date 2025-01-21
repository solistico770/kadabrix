// App.js
import React from 'react';
import { useEffect } from 'react';  

import { create } from 'zustand';

const useStore = create((set) => ({
  value: 'Initial Value',
  setValue: (newValue) => set({ value: newValue }),
}));


const App = () => {


  useEffect(() => {

      setInterval(() => {
        useStore.getState().setValue('NO SET');

      }, 1000);

  }, []);


  return (
    <div>
      <h1>Global State Management with Zustand</h1>
      <SetterComponent />
      <ReaderComponent />
    </div>
  );
};







const ReaderComponent = () => {
  const value = useStore((state) => state.value);

  return <div>Current State: {value}</div>;
};


const SetterComponent = () => {
  const setValue = useStore((state) => state.setValue);

  const handleClick = () => {
    setValue('Updated Value from SetterComponent');
  };

  return (
    <button onClick={handleClick}>
      Update State
    </button>
  );
};

export default App;
