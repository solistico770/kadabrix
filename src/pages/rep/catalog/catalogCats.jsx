import React, { useState, useEffect } from 'react';
import kdb from '../../../kadabrix/kadabrix';
import { Typography, Card, CardContent, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import { supabaseUrl } from "../../../kadabrix/kdbConfig";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


const Cat = ({ category,setCat,children }) => {


    return (
        <div 
            onClick={() => setCat(category.id)}

        className="swiper-slide flex justify-center items-center text-center w-[160px] h-[200px]  md:w-[120px] md:h-[250px] sm:w-[100px] sm:h-[150px] "
        
    >
        <div
            className="hover:bg-[rgb(208,152,248,0.2)] duration-300 w-full h-[calc(100%/1.7)]  mb-3 group border rounded-2xl border-primary flex flex-col items-center cursor-pointer "
        >
            <img
                src={`${supabaseUrl}/storage/v1/render/image/public/cats/${category.id}.jpg?width=120&height=120&resize=contain`}
                className="size-20 mix-blend-hue sm:size-10"
                alt={category.name}

            />
            <div className="flex items-center gap-2">
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z"></path>
                </svg>
                <h4 className="sm:text-sm">
                    {category.name}
                </h4>
            </div>
        </div>
        <div className="absolute -bottom-60 left-0 w-full bg-white border border-primary rounded-md shadow-lg group-hover:flex flex-col z-50">
            <SubCats setCat={setCat} children={children}/>
        </div>
    </div>

    )

}


const SubCats = (category,setCat,children) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickCat = (catId, e) => {
        handleClose();
        e.stopPropagation();
        setCat(catId);
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small">
                {Array.isArray(children) && children.length > 0 && (
                    <ExpandMoreIcon fontSize="small" />
                )}
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {children && Array.isArray(children) ? (
                    children.map((child, index) => (
                        <MenuItem key={index} onClick={(e) => handleClickCat(child.id, e)}>
                            {child.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem onClick={handleClose}>
                        {children ? children.name : 'No subcategories available'}
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

const CatalogCats = ({setCat}) => {


    const [cats, setCats] = useState([]);
    const childrenOf = (father) => {
        return cats.filter((cat) => cat.father === father);
    };

    useEffect(() => {
        const fetchCats = async () => {
            try {
                let data = await kdb.run({
                    module: "repCatalog",
                    name: "getCats",
                });
                setCats(data);
            } catch (error) {
                console.error("Error fetching catalog categories:", error);
            }
        };
        fetchCats();
    }, []);



    return (
        <Swiper
            navigation={false}
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={9}
            pagination={{ clickable: true }}
            breakpoints={{
                1800: { slidesPerView: 7 },
                1535: { slidesPerView: 6 },
                1024: { slidesPerView: 6 },
                991: { slidesPerView: 4 },
                768: { slidesPerView: 4 },
                540: { slidesPerView: 4 },
                385: { slidesPerView: 4 },
                325: { slidesPerView: 3 },
                1: { slidesPerView: 2 }
            }}
        >
            {cats.filter((cat) => cat.father === 0).map((category, index) => (
                <SwiperSlide key={index}>
                    <Cat category={category} setCat={setCat} children={childrenOf(category.id)} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CatalogCats;

