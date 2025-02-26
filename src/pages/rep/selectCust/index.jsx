import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from '../../../kadabrix/event';
import { useUserStore } from '../../../kadabrix/userState';

const SelectCustomer = () => {
  const config = useUserStore(state => state.userDetails.config);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    fetchCustomers("");

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchCustomers(searchTerm);
      } else {
        setCustomers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch customers from the API
  const fetchCustomers = async (search) => {
    setIsLoading(true);
    const data = await kdb.run({
      module: 'repSelectCust',
      name: 'searchCustomers',
      data: { search },
    });
    setCustomers(data.customers);
    setIsLoading(false);
  };

  // Select a customer
  const handleSelect = async (cust) => {
    await kdb.run({
      module: 'repSelectCust',
      name: 'updateSelectedCustomer',
      data: { custName:cust.custName },
    });
    setSelectedCustomer(cust);
    eventBus.emit("toast", { title: "לקוח נבחר", text: cust.custName + ' '  + cust.custDes});
    eventBus.emit("navigate", config.defaultScreen);
    
    

  };

  return (
    <div className="p-6">
        

      <h1 className="text-2xl font-bold mb-6 text-gray-800"></h1>
      <div className="top-0 sticky mb-6 shadow-md p-4 rounded bg-white">
        <input
          type="text"
          placeholder="בחר לקוח"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-200"
        />
      </div>
      <div className="mt-4">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : customers.length === 0 && searchTerm.trim() !== '' ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          <ul className="space-y-4">
            {customers.map((customer) => (
              <li
                key={customer.custName}
                className="p-4 shadow-lg bg-white rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {customer.custDes}
                  </p>
                  <p className="text-gray-600">
                    {customer.address}, {customer.city}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Phone: {customer.phone}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Type: {customer.ctypeDes}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(customer)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  בחר
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
};

export default SelectCustomer;
