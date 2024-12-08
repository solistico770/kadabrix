import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../kadabrix/cartState';
import { userContext } from '../../kadabrix/userState';
import kdb from "../../kadabrix/kadabrix";
import CatalogCats from './catalogCats';
import Product from './product.jsx';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import {
  Container,
  CircularProgress,
  TextField,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "./catalog.css";

const ProductList = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(userContext);
  const { cart } = useContext(CartContext);

  const [winw, setWinw] = useState(window.innerWidth);
  const [products, setProducts] = useState([]);
  const [catId, setCatId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    const handleResize = () => setWinw(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const viewSize = (ranges, size) => {
    for (let range of ranges) {
      if (size >= range.from && size <= range.to) {
        return range.size;
      }
    }
    return null;
  };


  useEffect(() => {
    if (!userDetails.loaded || !cart.loaded) return;
    if (userDetails.roles.includes("kB2bBudget") && !cart?.budget?.id) {
      navigate("/selectBudget");
    }
  }, [userDetails, cart, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [catId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await kdb.run({
      module: "catalog",
      name: "getProducts",
      data: { cat: catId, searchTerm, limit, page },
    });
    setLoading(false);
    setProducts(prevProducts => (page === 1 ? data : [...prevProducts, ...data]));
    setHasMore(data.length === limit);
  };

  const handleLoadMore = () => {
    if (!hasMore) return;
    setPage(prev => prev + 1);
    fetchProducts();
  };

  return (
    <div className="max-w-[1400px] mx-auto ">
      <div className="sticky top-0 left-0 w-full py-10 sm:py-2  bg-white z-20">
      <div style={{ flex: '0 0 auto', padding: '6px' }}>
        <TextField
          label="חיפוש"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          style={{ marginBottom: '8px' }}
        />
      </div>
      <div>
        <CatalogCats setCat={setCatId} />
      </div>
    </div>

      <div style={{ paddingTop: "20px" }}>
        {loading && page === 1 ? (
          <CircularProgress />
        ) : (
            <div className="max-w-[1400px] pb-10 mx-auto w-11/12 flex flex-wrap gap-8 justify-center ">
            {products.map((product) => (
              
                  <Product
                    img={`${supabaseUrl}/storage/v1/render/image/public/images/${product.part}.jpg?width=200&height=200`}
                    product={product}
                  />
                
            ))}
            </div>
        )}
        {loading && page > 1 && <CircularProgress />}
        {!loading && hasMore && (
          <button onClick={handleLoadMore} style={{ marginTop: '20px' }}>Load More</button>
        )}
      </div>
      </div>
    
  );
};

export default ProductList;
