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

  // Format status
  const getStatusText = (status) => {
    switch (status) {
      case 0: return "טיוטה";
      case 1: return "פעיל";
      case 2: return "בוצע";
      case 3: return "מבוטל";
      default: return "לא ידוע";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return "bg-gray-200 text-gray-800";
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-blue-100 text-blue-800";
      case 3: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {showPopup && <DocumentPopup docID={selectedDocID} onClose={closePopup} />}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">בחירת הזמנה</h1>
        
        {/* Search Bar - Fixed at top */}
        <div className="sticky top-0 z-10 mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="חפש לפי שם הזמנה, לקוח או מספר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
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
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.docName}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="p-5">
                    {/* Header with order number and status */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 ml-2" />
                        <h2 className="text-xl font-bold text-gray-800">
                          הזמנה {order.docName}
                        </h2>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.docStatus)}`}>
                        {getStatusText(order.docStatus)}
                      </span>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Customer info */}
                      <div className="flex items-start">
                        <UserCheck className="h-5 w-5 text-gray-500 ml-2 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-700">פרטי לקוח</h3>
                          <p className="text-gray-800">{order.custDes}</p>
                          <p className="text-gray-600 text-sm">מס' לקוח: {order.custName}</p>
                          <p className="text-gray-600 text-sm">סוג: {order.ctypeDes}</p>
                        </div>
                      </div>

                      {/* Contact info */}
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 ml-2 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-700">פרטי התקשרות</h3>
                          <p className="text-gray-800">{order.address}</p>
                          <p className="text-gray-800">{order.city}</p>
                          <div className="flex items-center mt-1">
                            <Phone className="h-4 w-4 text-gray-500 ml-1" />
                            <p className="text-gray-600">{order.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Financial info */}
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-gray-500 ml-2 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-700">פרטי תשלום</h3>
                          <p className="text-gray-800">סכום לפני מע"מ: {order.total} ₪</p>
                          <p className="text-gray-800 font-medium">סה"כ כולל מע"מ: {order.grandTotal} ₪</p>
                        </div>
                      </div>

                      {/* Date info */}
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 ml-2 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-700">תאריך</h3>
                          <p className="text-gray-800">{formatDate(order.unixTime)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(order.ordID)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                      >
                        <Eye className="h-4 w-4 ml-2" />
                        הצג פרטים
                      </button>
                      <button
                        onClick={() => handleSelect(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                      >
                        בחר הזמנה זו
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Initial state - no search yet */}
          {orders.length === 0 && searchTerm.trim() === '' && !isLoading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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