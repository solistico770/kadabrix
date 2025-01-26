import React, { useState } from 'react';
import AddButton from "./addButton.jsx";
import imageOnError from '../../../kadabrix/imgErr.js';
import { FaEye } from "react-icons/fa";
import { supabaseUrl } from "../../../kadabrix/kdbConfig";
import "./product.css";
import DetailsButton from './detailsButton.jsx';

const Product = ({ product }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (  


    
        // Product card container with smooth transitions
        <div  key={product.partName} className="bg-white rounded-xl shadow-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:translate-y-1 hover:shadow-lg 
                        border border-gray-100 hover:border-primary/30 h-full flex flex-col max-w-[300px] 
                        animate-fadeIn">
          
          {/* Image section - Fixed aspect ratio */}
          <div className="relative pt-[100%] w-full overflow-hidden rounded-t-xl">
            <img
              src={`${supabaseUrl}/storage/v1/render/image/public/images/${product.part}.jpg?width=200&height=200`}
              alt={product.partName}
              onError={imageOnError}
              className="absolute inset-0 w-full h-full object-contain p-4 bg-white transition-all duration-300"
            />
          </div>

          {/* Content section */}
          <div className="flex flex-col flex-grow p-4">
            {/* Product name - single line with ellipsis */}
            <h4 className="font-semibold text-gray-800 line-clamp-1 mb-2">
              {product.partName}
            </h4>
            
            {/* Description - two lines with ellipsis */}
            <h3 className="text-gray-600 mb-4">
              {product.partDes}
            </h3>

            {/* Price and actions section - pushed to bottom */}
            <div className="mt-auto space-y-3">
              {/* Price and quantity row */}
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-lg">₪{product.price}</span>
                <span className="text-gray-500 font-medium">#{product.tQuant}</span>
              </div>

              {/* Add Button */}
              <div className="">
                <AddButton item={product} className="bg-primary hover:bg-primary/90 text-white rounded-lg py-2 px-4 transition-colors" />
              </div>

              {/* View Details Button */}
              <button className="hover:text-primary transition-colors"
              onClick={() => setIsPopupOpen(true)}
              >
                <FaEye size={20} />
              </button>

            </div>
          </div>
          
      <DetailsButton
      
        part={product.part}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />

        </div>
      


  )
};

const Products = ({ products }) => {

  return (
    // Main grid container
    <div className="productbox grid 
                xxl:text-xl
                2xl:text-xl
                xl:text-xl 
                lg:text-lg 
                slg:text-base 
                md:text-base 
                sm:text-sm 
                xsm:text-sm  
                xxsm:text-lg
                xxl:grid-cols-5
                2xl:grid-cols-5
                xl:grid-cols-4
                lg:grid-cols-4
                slg:grid-cols-3
                md:grid-cols-3
                sm:grid-cols-2 
                xsm:grid-cols-2 
                xxsm:grid-cols-1
                gap-6
                p-6">
      {products.map((product) => (
        <>
          <Product product={product} />
          </>
        ))}
    </div>
  );
}

export default Products;
