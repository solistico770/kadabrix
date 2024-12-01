import { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../kadabrix/cartState';

import kdb from "../../kadabrix/kadabrix";
import AddButton from './addButton';
import DetailsButton from './detailsButton';
import CatalogCats from './catalogCats';
import imageOnError from '../../kadabrix/imgErr.js';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import "./catalog.css";
import {
  Container,
  Button,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { userContext } from '../../kadabrix/userState'; 



const ProductList = () => {

  const navigate = useNavigate();
  
  const { userDetails } = useContext(userContext);
  
  const { cart } = useContext(CartContext);
  const [winw, setWinw] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => {
        setWinw(window.innerWidth);
      };  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []); 

    
    const viewSize =  (ranges, size) => {
  // Iterate through each range in the array
  for (let range of ranges) {
    // Check if the given size falls within the current range
    if (size >= range.from && size <= range.to) {
      return range.size;
    }
  }
  // Optional: If no range is matched, return a default value (like 0 or null)
  return null; // or you could return some default value
}


  

  const [products, setProducts] = useState([]);
  const [catId, setCatId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

          
const cardHeight=viewSize([
  { from: 0, to: 480, size: 60 },
  { from: 481, to: 99999, size: 118 },
],winw);

const cardWidth=viewSize([
  { from: 0, to: 480, size: 100 },
  { from: 481, to: 99999, size: 200 },
],winw);




  useEffect(() => {
    
    if (!userDetails.loaded||!cart.loaded) return;

    if (userDetails.roles.includes("kB2bBudget")&&!cart?.budget?.id)  {navigate("/selectBudget")}
  }, [userDetails,cart]);

  

  useEffect(() => {
    fetchProducts();
  }, [catId]);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    // Clean up the timeout if the effect is re-run before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch products when the debounced search term changes
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm]);

  const fetchProducts = async () => {
    setLoading(true);

    let data = await kdb.run({
      "module": "catalog",
      "name": "getProducts",
      "data": { cat: catId, searchTerm: searchTerm, limit: limit, page: page }
    });

    setLoading(false);
    setProducts([...data]);
    setHasMore(data.length === limit);
    setPage(page + 1);
  };

  const handleLoadMore = () => {
    fetchProducts();
  };

  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  return (
    <Container>
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
      <div style={{ paddingTop: "20px" }}>
        {loading && page === 1 ? (
          <CircularProgress />
        ) : (
          <TransitionGroup style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {products.map((product, index) => (
              <CSSTransition key={product.part} timeout={500} classNames="fade">
                <div style={{ 
                    width: cardWidth, 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    position: 'relative', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '5px', 
                    textAlign: 'center' 
                }}>
                  
                  {/* Image Container with Fixed Height */}
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <img
                      src={`${supabaseUrl}/storage/v1/render/image/public/images/${product.part}.jpg?width=200&height=200`}
                      alt={product.partName}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      onError={imageOnError}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div style={{ flexGrow: 1 }}>
                    <Typography variant="body2" component="div">
                      {product.partName}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" style={{ marginBottom: '8px' }}>
                      {product.partDes}
                    </Typography>
                  </div>
                  
                  {/* Price and Buttons Container */}
                  <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    <Typography variant="body1" color="text.primary" style={{ marginBottom: '8px' }}>
                      {product.price > 0 ? currencyFormat(product.price) : "*"}
                    </Typography>
                    
                    <div style={{ margin: "10px" }}>
                      {product.price > 0 ? (
                        <AddButton item={product} />
                      ) : (
                        <Button variant="outlined" size="small" style={{ marginBottom: '8px' }}>
                          בקש הצעת מחיר
                        </Button>
                      )}
                    </div>
                    
                    <DetailsButton partName={product.partName} partDes={product.partDes} part={product.part} />
                  </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
        {loading && page > 1 && <CircularProgress />}
      </div>
    </Container>
  );
};

export default ProductList;
