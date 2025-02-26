import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from "../../../kadabrix/event";
import { Loader, FileText, X, Printer, User, Package, Tag, Calculator, Image as ImageIcon } from 'lucide-react';
import { supabaseUrl } from "../../../kadabrix/kdbConfig";
import imageOnError from '../../../kadabrix/imgErr.js';

const DocumentPopup = ({ docID, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const result = await kdb.run({
          module: 'repOrders',
          name: 'getDoc',
          data: {docID: docID}
        });
        setData(result);
      } catch (error) {
        console.error("Error fetching document details:", error);
        eventBus.emit("toast", {
          type: "error",
          title: "שגיאה",
          text: "אירעה שגיאה בטעינת פרטי המסמך",
        });
      } finally {
        setLoading(false);
      }
    };

    if (docID) {
      fetchDocumentDetails();
    }
  }, [docID]);

  const printDocument = async () => {
    setLoading(true);

    try {
      const data = await kdb.run({
        module: "invoices",
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
        a.download = `Document_${docID}.pdf`;
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
      console.error("Error printing document:", error);
      eventBus.emit("toast", {
        type: "error",
        title: "שגיאה",
        text: "אירעה שגיאה בעת ניסיון להדפיס את המסמך",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0.00 ₪";
    return Number(amount).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₪";
  };

  // Calculate total quantity and sum
  const getTotals = () => {
    if (!data || !data.lines) return { totalQuantity: 0, totalSum: 0 };
    
    return data.lines.reduce((acc, line) => {
      return {
        totalQuantity: acc.totalQuantity + (Number(line.quant) || 0),
        totalSum: acc.totalSum + (Number(line.priceAfterDiscount || line.price) * Number(line.quant) || 0)
      };
    }, { totalQuantity: 0, totalSum: 0 });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50" dir="rtl">
        <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-700 text-lg font-medium">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50" dir="rtl">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">שגיאה</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="סגור"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-700 mb-6">לא ניתן לטעון את פרטי המסמך. אנא נסה שוב מאוחר יותר.</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { totalQuantity, totalSum } = getTotals();

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-l from-blue-500 to-blue-600 p-4 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-6 w-6 ml-2" />
              <div>
                <h2 className="text-xl font-bold">
                  {data.order ? data.order.docName : data.invoice?.docName || 'מסמך'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {data.order?.custDes || data.invoice?.custDes || 'פרטי מסמך'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
              aria-label="סגור"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Document info - Fixed */}
        <div className="bg-blue-50 p-4 border-b border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 ml-2 mt-1" />
              <div>
                <p className="text-sm text-gray-600">לקוח</p>
                <p className="font-medium">
                  {data.order?.custDes || data.invoice?.custDes || 'לא צוין'}
                </p>
                <p className="text-sm text-gray-500">
                  מס' לקוח: {data.order?.custName || data.invoice?.cust || 'לא צוין'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Calculator className="h-5 w-5 text-blue-500 ml-2 mt-1" />
              <div>
                <p className="text-sm text-gray-600">פרטי תשלום</p>
                <p className="font-medium">
                  סה"כ לפני מע"מ: {formatCurrency(data.order?.total || data.invoice?.total)}
                </p>
                <p className="font-medium">
                  מע"מ: {formatCurrency(data.order?.vat || data.invoice?.vat)}
                </p>
                <p className="font-bold text-blue-800">
                  סה"כ כולל מע"מ: {formatCurrency(data.order?.grandTotal || data.invoice?.grandTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lines title & sticky header */}
        <div className="flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              פריטים במסמך
            </h3>
            <div className="text-sm text-gray-600">
              סה"כ פריטים: {data.lines?.length || 0}
            </div>
          </div>
          
          {/* Sticky table header */}
          <div className="sticky top-0 z-10 bg-gray-100 border-y border-gray-200 shadow-sm">
            <div className="grid grid-cols-12 gap-2 py-3 px-4 font-medium">
              <div className="col-span-5 flex items-center">פריט</div>
              <div className="col-span-2 text-center">כמות</div>
              <div className="col-span-2 text-center">מחיר</div>
              <div className="col-span-3 text-left">סה"כ</div>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-grow overflow-y-auto">
          {/* Items list */}
          <div className="divide-y divide-gray-200">
            {data.lines && data.lines.length > 0 ? (
              data.lines.map((line, index) => (
                <div key={index} className="px-4 py-3 grid grid-cols-12 gap-2 hover:bg-blue-50 transition-colors">
                  {/* Product with image */}
                  <div className="col-span-5 flex">
                    <div className="h-14 w-14 flex-shrink-0 ml-3 relative rounded-md overflow-hidden border border-gray-200">
                      {line.part ? (
                        <img
                          src={`${supabaseUrl}/storage/v1/render/image/public/images/${line.part}.jpg?width=60&height=60`}
                          alt={line.partName}
                          onError={imageOnError}
                          className="w-full h-full object-cover bg-white"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="font-medium text-gray-900">{line.partName}</div>
                      <div className="text-sm text-gray-600">{line.partDes}</div>
                      <div className="text-xs text-gray-500">מק"ט: {line.part}</div>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="bg-gray-100 px-2 py-1 rounded-lg font-medium">
                      {line.quant}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-2 flex flex-col items-center justify-center">
                    <span className="font-medium">
                      {formatCurrency(line.priceAfterDiscount || line.price)}
                    </span>
                    {line.priceAfterDiscount && line.price && line.priceAfterDiscount !== line.price && (
                      <span className="text-xs text-red-500 line-through">
                        {formatCurrency(line.price)}
                      </span>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-3 flex items-center justify-end font-medium text-gray-900">
                    {formatCurrency((line.priceAfterDiscount || line.price) * line.quant)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                לא נמצאו פריטים במסמך זה
              </div>
            )}
          </div>
        </div>

        {/* Summary & Actions - Fixed */}
        <div className="border-t border-gray-200">
          {/* Summary */}
          {data.lines && data.lines.length > 0 && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="font-medium">סיכום:</div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">סה"כ כמות: {totalQuantity}</div>
                  <div className="font-bold text-blue-800">סה"כ: {formatCurrency(totalSum)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 bg-gray-100 flex justify-between items-center rounded-b-lg">
            <button
              onClick={printDocument}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              disabled={loading}
            >
              <Printer className="h-5 w-5 ml-2" />
              הדפס מסמך
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPopup;