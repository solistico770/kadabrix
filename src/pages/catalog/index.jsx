import { useState, useEffect } from 'react';
import kdb from "../../kadabrix/kadabrix";
import AddButton from './addButton';
import DetailsButton from './detailsButton';
import CatalogCats from './catalogCats';
import imageOnError from './imgErr.js';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import "./catalog.css";
import {
  Container,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Typography
} from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [catId, setCatId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

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
      <div style={{ flex: '0 0 auto', padding: '8px' }}>
        <TextField
          label="חיפוש"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          style={{ marginBottom: '16px' }}
        />
      </div>
      <div>
        <CatalogCats setCat={setCatId} />
      </div>
      <div style={{ paddingTop: "20px" }}>
        {loading && page === 1 ? (
          <CircularProgress />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {products.map((product, index) => (
              <div key={index} style={{ width: '200px', border: '1px solid #ddd', borderRadius: '8px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', textAlign: 'center' }}>
                <div>
                  <img
                    src={`${supabaseUrl}/storage/v1/render/image/public/images/${product.part}.jpg?width=200&height=200`}
                    alt={product.partName}
                    style={{ width: '100%', height: 'auto', marginBottom: '8px' }}
                    onError={imageOnError}
                  />
                  <Typography variant="h6" component="div">
                    {product.partName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginBottom: '8px' }}>
                    {product.partDes}
                  </Typography>
                  <Typography variant="body1" color="text.primary" style={{ marginBottom: '8px' }}>
                    {product.price > 0 ? currencyFormat(product.price) : "*"}
                  </Typography>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  {product.price > 0 ? (
                    <AddButton item={product} />
                  ) : (
                    <Button variant="outlined" size="small" style={{ marginBottom: '8px' }}>
                      בקש הצעת מחיר
                    </Button>
                  )}
                  <DetailsButton partName={product.partName} partDes={product.partDes} part={product.part} />
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && page > 1 && <CircularProgress />}
      
      </div>
    </Container>
  );
};

export default ProductList;
