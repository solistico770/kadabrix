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
  const [families, setFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    const fetchFamilies = async () => {
      const baseQuery = `SELECT DISTINCT "familyDes" FROM _collection_part WHERE "flagActive" = '1'`;
      const { data, error } = await kdb.rpc('execute_user_query', { query_text: baseQuery });

      if (error) {
        console.error(error);
      } else {
        setFamilies(data.map(item => item.result.familyDes));
      }
    };

    fetchFamilies();
  }, []);

  useEffect(() => {
    fetchProducts(true);
  }, [searchTerm, selectedFamily]);

  const fetchProducts = async (reset = false) => {
    setLoading(true);
    const offset = reset ? 0 : (page - 1) * limit;

    let baseQuery = `SELECT * FROM _collection_part WHERE "flagActive" = '1'`;

    if (selectedFamily) {
      baseQuery = `${baseQuery} AND "familyDes" = '${selectedFamily}'`;
    }

    if (searchTerm) {
      const searchTerms = searchTerm.split(' ');
      const searchConditions = searchTerms.map(term => `("partName" ILIKE '%${term}%' OR "partDes" ILIKE '%${term}%')`);
      const combinedCondition = searchConditions.join(' AND ');
      baseQuery = `${baseQuery} AND ${combinedCondition}`;
    }

    baseQuery = `${baseQuery} LIMIT ${limit} OFFSET ${offset}`;

    const { data, error } = await kdb.rpc('execute_user_query', { query_text: baseQuery });

    if (error) {
      console.error('Error executing query:', error);
    } else {
      setProducts(reset ? data : [...products, ...data]);
      setHasMore(data.length === limit);
      setPage(page + 1);
    }

    // Fetch total count
    const countQuery = baseQuery.replace('SELECT *', 'SELECT COUNT(*) as count');
    const { data: countData, error: countError } = await kdb.rpc('execute_user_query', { query_text: countQuery });

    if (countError) {
      console.error('Error executing count query:', countError);
    } else {
      setTotalResults(countData[0].result.count);
    }

    setLoading(false);
  };

  const handleLoadMore = () => {
    fetchProducts();
  };

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
        <TextField
          select
          label="בחר משפחה"
          value={selectedFamily}
          onChange={(e) => { setSelectedFamily(e.target.value); setPage(1); }}
          variant="outlined"
          fullWidth
          style={{ marginBottom: '16px' }}
        >
          <MenuItem value="">
            <em>כל המשפחות</em>
          </MenuItem>
          {families.map((family) => (
            <MenuItem key={family} value={family}>
              {family}
            </MenuItem>
          ))}
        </TextField>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.result.part}>
                    <TableCell>
                      <img
                        src={`https://heuayknlgusdwimnjbgs.supabase.co/storage/v1/render/image/public/images/${product.result.part}.jpg?width=200&height=200`}
                        alt={product.result.partName}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    </TableCell>
                    <TableCell>{product.result.partName}</TableCell>
                    <TableCell>{product.result.partDes}</TableCell>
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
