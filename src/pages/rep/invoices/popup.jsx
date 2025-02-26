
// React Component with Popup
import React, { useState } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from "../../../kadabrix/event";

const InvoicePopup = ({ invID, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchInvoiceDetails = async () => {
      const result = await kdb.run({
        module: 'invoices',
        name: 'getInvoice',
        data: invID
      });
      setData(result);
      setLoading(false);
    };

    fetchInvoiceDetails();
  }, [invID]);

  const getOriginal = async () => {
    setLoading(true);

    try {
      const data = await kdb.run({
        module: "invoices",
        name: "printDoc",
        data: invID,
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
        a.download = `Invoice_${invID}.pdf`;
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
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6">
        <button
          className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
        <div className="mb-4">
          <p><strong>Doc Name:</strong> {data.invoice.docName}</p>
          <p><strong>Customer ID:</strong> {data.invoice.cust}</p>
          <p><strong>Total:</strong> {data.invoice.total}</p>
          <p><strong>VAT:</strong> {data.invoice.vat}</p>
          <p><strong>Grand Total:</strong> {data.invoice.grandTotal}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Invoice Lines</h3>
          <ul className="max-h-60 overflow-y-auto border border-gray-300 p-2">
            {data.lines.map((line, index) => (
              <li key={index} className="border-b border-gray-200 py-2">
                <p><strong>Part Name:</strong> {line.partName}</p>
                <p><strong>Description:</strong> {line.partDes}</p>
                <p><strong>Quantity:</strong> {line.quant}</p>
                <p><strong>Price:</strong> {line.price}</p>
                <p><strong>Price After Discount:</strong> {line.priceAfterDiscount}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            onClick={getOriginal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mr-2"
          >
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePopup;
