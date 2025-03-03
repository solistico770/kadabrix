import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import eventBus from '../../../kadabrix/event';





const CartList = () => {
  const [carts, setCarts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '', visible: false }); // For toast notifications

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ ...toast, visible: false });
    }, 3000); // Toast disappears after 3 seconds
  };

  useEffect(() => {
    
    const intervalId = setInterval(fetchCarts, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []); 


  // Fetch carts data
  const fetchCarts = async () => {
    try {
      const data = await kdb.run({
        module: 'kdb_cart_deffered',
        name: 'getCarts',
        data: {}
      });
      setCarts(data);
      setFilteredCarts(data);
      
    } catch (err) {
      showToast('Failed to load cart data. Please try again.', 'error'); // Error toast
      console.error('Error fetching carts:', err);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // Filter carts based on search query
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredCarts(
      carts.filter(cart =>
        (cart.name || '').toLowerCase().includes(lowerQuery) ||
        (cart.phone || '').toLowerCase().includes(lowerQuery) ||
        (cart.email || '').toLowerCase().includes(lowerQuery)
      )
    );
  }, [searchQuery, carts]);

  // Load individual cart
  const loadCart = async (id, type) => {
    try {
      const data = await kdb.run({
        module: 'kdb_cart_deffered',
        name: 'loadCart',
        data: { id, type }
      });
      showToast(`סל נטען בהצלחה`, 'success');
      fetchCarts();
      eventBus.emit('openCart');

    } catch (err) {
      
      fetchCarts();
      showToast(err, 'error');
      console.error('Error loading cart:', err);
    }
  };

  return (
    <div className="p-4 relative">
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">רשימת סלים</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="border p-2 rounded w-2/3"
          placeholder="חפש על שם, פלפון או אימייל"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={fetchCarts}
        >
          רענן
        </button>
      </div>

      <div className="overflow-x-auto h-[75vh]">
        <div className="relative">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="sticky top-0 bg-gray-200 z-10">
              <tr>
                <th className="border border-gray-300 px-4 py-2">מספר</th>
                <th className="border border-gray-300 px-4 py-2">מקור</th>
                <th className="border border-gray-300 px-4 py-2">שם</th>
                <th className="border border-gray-300 px-4 py-2">טלפון</th>
                <th className="border border-gray-300 px-4 py-2">משתמש</th>
                <th className="border border-gray-300 px-4 py-2">סכום</th>
                <th className="border border-gray-300 px-4 py-2">פריטים</th>
                <th className="border border-gray-300 px-4 py-2">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{cart.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{cart.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{cart.name || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{cart.phone || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{cart.email || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{cart.total?.total || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">{cart.total?.totalQ || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      onClick={() => loadCart(cart.id, cart.type)}
                    >
                      טען
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CartList;
