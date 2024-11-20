import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';

const JsonViewer = () => {
  const [module, setModule] = useState('');
  const [controller, setController] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [retData, setRetData] = useState(null);

  useEffect(() => {
    const savedModule = localStorage.getItem('module');
    const savedController = localStorage.getItem('controller');
    const savedJsonData = localStorage.getItem('jsonData');

    if (savedModule) setModule(savedModule);
    if (savedController) setController(savedController);
    if (savedJsonData) setJsonData(savedJsonData);
  }, []);

  useEffect(() => {
    localStorage.setItem('module', module);
  }, [module]);

  useEffect(() => {
    localStorage.setItem('controller', controller);
  }, [controller]);

  useEffect(() => {
    localStorage.setItem('jsonData', jsonData);
  }, [jsonData]);

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    try {
      const parsedJson = JSON.parse(e.target.value);
      setRetData(parsedJson);
    } catch (error) {
      setRetData(null);
    }
  };

  const runController = async (module,controller, jsonData) => {
    setRetData([])
    console.log("Running controller:", controller);
    console.log("With JSON data:", jsonData);
    try {
    let data = await kdb.run({
      "module": module,
      "name": controller,
      "data": jsonData
    });
    setRetData(data)
  } catch(err) {

    setRetData({err:true,'error':err})
  }
    
  };

  return (
    <div style={{ direction: 'ltr', textAlign: 'left', padding: '20px' }}>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="module">Module Name: </label>
        <input
          type="text"
          id="module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="controller">Controller Name: </label>
        <input
          type="text"
          id="controller"
          value={controller}
          onChange={(e) => setController(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="json">JSON Data: </label>
        <textarea
          id="json"
          value={jsonData}
          onChange={handleJsonChange}
          rows="10"
          cols="50"
          style={{ padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => runController(module, controller, jsonData)} style={{ padding: '10px 20px' }}>
          Run
        </button>
      </div>
      <div>
        <h3>Returned Data:</h3>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
          {retData ? JSON.stringify(retData, null, 2) : 'Invalid JSON or No Data'}
        </pre>
      </div>
    </div>
  );
};

export default JsonViewer;