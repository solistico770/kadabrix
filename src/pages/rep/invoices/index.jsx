import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import InvoicePopup from './popup';
import { Search, Calendar, FileText, CreditCard, ChevronDown, X, RefreshCw } from 'lucide-react';

const InvoiceScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchInvoices(searchTerm);
      } else {
        fetchInvoices();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter]);

  const fetchInvoices = async (search = '') => {
    setIsLoading(true);
    try {
      const data = await kdb.run({
        module: 'repInvoices',
        name: 'searchInvoices',
        data: { 
          search,
          status: statusFilter !== 'all' ? statusFilter : undefined
        },
      });
      setInvoices(data?.invoices || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoiceId(invoice.docID);
    setShowPopup(true);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₪0.00';
    
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2
    }).format(parseFloat(amount));
  };
  
  const formatDate = (unixTime) => {
    if (!unixTime) return '';
    return new Date(unixTime * 1000).toLocaleDateString('he-IL');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { text: 'שולם', color: 'bg-green-100 text-green-800 border-green-300' },
      2: { text: 'ממתין', color: 'bg-amber-100 text-amber-800 border-amber-300' },
      3: { text: 'באיחור', color: 'bg-red-100 text-red-800 border-red-300' },
      0: { text: 'טיוטה', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    };
    
    const statusInfo = statusMap[status] || statusMap[0];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} border`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">פרטי חשבונית</h2>
              <button 
                onClick={() => setShowPopup(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <InvoicePopup
              docID={selectedInvoiceId}
              onClose={() => setShowPopup(false)}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">חשבוניות</h1>
            <div className="flex space-x-3 space-x-reverse">
              <button 
                onClick={() => fetchInvoices(searchTerm)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} className="ms-2" />
                רענן
              </button>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>סינון</span>
                <ChevronDown size={16} className="mr-1" />
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative p-3">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="חיפוש לפי מס' חשבונית, שם לקוח או סכום..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter options */}
            {filterOpen && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">סטטוס חשבונית</label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">כל הסטטוסים</option>
                      <option value="1">שולם</option>
                      <option value="2">ממתין לתשלום</option>
                      <option value="3">באיחור</option>
                    </select>
                  </div>
                  <div className="flex items-end md:justify-end">
                    <button 
                      onClick={() => {
                        setStatusFilter('all');
                        setSearchTerm('');
                        fetchInvoices();
                      }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      נקה סינון
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Invoice List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-52 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-blue-500" />
                <p className="text-gray-600">טוען חשבוניות...</p>
              </div>
            </div>
          ) : invoices.length === 0 && searchTerm.trim() !== '' ? (
            <div className="flex items-center justify-center h-52 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <FileText size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 font-medium">לא נמצאו חשבוניות</p>
                <p className="text-gray-400 text-sm mt-1">נסה לשנות את פרמטרי החיפוש</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto invoice-table-wrapper">
                <table className="min-w-full divide-y divide-gray-200 invoice-table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        מסמך
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        לקוח
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        תאריך
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סטטוס
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סכום
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr 
                        key={invoice.id || invoice.docID} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{invoice.docName}</span>
                            <span className="text-xs text-gray-500">{invoice.ctypeDes}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{invoice.custDes}</span>
                            <span className="text-xs text-gray-500">קוד: {invoice.custName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(invoice.unixTime)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.docStatus)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.grandTotal)}</span>
                            <span className="text-xs text-gray-500">מע"מ: {formatCurrency(invoice.vat)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(invoice);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition-colors"
                          >
                            הצג פרטים
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Empty state when no search but data should be shown */}
              {invoices.length === 0 && searchTerm.trim() === '' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">אין חשבוניות להצגה</p>
                  <p className="text-gray-400 text-sm mt-1 mb-4">חפש חשבוניות או רענן את הרשימה</p>
                  <button
                    onClick={() => fetchInvoices()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    טען חשבוניות
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Responsive table adjustments */}
        <style jsx>{`
          @media (max-width: 768px) {
            .invoice-table-wrapper {
              margin: 0 -1rem;
            }
            .invoice-table th:nth-child(3),
            .invoice-table td:nth-child(3),
            .invoice-table th:nth-child(5),
            .invoice-table td:nth-child(5) {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default InvoiceScreen;