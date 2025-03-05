import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from "../../../kadabrix/event";
import { Loader, FileText, X, Printer, User, Package, Calculator, Image as ImageIcon } from 'lucide-react';
import { supabaseUrl } from "../../../kadabrix/kdbConfig";
import imageOnError from '../../../kadabrix/imgErr.js';

const DocumentPopup = ({ docID, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // חסימת גלילה של גוף העמוד כשהפופאפ פתוח
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // שחרור הגלילה כשהקומפוננטה מתפרקת
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
        a.download = `מסמך_${docID}.pdf`;
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

  // עיצוב מספרים עם דיוק של שתי ספרות
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0.00 ₪";
    return Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₪";
  };

  // חישוב כמות כוללת וסכום כולל
  const getTotals = () => {
    if (!data || !data.lines) return { totalQuantity: 0, totalSum: 0 };
    
    return data.lines.reduce((acc, line) => {
      const lineQuantity = Number(line.quant) || 0;
      const linePrice = Number(line.priceAfterDiscount || line.price) || 0;
      return {
        totalQuantity: acc.totalQuantity + lineQuantity,
        totalSum: acc.totalSum + (linePrice * lineQuantity)
      };
    }, { totalQuantity: 0, totalSum: 0 });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50" dir="rtl">
        <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
          <Loader className="h-8 w-8 text-blue-500 animate-spin mb-3" />
          <p className="text-gray-700 text-base font-medium">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50" dir="rtl">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600">שגיאה</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="סגור"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-700 mb-4">לא ניתן לטעון את פרטי המסמך. אנא נסה שוב מאוחר יותר.</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { totalQuantity, totalSum } = getTotals();
  
  // עיגול הכמות הכוללת לשתי ספרות עשרוניות
  const formattedTotalQuantity = Number(totalQuantity).toFixed(2);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50" dir="rtl">
      <div className="h-full w-full flex items-center justify-center p-2">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col">
          {/* Compact Header */}
          <div className="bg-gradient-to-l from-blue-500 to-blue-600 p-3 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 ml-2" />
              <div>
                <h2 className="text-lg font-bold">
                  {data.order ? data.order.docName : data.invoice?.docName || 'מסמך'} - 
                  <span className="text-blue-100 mr-1 text-sm">
                    {data.order?.custDes || data.invoice?.custDes || 'פרטי מסמך'}
                  </span>
                </h2>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center mr-4 text-sm">
                <User className="h-4 w-4 ml-1" />
                <span>{data.order?.custDes || data.invoice?.custDes || 'לא צוין'}</span>
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

          {/* Items title & sticky header */}
          <div className="bg-gray-100 border-b border-gray-200 shadow-sm py-2 px-3 flex justify-between items-center">
            <div className="flex items-center">
              <Package className="h-4 w-4 ml-1 text-blue-600" />
              <h3 className="font-medium text-gray-800">פריטים במסמך</h3>
            </div>
            <div className="text-sm text-gray-600">
              סה"כ פריטים: {data.lines?.length || 0}
            </div>
          </div>
            
          {/* Sticky table header */}
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
            <div className="grid grid-cols-12 gap-1 py-2 px-3 text-sm font-medium">
              <div className="col-span-6 md:col-span-5 lg:col-span-6 flex items-center">פריט</div>
              <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center">כמות</div>
              <div className="col-span-2 md:col-span-2 lg:col-span-2 text-center">מחיר</div>
              <div className="col-span-2 md:col-span-3 lg:col-span-2 text-left">סה"כ</div>
            </div>
          </div>

          {/* Scrollable content area - Takes most of the space */}
          <div className="flex-grow overflow-y-auto">
            {/* Items list */}
            <div className="divide-y divide-gray-100">
              {data.lines && data.lines.length > 0 ? (
                data.lines.map((line, index) => {
                  // עיגול הכמות והמחירים לשתי ספרות עשרוניות
                  const formattedQuant = Number(line.quant).toFixed(2);
                  const formattedPrice = Number(line.price).toFixed(2);
                  const formattedPriceAfterDiscount = line.priceAfterDiscount ? Number(line.priceAfterDiscount).toFixed(2) : null;
                  const lineTotal = ((line.priceAfterDiscount || line.price) * line.quant).toFixed(2);
                  
                  return (
                    <div key={index} className="px-3 py-2 grid grid-cols-12 gap-1 hover:bg-blue-50 transition-colors">
                      {/* Product with image */}
                      <div className="col-span-6 md:col-span-5 lg:col-span-6 flex">
                        <div className="h-12 w-12 flex-shrink-0 ml-2 relative rounded-md overflow-hidden border border-gray-200">
                          {line.part ? (
                            <img
                              src={`${supabaseUrl}/storage/v1/render/image/public/images/${line.part}.jpg?width=60&height=60&resize=contain`}
                              alt={line.partName}
                              onError={imageOnError}
                              className="w-full h-full object-cover bg-white"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-100">
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                          <div className="font-medium text-gray-900 truncate">{line.partName}</div>
                          <div className="text-sm text-gray-600 truncate">{line.partDes}</div>
                          <div className="text-xs text-gray-500">מק"ט: {line.part}</div>
                        </div>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 md:col-span-2 lg:col-span-2 flex items-center justify-center">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                          {formattedQuant}
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center">
                        <span className="text-sm font-medium">
                          {formatCurrency(formattedPriceAfterDiscount || formattedPrice)}
                        </span>
                        {formattedPriceAfterDiscount && formattedPrice && formattedPriceAfterDiscount !== formattedPrice && (
                          <span className="text-xs text-red-500 line-through">
                            {formatCurrency(formattedPrice)}
                          </span>
                        )}
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 md:col-span-3 lg:col-span-2 flex items-center justify-end font-medium text-sm text-gray-900">
                        {formatCurrency(lineTotal)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  לא נמצאו פריטים במסמך זה
                </div>
              )}
            </div>
          </div>

          {/* Summary & Payment Details & Actions - Compact footer */}
          <div className="border-t border-gray-200">
            {/* Payment details & summary combined */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-gray-50 text-sm">
              <div className="flex items-start">
                <Calculator className="h-4 w-4 text-blue-500 ml-1 mt-1" />
                <div className="grid grid-cols-2 gap-x-2 w-full">
                  <p className="text-gray-600">סה"כ לפני מע"מ:</p>
                  <p className="font-medium text-right">{formatCurrency(data.order?.total || data.invoice?.total)}</p>
                  <p className="text-gray-600">מע"מ:</p>
                  <p className="font-medium text-right">{formatCurrency(data.order?.vat || data.invoice?.vat)}</p>
                  <p className="text-gray-600 font-medium">סה"כ כולל מע"מ:</p>
                  <p className="font-bold text-blue-800 text-right">{formatCurrency(data.order?.grandTotal || data.invoice?.grandTotal)}</p>
                </div>
              </div>

              <div className="flex items-start md:justify-end">
                <div className="text-right">
                  <div className="grid grid-cols-2 gap-x-2">
                    <p className="text-gray-600">סה"כ פריטים:</p>
                    <p className="font-medium text-right">{data.lines?.length || 0}</p>
                    <p className="text-gray-600">סה"כ כמות:</p>
                    <p className="font-medium text-right">{formattedTotalQuantity}</p>
                    <p className="text-gray-600 font-medium">סה"כ שורות:</p>
                    <p className="font-bold text-blue-800 text-right">{formatCurrency(totalSum)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 bg-gray-100 flex justify-between items-center rounded-b-lg">
              <button
                onClick={printDocument}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors text-sm"
                disabled={loading}
              >
                <Printer className="h-4 w-4 ml-1" />
                הדפס מסמך
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors text-sm"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPopup;