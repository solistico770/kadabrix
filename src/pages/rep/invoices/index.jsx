
// 2) React Component for Invoices Screen
import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import InvoicePopup from './popup';


const InvoiceScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchInvoices(searchTerm);
      } else {
        setInvoices([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchInvoices = async (search) => {
    setIsLoading(true);
    const data = await kdb.run({
      module: 'invoices',
      name: 'searchInvoices',
      data: { search },
    });
    setInvoices(data.invoices);
    setIsLoading(false);
  };


  const handleViewDetails = (invoice) => {
    setSelectedInvoiceId(invoice.invID);
    setShowPopup(true);
  };

  


  return (
    <div className="p-6">

      {showPopup && (
        <InvoicePopup
          invID={selectedInvoiceId}
          onClose={() => setShowPopup(false)}
        />
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Invoices</h1>
      <div className="top-0 sticky mb-6 shadow-md p-4 rounded bg-white">
        <input
          type="text"
          placeholder="Search Invoices"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-200"
        />
      </div>
      <div className="mt-4">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : invoices.length === 0 && searchTerm.trim() !== '' ? (
          <p className="text-gray-500">No invoices found.</p>
        ) : (
          <ul className="space-y-4">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="p-4 shadow-lg bg-white rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {invoice.docName} - {invoice.docStatus}
                  </p>

                  <p className="font-bold text-lg text-gray-800">
                    {invoice.custName} - {invoice.custDes}
                  </p>


                  <p className="text-gray-600">
                    Total: {invoice.grandTotal} NIS
                  </p>
                  <p className="text-gray-500 text-sm">
                    Type: {invoice.invoiceType}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Agent: {invoice.agentDes}
                  </p>
                </div>
                <button
                  onClick={() => handleViewDetails(invoice)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InvoiceScreen;
