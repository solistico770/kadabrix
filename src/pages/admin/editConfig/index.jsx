import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Search, Plus, Save, Trash2, X, Check, AlertCircle } from 'lucide-react';

const ConfigManager = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newConfig, setNewConfig] = useState({
    name: '',
    value: '',
    desc: '',
    type: 'text',
    protected: false
  });

  // Fetch configurations
  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await kdb.run({
        module: "configEditor",
        name: "readConfig",
        data: {}
      });
      setConfigs(response.configs);
      setError(null);
    } catch (err) {
      setError("Failed to load configurations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCreateConfig = async () => {
    try {
      setLoading(true);
      await kdb.run({
        module: "configEditor",
        name: "createConfig",
        data: newConfig
      });
      showSuccess('Configuration created successfully');
      setShowCreateForm(false);
      setNewConfig({
        name: '',
        value: '',
        desc: '',
        type: 'text',
        protected: false
      });
      await fetchConfigs();
    } catch (err) {
      setError("Failed to create configuration");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [editedConfigs, setEditedConfigs] = useState({});
  const [savingConfigs, setSavingConfigs] = useState({});

  const handleConfigChange = (id, changes) => {
    setEditedConfigs(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...changes
      }
    }));
  };

  const handleSaveConfig = async (id) => {
    try {
      setSavingConfigs(prev => ({ ...prev, [id]: true }));
      const changes = editedConfigs[id];
      if (!changes) return;

      await kdb.run({
        module: "configEditor",
        name: "updateConfig",
        data: {
          id: id,
          value: changes.value ?? configs.find(c => c.id === id)?.value,
          protected: changes.protected ?? configs.find(c => c.id === id)?.protected
        }
      });
      showSuccess('Configuration updated successfully');
      await fetchConfigs();
      setEditedConfigs(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (err) {
      setError("Failed to update configuration");
      console.error(err);
    } finally {
      setSavingConfigs(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      setLoading(true);
      await kdb.run({
        module: "configEditor",
        name: "deleteConfig",
        data: { id }
      });
      showSuccess('Configuration deleted successfully');
      await fetchConfigs();
    } catch (err) {
      setError("Failed to delete configuration");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConfigs = configs.filter(config => 
    config.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.value?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading configurations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Configurations</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your system configurations and settings</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Config
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search configurations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
            dir="ltr"
          />
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 flex items-center animate-fade-in">
            <Check className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Configuration</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input
                    type="text"
                    value={newConfig.name}
                    onChange={e => setNewConfig({...newConfig, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Configuration name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <textarea
                    value={newConfig.value}
                    onChange={e => setNewConfig({...newConfig, value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Configuration value"
                    rows="3"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newConfig.desc}
                    onChange={e => setNewConfig({...newConfig, desc: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Description of the configuration"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newConfig.type}
                    onChange={e => setNewConfig({...newConfig, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newConfig.protected}
                    onChange={e => setNewConfig({...newConfig, protected: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Protected</label>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCreateConfig}
                  disabled={!newConfig.name}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Configurations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConfigs.map((config) => (
            <div
              key={config.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-500">{config.type}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteConfig(config.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{config.desc}</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <textarea
                      type="text"
                      value={(editedConfigs[config.id]?.value ?? config.value) || ''}
                      onChange={(e) => handleConfigChange(config.id, { value: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                      rows="3"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editedConfigs[config.id]?.protected ?? config.protected}
                        onChange={(e) => handleConfigChange(config.id, { protected: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      <label className="ml-2 block text-sm text-gray-900">Protected</label>
                    </div>
                    
                    {editedConfigs[config.id] && (
                      <button
                        onClick={() => handleSaveConfig(config.id)}
                        disabled={savingConfigs[config.id]}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors duration-200"
                      >
                        {savingConfigs[config.id] ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;