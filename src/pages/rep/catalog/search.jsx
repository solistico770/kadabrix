import React, { useEffect, useState } from 'react';
import kdb from '../../../kadabrix/kadabrix';


const SearchAndFilterFirstLine = ({ searchTerm, setSearchTerm, filters, setFilters, setPage }) => {


  const resetSearch = () => {
    setSearchTerm('');
    setPage(1);
  };



  return (
    <>
      <div className="sticky  z-50 top-0 p-5 bg-white flex items-center gap-3 justify-center sm:flex-col">
        <div className="relative w-6/12 md:w-11/12">
          <input
            type="text"
            placeholder="חיפוש"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full h-12 border border-primary rounded-lg outline-none pr-4"
          />
          <button
            onClick={resetSearch}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="gap-1  flex flex-row w-6/12 md:full-width">


          <div className="rounded-md bg-[rgb(208,152,248,0.2)] text-sm sm:text-xs border border-primary px-2  h-12 flex sm:flex-col  items-center">
            <span className="  text-gray-900 dark:text-gray-300">במלאי</span>
            <label className="inline-flex items-center cursor-pointer w-full">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={filters.inStock}
                onChange={() =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    inStock: !filters.inStock,
                  }))
                }
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

          </div>


          <div className="rounded-md bg-[rgb(208,152,248,0.2)] text-sm sm:text-xs border border-primary px-2   flex sm:flex-col  items-center">
            <span className="  text-gray-900 dark:text-gray-300">רכישות</span>
            <label className="inline-flex items-center cursor-pointer w-full">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={filters.purchased}
                onChange={() =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    purchased: !filters.purchased,
                  }))
                }
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

          </div>

        </div>


      </div>






    </>
  );
};

export default SearchAndFilterFirstLine;
