import React, { useEffect, useState } from 'react';
import kdb from '../../kadabrix/kadabrix';
import Select from 'react-select';


const SearchAndFilterFirstLine = ({ searchTerm, setSearchTerm, filters, setFilters, setPage }) => {
  const [carSearch, setCarSearch] = useState('');
  const [carSearchVisible, setCarSearchVisible] = useState(false);
  const [carSearchStatus, setCarSearchStatus] = useState('');
  const [carData, setCarData] = useState(null);
  const [isSecondLineVisible, setIsSecondLineVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [oemSearchVisible, setOemSearchVisible] = useState(false); // State for OEM search visibility
  const [oemSearch, setOemSearch] = useState(''); // State for OEM search value

  const [selectedCcDes, setSelectedCcDes] = useState(null);
  const [selectedCarModel, setSelectedCarModel] = useState(null);
  const [selectedSgDes, setSelectedSgDes] = useState(null);
  const [yearInput, setYearInput] = useState('');


  const [ccDesList, setCcDesList] = useState([]);
  const [carModelList, setCarModelList] = useState([]);
  const [sgDesList, setSgDesList] = useState([]);

  const fetchCcDes = async () => {
    try {
      const response = await kdb.run({
        module: "catalogZB",
        name: "ccDes",
        data: {}
      });
      setCcDesList(
        response.map(row => ({ value: row.ccDes, label: row.ccDes })) || []
      );
    } catch (error) {
      console.error("Error fetching ccDes:", error);
    }
  };

  // Fetch Groups (sgDes)
  const fetchSgDes = async () => {
    try {
      const response = await kdb.run({
        module: "catalogZB",
        name: "sgDes",
        data: {}
      });
      setSgDesList(
        response.map(row => ({ value: row.sgDes, label: row.sgDes })) || []
      );
    } catch (error) {
      console.error("Error fetching sgDes:", error);
    }
  };

  useEffect(() => {
    fetchCcDes();
    fetchSgDes();
  }, []);




  const handleCcDesChange = async (selectedOption) => {
    setSelectedCcDes(selectedOption);
    setFilters(prevFilters => ({ ...prevFilters, ccDes: selectedOption.value }));
    try {
      const response = await kdb.run({
        module: "catalogZB",
        name: "carModel",
        data: { ccDes: selectedOption.value }
      });
      setCarModelList(
        response.map(row => ({ value: row.carModelDes, label: row.carModelDes })) || []
      );
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const handleCarModelChange = (selectedOption) => {
    setSelectedCarModel(selectedOption);
    setFilters(prevFilters => ({ ...prevFilters, carModel: selectedOption.value }));
  };

  const handleSgDesChange = (selectedOption) => {
    setSelectedSgDes(selectedOption);
    setFilters(prevFilters => ({ ...prevFilters, sgDes: selectedOption.value }));
  };

  const handleYearInput = (value) => {
    setYearInput(value);
    setFilters(prevFilters => ({ ...prevFilters, year: value }));
  };

  const handleOemSearch = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      oem: oemSearch,
    }));
  };

  const handleCarSearch = async () => {
    if (carSearch.trim() === '') return;

    setIsSearching(true);
    setCarSearchStatus('');

    try {
      const response = await kdb.run({
        module: "catalogZB",
        name: "carno2ktype",
        data: { carNumber: carSearch }
      });

      if (response && response.length > 0) {
        setCarData(response[0]);
        setCarSearchStatus('success');
        setFilters(prevFilters => ({
          ...prevFilters,
          ktype: response[0].KTYPE_1
        }));

        setYearInput(response[0].SHNAT_YITZUR);

      } else {
        setCarData(null);
        setCarSearchStatus('error');
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
      setCarSearchStatus('error');
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setOemSearchVisible(false);
    setIsSecondLineVisible(false);
    setSearchTerm('');
    setCarSearch('');
    setCarSearchStatus('');
    setCarSearchVisible(false);
    setCarData(null);
    setFilters({});
    setPage(1);

    setYearInput('');
    setSelectedSgDes('');
    setSelectedCarModel('');
    setSelectedCcDes('');

    setPage(1);
  };

  const renderCarData = () => {
    if (!carData) return null;

    const fields = {
      "MISGERET": "מסגרת",
      "DEGEM_MANOA": "דגם מנוע",
      "TZEVA_RECHEV": "צבע רכב",
      "TOZERET_NM": "יצרן",
      "SHNAT_YITZUR": "שנת ייצור",
      "SUG_DELEK_NM": "סוג דלק",
      "RAMAT_GIMUR": "רמת גימור",
      "KINUY_MISHARI": "כינוי מסחרי",
      "NEFAH_MANOA": "נפח מנוע",
      "HAANA_NM": "הנעה",
      "MISPAR_DLATOT": "מספר דלתות",
      "KOAH_SUS": "כוח סוס",
      "MERKAV": "מרכב",
    };

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded shadow-md">
        {Object.entries(fields).map(([key, label]) => (
          <>
            <span className="font-bold text-sm">{label}:</span>
            <span className="text-xs">{carData[key] || ""}</span>
            <div className="inline-block h-2 w-2 bg-green-500 rounded-full"></div>
          </>
        ))}
      </div>
    );
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
