import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Typography, Card, CardContent, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import { supabaseUrl } from "../../kadabrix/kdbConfig";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {cats.filter((cat) => cat.father === 0).map((category, index) => (
                <Card
                    key={index}
                    onClick={() => props.setCat(category.id)}
                    style={{ width: '150px', cursor: 'pointer' }}
                >
                    <CardMedia
                        component="img"
                        height="100"
                        image={`${supabaseUrl}/storage/v1/render/image/public/cats/${category.id}.jpg?width=80&height=80`}
                        alt={category.name}
                    />
                    <CardContent style={{ padding: '4px' }}>
                        <Typography variant="subtitle2" component="div">
                            {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.75rem' }}>
                            {category.description}
                        </Typography>
                        <SubCats setCat={props.setCat} children={childrenOf(category.id)} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CatalogCats;
