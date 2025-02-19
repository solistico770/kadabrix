import { useState, useEffect ,useRef } from 'react';
import { CircularProgress } from '@mui/material';
import kdb from "../../../kadabrix/kadabrix.js";
import Products from './product.jsx';
import Search from './search.jsx';
import CatalogCats from './catalogCats.jsx'

import InfiniteScroll from 'react-infinite-scroller';

let timoutHandler = null;
let loadPreventor = false;



  
  


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [catId, setCatId] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    inStock: false,
    purchased: false,
    oem: false,
    byCarNumber: false,
  });

  const limit = 100;

  const setCat = (cat)=>{
    setCatId(cat  )


  }
  
  useEffect(() => {
      window.scrollTo({
        top: 0, // Scroll to the top
        behavior: "smooth", // Smooth scrolling effect
      });
    setPage(1);
  }, [filters]);





  useEffect(() => {  
      const handler = setTimeout(() => {
      fetchProducts()

    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm,catId,page,filters]);

  

  const fetchProducts = async () => {
    setLoading(true);
    const data = await kdb.run({
      module: 'catalog',
      name: 'getProducts',
      data: { cat: catId, searchTerm, limit, page, filters },
    });
    setLoading(false);
    setProducts((prevProducts) =>
      page === 1 ? data : [...prevProducts, ...data]
    );
    setHasMore(data.length === limit);
  };

  
  const loadFunc = (infinitePage) => {
    if (loadPreventor) {
      return;
    }

    loadPreventor = true;
    setPage(page+1);

    if (timoutHandler) {
      clearTimeout(timoutHandler);
    }
    
    timoutHandler = setTimeout(() => {
      
      loadPreventor = false;
  
    }, 2000);

  };

  
  return (
    <>
     
     
  
      <div className="max-w-[1400px] mx-auto">
        <CatalogCats setCat={setCat} />
        <Search
          initialLoad={false}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          setPage={setPage}
        />
        <div>
        {loading && (<CircularProgress />)}
        <InfiniteScroll
    pageStart={1}
    threshold={100}
    initialLoad={false}
    loadMore={loadFunc}
    hasMore={true }
>
<Products products={products}
                />

          
          {products.length==0 && !loading && (

            <div className="text-center text-gray-500"> No products found</div>

          ) }


</InfiniteScroll>
{loading && (<CircularProgress />)}

    
        </div>
      </div>
    </>
  );
};

export default ProductList;
