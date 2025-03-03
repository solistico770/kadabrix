import kdb from '../../../kadabrix/kadabrix';
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const JsonViewer = () => {
  const [module, setModule] = useState('');
  const [controller, setController] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [retData, setRetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    localStorage.setItem('controller', controller);
    localStorage.setItem('jsonData', jsonData);
  }, [module, controller, jsonData]);

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    try {
      const parsedJson = JSON.parse(e.target.value);
      setRetData(parsedJson);
      setError(null);
    } catch (error) {
      setError('Invalid JSON format');
      setRetData(null);
    }
  };

  const runController = async (module, controller, jsonData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await kdb.run({
        module,
        name: controller,
        data: JSON.parse(jsonData),
      });
      setRetData(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setRetData({ err: true, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
          JSON Control Panel
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Module Name</span>
              <input
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter module name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-300">Controller Name</span>
              <input
                type="text"
                value={controller}
                onChange={(e) => setController(e.target.value)}
                className="mt-1 block w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter controller name"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-300">JSON Data</span>
              <textarea
                value={jsonData}
                onChange={handleJsonChange}
                rows="8"
                className="mt-1 block w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                placeholder="Enter JSON data"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={() => runController(module, controller, jsonData)}
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-red-500 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Run Controller'
          )}
        </button>

        {retData && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-purple-400">Returned Data:</h2>
            <pre className="block p-4 bg-gray-800 rounded-lg overflow-x-auto font-mono text-sm">
              {JSON.stringify(retData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;