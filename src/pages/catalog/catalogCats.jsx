import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Typography, Card, CardContent, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

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

    const viewSize = (ranges, size) => {
        for (let range of ranges) {
            if (size >= range.from && size <= range.to) {
                return range.size;
            }
        }
        return null;
    };

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

    const cardHeight = viewSize([
        { from: 0, to: 600, size: 60 },
        { from: 600, to: 99999, size: 118 },
    ], winw);

    const cardWidth = viewSize([
        { from: 0, to: 600, size: 140 },
        { from: 600, to: 99999, size: 190 },
    ], winw);

    return (
            <Swiper
                navigation={false}
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={9}
                pagination={{ clickable: true }}
                breakpoints={{
                    1200: { slidesPerView: 8 },
                    1024: { slidesPerView: 6 },
                    768: { slidesPerView: 4 },
                    600: { slidesPerView: 3 },
                    480: { slidesPerView: 6 },
                    1: { slidesPerView: 6   },
                }}
            >
                {cats.filter((cat) => cat.father === 0).map((category, index) => (
                    <SwiperSlide key={index}>
                        <Card
                            onClick={() => props.setCat(category.id)}
                            sx={{
                                width: cardHeight,
                                height: cardWidth,
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height={cardHeight}
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
                    </SwiperSlide>
                ))}
            </Swiper>
    );
};

export default CatalogCats;
