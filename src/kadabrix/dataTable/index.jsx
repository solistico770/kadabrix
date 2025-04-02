import React, { useState, useEffect } from 'react';
import kdb from '../kadabrix';
import eventBus from '../event';
import { Search, Settings, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTableScreen = ({ config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'custDes', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const [showSettings, setShowSettings] = useState(false);
  const [fieldsConfig, setFieldsConfig] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // טעינת קונפיגורציית השדות מ-localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem(`fieldsConfig_${config.screenName}`);
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      const mergedConfig = config.fields.map(field => {
        const savedField = parsedConfig.find(f => f.fieldName === field.fieldName);
        return savedField ? { ...field, ...savedField } : { ...field };
      });
      setFieldsConfig(mergedConfig);
    } else {
      setFieldsConfig([...config.fields]);
    }
  }, [config]);

  // טעינת נתונים כאשר משתנים העמוד, הקונפיגורציה או המיון
  useEffect(() => {
    fetchData(searchTerm);
  }, [page, fieldsConfig, sortConfig]);

  // חיפוש עם השהיה (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        setPage(1);
        fetchData(searchTerm);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchData = async (search) => {
    setIsLoading(true);
    try {
      const searchableFields = fieldsConfig
        .filter(field => field.dSearchable)
        .map(field => field.fieldName);

      const response = await kdb.run({
        module: config.apiName.module,
        name: config.apiName.name,
        data: { 
          search,
          searchableFields,
          sortBy: sortConfig.key,
          sortDir: sortConfig.direction,
          page,
          pageSize: limit
        }
      });

      setData(response.customers || []);
      setTotalPages(Math.ceil((response.totalCount || 0) / limit));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      eventBus.emit("toast", { title: "שגיאה", text: "אירעה שגיאה בטעינת הנתונים" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    const field = fieldsConfig.find(f => f.fieldName === key);
    if (!field?.dOrder) return; // בדיקה אם העמודה ניתנת למיון

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPage(1); // חזרה לעמוד הראשון לאחר שינוי מיון
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const updateFieldConfig = (index, key, value) => {
    const updatedConfig = [...fieldsConfig];
    updatedConfig[index][key] = value;
    setFieldsConfig(updatedConfig);
    localStorage.setItem(`fieldsConfig_${config.screenName}`, JSON.stringify(updatedConfig));
  };

  const visibleFields = fieldsConfig
    .filter(field => field.dVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
      
      

        {/* שורת חיפוש וכפתור הגדרות */}
        <div className="sticky top-0 z-20 mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 py-4 flex justify-between items-center rounded-xl shadow-lg">
          <div className="relative max-w-xl w-full">
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 border-2 border-indigo-300 rounded-full focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 text-lg shadow-md transition-all duration-300"
            />
            <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 bg-indigo-600 text-white rounded-full flex items-center shadow-lg hover:bg-indigo-700 transition-all duration-300"
          >
            <Settings size={24} className="ml-2" /> הגדרות
          </button>
        </div>

        {/* מצב טעינה */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <motion.div
              className="w-16 h-16 border-t-4 border-indigo-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* טבלת נתונים */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto overflow-x-auto"
          >
            <table className="w-full bg-white">
              <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                <tr>
                  {visibleFields.map(field => (
                    <th
                      key={field.fieldName}
                      className={`p-4 text-right ${field.dOrder ? 'cursor-pointer hover:bg-indigo-700' : ''} transition-colors duration-200 ${field.type === 'number' ? 'text-left' : ''}`}
                      onClick={() => field.dOrder && handleSort(field.fieldName)} // מיון רק אם dOrder=true
                    >
                      <div className="flex items-center justify-between">
                        <span>{field.title}</span>
                        {sortConfig.key === field.fieldName && field.dOrder && (
                          <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-right">פרטים</th>
                </tr>
              </thead>
              <tbody className="relative z-0">
                <AnimatePresence>
                  {data.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={visibleFields.length + 1} className="p-6 text-center text-gray-500">
                        לא נמצאו נתונים
                      </td>
                    </motion.tr>
                  ) : (
                    data.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b hover:bg-indigo-50 transition-colors duration-200"
                      >
                        {visibleFields.map(field => (
                          <td
                            key={field.fieldName}
                            className={`p-4 ${field.type === 'number' ? 'text-left' : 'text-right'}`}
                          >
                            {field.text ? (
                              <div onClick={() => field.onclick && field.onclick(item)}>
                                {field.text}
                              </div>
                            ) : (
                              item[field.src] !== undefined ? item[field.src] : 'N/A'
                            )}
                          </td>
                        ))}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRowClick(item)}
                            className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-all duration-300"
                          >
                            <Info size={20} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* ניווט בין עמודים */}
        {!isLoading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="mx-6 text-lg font-semibold text-indigo-800">
              עמוד {page} מתוך {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page === totalPages}
              className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* חלון הגדרות */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl w-full"
            >
              <h2 className="text-3xl font-bold mb-6 text-indigo-800">הגדרות שדות</h2>
              <table className="w-full">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="p-3 text-right">שם השדה</th>
                    <th className="p-3 text-center">מוצג</th>
                    <th className="p-3 text-center">ניתן לחיפוש</th>
                    <th className="p-3 text-center">סדר</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsConfig.map((field, index) => (
                    <tr key={field.fieldName} className="border-b hover:bg-indigo-50 transition-colors duration-200">
                      <td className="p-3 text-right">{field.title}</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={field.dVisible}
                          onChange={(e) => updateFieldConfig(index, 'dVisible', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={field.dSearchable}
                          onChange={(e) => updateFieldConfig(index, 'dSearchable', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={field.order}
                          onChange={(e) => updateFieldConfig(index, 'order', Number(e.target.value))}
                          className="w-16 p-2 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setShowSettings(false)}
                className="mt-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
              >
                סגור
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* חלון פרטים */}
        {showDetails && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              <h2 className="text-3xl font-bold mb-6 text-indigo-800">פרטי לקוח</h2>
              <div className="space-y-4">
                {config.fields.map(field => (
                  <div key={field.fieldName} className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-indigo-700">{field.title}</span>
                    <span className="text-gray-800">{selectedItem[field.src] !== undefined ? selectedItem[field.src] : 'N/A'}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="mt-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
              >
                סגור
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DataTableScreen;

