import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from '../../../kadabrix/event';
import { useUserStore } from '../../../kadabrix/userState';
import { Search, CheckCircle, Clock, Phone, MapPin, Building } from 'lucide-react';

const SelectCustomer = () => {
  const config = useUserStore(state => state.userDetails.config);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentCustomers, setRecentCustomers] = useState([]);

  // Load recent customers on mount
  useEffect(() => {
    fetchRecentCustomers();
    fetchCustomers("");
  }, []);

  // Fetch recent customers
  const fetchRecentCustomers = async () => {
    try {
      const data = await kdb.run({
        module: 'repSelectCust',
        name: 'getRecentCustomers',
        data: {},
      });
      setRecentCustomers(data.customers || []);
    } catch (error) {
      console.error('Failed to fetch recent customers:', error);
    }
  };

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchCustomers(searchTerm);
      }
    }, 300); // Reduced debounce time for faster response

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch customers from the API
  const fetchCustomers = async (search) => {
    setIsLoading(true);
    try {
      const data = await kdb.run({
        module: 'repSelectCust',
        name: 'searchCustomers',
        data: { search },
      });
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      eventBus.emit("toast", { title: "שגיאה", text: "אירעה שגיאה בטעינת רשימת הלקוחות" });
    } finally {
      setIsLoading(false);
    }
  };

  // Select a customer
  const handleSelect = async (cust) => {
    setIsLoading(true);
    try {
      await kdb.run({
        module: 'repSelectCust',
        name: 'updateSelectedCustomer',
        data: { custName: cust.custName },
      });
      setSelectedCustomer(cust);
      eventBus.emit("toast", { 
        title: "לקוח נבחר", 
        text: `${cust.custName} ${cust.custDes}` 
      });
      eventBus.emit("navigate", config.defaultScreen);
    } catch (error) {
      console.error('Failed to select customer:', error);
      eventBus.emit("toast", { title: "שגיאה", text: "אירעה שגיאה בבחירת הלקוח" });
    } finally {
      setIsLoading(false);
    }
  };

  // Render customer card
  const CustomerCard = ({ customer, isRecent = false }) => (
    <div 
      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-r-4 border-blue-500"
      onClick={() => handleSelect(customer)}
    >
      <div className="flex justify-between items-start">
        <div className="rtl-dir w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-blue-700">{customer.custDes}</h3>
            {isRecent && (
              <div className="flex items-center text-gray-500 text-sm">
                <Clock size={14} className="ml-1" />
                <span>נבחר לאחרונה</span>
              </div>
            )}
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="ml-2" />
              <span>{customer.address}, {customer.city}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Phone size={16} className="ml-2" />
              <span dir="ltr">{customer.phone}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Building size={16} className="ml-2" />
              <span>{customer.ctypeDes}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
      >
        <CheckCircle size={18} className="ml-2" />
        <span>בחר לקוח</span>
      </button>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">בחירת לקוח</h1>
        
        {/* Search Bar - Sticky */}
        <div className="sticky top-0 z-10 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="חפש לפי שם, עיר או טלפון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg"
              />
              <Search 
                size={24} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Recent Customers Section */}
        {!isLoading && searchTerm.trim() === '' && recentCustomers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-r-4 border-blue-500 pr-3">לקוחות אחרונים</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCustomers.map(customer => (
                <CustomerCard 
                  key={`recent-${customer.custName}`} 
                  customer={customer} 
                  isRecent={true} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchTerm.trim() !== '' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-r-4 border-blue-500 pr-3">תוצאות חיפוש</h2>
            
            {customers.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600 text-lg">לא נמצאו לקוחות התואמים לחיפוש "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-3 text-blue-600 hover:text-blue-800"
                >
                  נקה חיפוש
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map(customer => (
                  <CustomerCard 
                    key={`search-${customer.custName}`} 
                    customer={customer} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Customers (when no search or recent) */}
        {!isLoading && searchTerm.trim() === '' && recentCustomers.length === 0 && customers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-r-4 border-blue-500 pr-3">כל הלקוחות</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map(customer => (
                <CustomerCard 
                  key={`all-${customer.custName}`} 
                  customer={customer} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCustomer;