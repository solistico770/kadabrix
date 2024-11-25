import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Typography, Card, CardContent, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import Slider from "react-slick";

const SubCats = (props) => {

  

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
        props.setCat(catId);
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small">
                {Array.isArray(props.children) && props.children.length > 0 && (
                    <ExpandMoreIcon fontSize="small" />
                )}
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {props.children && Array.isArray(props.children) ? (
                    props.children.map((child, index) => (
                        <MenuItem key={index} onClick={(e) => handleClickCat(child.id, e)}>
                            {child.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem onClick={handleClose}>
                        {props.children ? props.children.name : 'No subcategories available'}
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

const CatalogCats = (props) => {

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


    const [cats, setCats] = useState([]);
    const childrenOf = (father) => {
        return cats.filter((cat) => cat.father === father);
    };

    useEffect(() => {
        const fetchCats = async () => {
            try {
                let data = await kdb.run({
                    module: "catalog",
                    name: "getCats",
                });
                setCats(data);
            } catch (error) {
                console.error("Error fetching catalog categories:", error);
            }
        };
        fetchCats();
    }, []);

    
    
        const settings = {
          arrows: true,
          infinite: false,
          speed: 500,
          slidesToShow: 9, // Default number of slides to show
          slidesToScroll: 5, // Default number of slides to scroll

          initialSlide:cats ,
          responsive: [
            {
              breakpoint: 1200, // For large tablets and desktops
              settings: {
                slidesToShow: 8,
                slidesToScroll: 5,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 1024, // For tablets in landscape
              settings: {
                slidesToShow: 6,
                slidesToScroll: 4,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 768, // For tablets in portrait mode
              settings: {
                slidesToShow: 4,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 600, // For larger mobile devices
              settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
                initialSlide: 1,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 480, // For smaller mobile devices
              settings: {
                slidesToShow: 6,
                slidesToScroll: 4,
                infinite: true,
                dots: true,
              },
            },
          ],
        };

        
const cardHeight=viewSize([
    { from: 0, to: 480, size: 60 },
    { from: 481, to: 99999, size: 118 },
  ],winw);

  const cardWidth=viewSize([
    { from: 0, to: 480, size: 140 },
    { from: 481, to: 99999, size: 190 },
  ],winw);


  return (
        <div className="slider-container">
        <Slider {...settings}>
        
            
            {cats.filter((cat) => cat.father === 0).map((category, index) => (
                <div>
                <Card
                    key={index}
                    onClick={() => props.setCat(category.id)}
                    sx={{
                        width: cardHeight,
                        height: cardWidth,
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease-in-out', // Smooth transition
                        '&:hover': {
                            transform: 'scale(1.05)', // Grow slightly on hover
                        },
                    }}
                >
                    <CardMedia
                        component="img"
                        height="{cardHeight}"
                        image={`${supabaseUrl}/storage/v1/render/image/public/cats/${category.id}.jpg?width=118&height=118`}
                        alt={category.name}
                    />
                    <CardContent style={{ padding: '4px' }}>

                        <Typography
                            variant="subtitle2"
                            component="div"
                            align="center"
                            sx={{ fontWeight: 'bold', mt: 1 }}
                        >
                            {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.75rem' }}>
                            {category.description}
                        </Typography>
                        <SubCats setCat={props.setCat} children={childrenOf(category.id)} />
                    </CardContent>
                </Card>
                    </div>
                

            ))}
            
        
        </Slider>
        </div>
        
    );
};

export default CatalogCats;
