import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from "../../../kadabrix/event";
import { Search, Loader, FileText, Phone, MapPin, UserCheck, DollarSign, Calendar, Eye } from 'lucide-react';
import DocumentPopup from './popup';

const SelectOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocID, setSelectedDocID] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchOrders(searchTerm);
      } else {
        setOrders([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch orders from API
  const fetchOrders = async (search) => {
    setIsLoading(true);
    const data = await kdb.run({
      module: 'repOrders',
      name: 'searchOrders',
      data: { search },
    });
    setOrders(data.orders);
    setIsLoading(false);
  };

  const handleSelect = async (order) => {
    eventBus.emit("navigate", "/custom/order?orderName=" + order.ordID);
  };
  
  const handleViewDetails = (docID) => {
    setSelectedDocID(docID);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDocID(null);
  };

  // Format date from Unix timestamp
  const formatDate = (unixTime) => {
    if (!unixTime) return "לא צוין תאריך";
    const date = new Date(unixTime * 1000);
    return date.toLocaleDateString('he-IL');
  };

  

  return (
    <div className="p-3 bg-gray-50 min-h-screen" dir="rtl">
      {showPopup && <DocumentPopup docID={selectedDocID} onClose={closePopup} />}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">בחירת הזמנה</h1>
        
        {/* Search Bar - Fixed at top */}
        <div className="sticky top-0 z-10 mb-4 bg-white rounded-lg shadow-md p-3">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="חפש לפי שם הזמנה, לקוח או מספר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="mr-2 text-gray-600">טוען הזמנות...</span>
            </div>
          ) : orders.length === 0 && searchTerm.trim() !== '' ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 text-lg">לא נמצאו הזמנות התואמות לחיפוש.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.docName}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="p-3">
                    {/* Header with order number and status */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 ml-2" />
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          הזמנה {order.docName}
                        </h2>
                      </div>
                      
                    </div>

                    {/* Info Cards - 2 per row on mobile, 4 per row on larger screens */}
                    <div className="grid grid-cols-4 md:grid-cols-2 gap-2 mb-3">
                      {/* Date info */}
                      <div className="bg-blue-50 rounded-lg p-2 shadow-sm">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-blue-600 ml-1" />
                          <h3 className="text-sm font-semibold text-blue-800">תאריך</h3>
                        </div>
                        <p className="text-sm text-gray-800">{formatDate(order.unixTime)}</p>
                      </div>

                      {/* Financial info */}
                      <div className="bg-green-50 rounded-lg p-2 shadow-sm">
                        <div className="flex items-center mb-1">
                          <DollarSign className="h-4 w-4 text-green-600 ml-1" />
                          <h3 className="text-sm font-semibold text-green-800">תשלום</h3>
                        </div>
                        <p className="text-sm text-gray-800">{order.grandTotal} ₪</p>
                      </div>

                      {/* Customer info */}
                      <div className="bg-purple-50 rounded-lg p-2 shadow-sm">
                        <div className="flex items-center mb-1">
                          <UserCheck className="h-4 w-4 text-purple-600 ml-1" />
                          <h3 className="text-sm font-semibold text-purple-800">לקוח</h3>
                        </div>
                        <p className="text-sm text-gray-800 truncate">{order.custDes}</p>
                      </div>

                      {/* Contact info */}
                      <div className="bg-amber-50 rounded-lg p-2 shadow-sm">
                        <div className="flex items-center mb-1">
                          <MapPin className="h-4 w-4 text-amber-600 ml-1" />
                          <h3 className="text-sm font-semibold text-amber-800">מיקום</h3>
                        </div>
                        <p className="text-sm text-gray-800 truncate">{order.city}</p>
                      </div>
                    </div>

                    {/* Additional details section */}
                    <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">כתובת</p>
                        <p className="text-sm truncate">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">טלפון</p>
                        <p className="text-sm">{order.phone}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(order.ordID)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors duration-200 flex items-center text-sm"
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        הצג פרטים
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Initial state - no search yet */}
          {orders.length === 0 && searchTerm.trim() === '' && !isLoading && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">חיפוש הזמנות</h3>
              <p className="text-gray-500">הקלד מספר הזמנה, שם לקוח או כל פרט אחר כדי לחפש</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectOrder;