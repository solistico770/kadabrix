
import AddButton from "./addButton";
import DetailsButton from "./detailsButton";
import imageOnError from '../../kadabrix/imgErr.js';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import { FaEye } from "react-icons/fa";


const Product = ({ img, product }) => {
  const currencyFormat = (num) => {
    num = Number(num);
    return '₪' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };


  return (


    <div className="flex flex-col hover:bg-[rgb(208,152,248,0.2)] items-stretch duration-300  group border  rounded-2xl border-primary w-[300px] md:w-[150px] sm:w-[75px] ">
      <div className="flex justify-center  h-[200px]   md:h-[150px] sm:h-[75px]" >
        <img
          src={img}
          className="mix-blend-multiply h-full w-10/12 object-contain"
          alt=""
          onError={imageOnError}

        />
      </div>
      
      <div className="flex bg-[rgb(208,152,248,0.2)]  h-full flex-col relative text-center ">
        <div
          title="view product"
          className="group-hover:opacity-100 duration-300 opacity-0 sm:opacity-100 absolute -top-7 right-3 text-sm"
        >
          <button
            className="rounded-full  size-10 grid place-items-center font-medium text-lg mt-3 duration-200 text-white  bg-primary group-hover:shadow-sm border-2"

          >
            <FaEye />
          </button>
        </div>
        <div className="">
          <h4>{product.partName}</h4>
          <h3 className=" text-base sm:text-xs">{product.partDes}</h3>
        </div>

        <div className="">

          <h4 className="text-primary font-medium text-xl">₪{product.price}</h4>
        </div>


        <div className="mt-auto">

        <AddButton item={product} />
        
        </div>
        

        

      </div>

    </div>



  )



};

export default Product;
