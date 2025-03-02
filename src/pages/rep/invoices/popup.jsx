import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from "../../../kadabrix/event";

const InvoicePopup = ({ docID, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // חסימת גלילה של גוף העמוד כשהפופאפ פתוח
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // שחרור הגלילה כשהקומפוננטה מתפרקת
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const result = await kdb.run({
          module: 'repInvoices',
          name: 'getDoc',
          data: {docID:docID}
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        eventBus.emit("toast", {
          type: "error",
          title: "שגיאה",
          text: "אירעה שגיאה בטעינת החשבונית",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [docID]);

  const getOriginal = async () => {
    setDownloadingPdf(true);

    try {
      const data = await kdb.run({
        module: "repInvoices",
        name: "printDoc",
        data: docID,
      });

      if (data) {
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `חשבונית_${docID}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        eventBus.emit("toast", {
          type: "error",
          title: "שגיאה",
          text: "לא ניתן להדפיס את המסמך",
        });
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      eventBus.emit("toast", {
        type: "error",
        title: "שגיאה",
        text: "אירעה שגיאה בעת ניסיון להדפיס את המסמך",
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  // פונקציה להצגת מספרים עם שתי ספרות אחרי הנקודה העשרונית
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0.00";
    return Number(num).toFixed(2);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50" dir="rtl">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">טוען פרטי חשבונית...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50" dir="rtl">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">החשבונית לא נמצאה</h3>
          <p className="text-gray-600 mb-4">לא ניתן לטעון את החשבונית המבוקשת.</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            סגור
          </button>
        </div>
      </div>
    );
  }

  const { invoice, lines } = data;

  return (
    <div dir="rtl" className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50">
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto my-8 relative overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">חשבונית מס' {invoice.docName}</h2>
            <button
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={onClose}
              aria-label="סגור"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Invoice Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-700 border-b pb-2">פרטי חשבונית</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">מספר מסמך:</span>
                    <span className="font-medium">{invoice.docName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">שם לקוח:</span>
                    <span className="font-medium">{invoice.custName}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-700 border-b pb-2">סיכום פיננסי</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">סכום לפני מע"מ:</span>
                    <span className="font-medium">{formatNumber(invoice.total)} ₪</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">מע"מ:</span>
                    <span className="font-medium">{formatNumber(invoice.vat)} ₪</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-blue-600 pt-1 border-t">
                    <span>סה"כ לתשלום:</span>
                    <span>{formatNumber(invoice.grandTotal)} ₪</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Invoice Lines */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-700">פריטי חשבונית</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פריט</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תיאור</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">כמות</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מחיר</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">אחרי הנחה</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lines.map((line, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{line.partName}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{line.partDes}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(line.quant)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(line.price)} ₪</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{formatNumber(line.priceAfterDiscount)} ₪</td>
                        </tr>
                      ))}
                      {lines.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-4 py-4 text-sm text-gray-500 text-center">לא נמצאו פריטים</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-start gap-3 border-t">
            <button
              onClick={getOriginal}
              disabled={downloadingPdf}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center disabled:bg-blue-300"
            >
              {downloadingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  מעבד...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  הורד PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePopup;