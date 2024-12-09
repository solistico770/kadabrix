import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Layout from './layout/layout';
import './App.css'
import React, { useEffect, useState } from "react";
import eventBus from "./kadabrix/event";

let Injected=[];
let runOnce = false;

function App() {
  const [rerender, setRerender] = useState({});
  useEffect(() => {
    if (!runOnce){
      eventBus.on("injectComponent",  (Component) => {
        Injected.push(Component);   
        setRerender({});
      });
      runOnce = true;
    } 
  }, []);


  
  







  return (
    <div className="root">
      {Injected.map((Component, index) => (<Component key={index} rerender={rerender}/>))}
      <Router>
          <Layout />
          <Routes/>
      </Router>
    </div>
  );
}
export default App;
