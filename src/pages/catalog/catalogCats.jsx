import React, { useState, useEffect } from 'react';
import kdb from '../../kadabrix/kadabrix';
import { Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import {supabaseUrl} from "../../kadabrix/kdbConfig"

const CatalogCats = () => {
    const [cats, setCats] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                let data = await kdb.run({
                    module: "catalog",
                    name: "getCats"
                });
                setCats(data);
            } catch (error) {
                console.error("Error fetching catalog categories:", error);
            }
        };
        fetchCats();
    }, []);

    return (
        <Grid container spacing={4}>
            {cats.map((category, index) => (
                <Grid item xs={12} sm={3} md={2} key={index}>
                    <Card>
                    <CardMedia
                        component="img"
                        height="100"
                        image={`${supabaseUrl}/storage/v1/render/image/public/cats/${category.id}.jpg?width=101&height=101`}
                        alt={category.name}
                        />

                        <CardContent>
                            <Typography variant="h7" component="div">
                                {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {category.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default CatalogCats;
