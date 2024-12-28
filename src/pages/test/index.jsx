import React, { useState } from "react";

const App = () => {
  const [cart, setCart] = useState([]);
  const [showInStock, setShowInStock] = useState(false);
  const [showPurchased, setShowPurchased] = useState(false);

  // Dummy Data
  const categories = [
    { id: 1, name: "אלקטרוניקה", image: "https://via.placeholder.com/100" },
    { id: 2, name: "בגדים", image: "https://via.placeholder.com/100" },
    { id: 3, name: "ריהוט", image: "https://via.placeholder.com/100" },
  ];

  const products = [
    { id: 1, name: "טלפון", price: 1200, inStock: true, purchased: false, image: "https://via.placeholder.com/150" },
    { id: 2, name: "לפטופ", price: 3000, inStock: true, purchased: true, image: "https://via.placeholder.com/150" },
    { id: 3, name: "כיסא", price: 150, inStock: false, purchased: false, image: "https://via.placeholder.com/150" },
  ];

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      (!showInStock || p.inStock) &&
      (!showPurchased || p.purchased)
  );

  // Handlers
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Components
  const Categories = () => (
    <aside className="w-1/4 p-2">
      <h2 className="font-bold text-lg mb-4">קטגוריות</h2>
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center space-x-2">
            <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded" />
            <span>{cat.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );

  const Products = () => (
    <section className="w-3/4 p-2">
      <h2 className="font-bold text-lg mb-4">מוצרים</h2>
      <div className="grid grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="p-4 bg-white shadow rounded">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-500">₪{product.price}</p>
            <button
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
              onClick={() => addToCart(product)}
            >
              הוסף לסל
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  const Cart = () => (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow p-4">
      <h2 className="font-bold text-lg mb-2">סל קניות</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">הסל שלך ריק</p>
      ) : (
        <ul className="space-y-2">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span>{item.name}</span>
              <button className="text-red-500" onClick={() => removeFromCart(item.id)}>
                הסר
              </button>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-blue-600 text-white text-center">
        <h1 className="text-2xl font-bold">React Shop Template</h1>
      </header>

      <main className="p-4">
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded ${showInStock ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            onClick={() => setShowInStock(!showInStock)}
          >
            מוצרים במלאי
          </button>
          <button
            className={`px-4 py-2 rounded ${showPurchased ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            onClick={() => setShowPurchased(!showPurchased)}
          >
            נרכשו בעבר
          </button>
        </div>

        <div className="flex flex-wrap">
          <Categories />
          <Products />
        </div>
      </main>

      <Cart />
    </div>
  );
};

export default App;
