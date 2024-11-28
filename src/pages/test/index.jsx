import "./index.css"

const App = () => {
  return (
    <div className="app-container">
      <br/>
      <header className="search-header">
        <div className="search">
          <input type="text" placeholder="Search..." />
        </div>
      </header>
      <aside className="categories-container">
        <div className="categories">
          <button>Cat 1</button>
          <button>Cat 2</button>
          <button>Cat 3</button>
          <button>Cat 4</button>
          <button>Cat 5</button>
          {/* More category buttons */}
        </div>
      </aside>
      <main className="products-container">
        {[...Array(500)].map((_, idx) => (
          <div key={idx} className="product">
            Product {idx + 1}
          </div>
        ))}
      </main>
    </div>
  );
};

export default App;
