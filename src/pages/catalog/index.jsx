"use client";

import { useState, useEffect } from 'react';
import kdb from "../../kadabrix/kadabrix";
import {
  Container,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Typography
} from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;



  
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
      "data": { searchTerm: searchTerm,limit:limit,page:page}
    });



    setProducts([...products, ...data] );
    setHasMore(data.length === limit);
    setPage(page + 1);

    //      setTotalResults(countData[0].count);

  }

  const handleLoadMore = () => {
    fetchProducts();
  };

  const currencyFormat = (num) => {
    num=Number(num);

    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 } 
 

 const addProduct = async (item) => {

  let data = await kdb.run({
    "module": "kdb_cart",
    "name": "addItem",
    "data": { 
        part:item.part,
        partName:item.partName,
        partDes:item.partDes,
        price:item.price
     }
  });
 }



  return (
    <Container style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <div style={{ flex: '0 0 auto', padding: '16px' }}>
        <TextField
          label="חיפוש"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          style={{ marginBottom: '16px' }}
        />
       
        <Typography variant="h6">
          {totalResults} תוצאות נמצאו
        </Typography>
      </div>
      <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
        {loading && page === 1 ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>תמונה</TableCell>
                  <TableCell>שם חלק</TableCell>
                  <TableCell>תיאור</TableCell>
                  <TableCell>מחיר</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.part}>
                    <TableCell>
                      <img
                        src={`https://heuayknlgusdwimnjbgs.supabase.co/storage/v1/render/image/public/images/${product.part}.jpg?width=200&height=200`}
                        alt={product.partName}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    </TableCell>
                    <TableCell>{product.partName}</TableCell>
                    <TableCell>{product.partDes}</TableCell>
                    <TableCell>{currencyFormat(product.price)}</TableCell>
                    <Button onClick={() => addProduct(product) }>add</Button>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {loading && page > 1 && <CircularProgress />}
        {!loading && hasMore && (
          <Button onClick={handleLoadMore} style={{ marginTop: '16px' }}>
            עוד
          </Button>
        )}
      </div>
    </Container>
  );
};

export default ProductList;
