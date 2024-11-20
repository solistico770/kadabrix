import React from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FlightIcon from '@mui/icons-material/Flight';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MapIcon from '@mui/icons-material/Map';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import PetsIcon from '@mui/icons-material/Pets';

// Mock Data for Menu Items
const menuItems = [
  { id: 1, label: 'Home', icon: <HomeIcon fontSize="large" /> },
  { id: 2, label: 'About', icon: <InfoIcon fontSize="large" /> },
  { id: 3, label: 'Settings', icon: <SettingsIcon fontSize="large" /> },
  { id: 4, label: 'Contact', icon: <ContactMailIcon fontSize="large" /> },
  { id: 5, label: 'Shop', icon: <ShoppingCartIcon fontSize="large" /> },
  { id: 6, label: 'Favorites', icon: <FavoriteIcon fontSize="large" /> },
  { id: 7, label: 'Fitness', icon: <FitnessCenterIcon fontSize="large" /> },
  { id: 8, label: 'Travel', icon: <FlightIcon fontSize="large" /> },
  { id: 9, label: 'Dining', icon: <LocalDiningIcon fontSize="large" /> },
  { id: 10, label: 'Music', icon: <MusicNoteIcon fontSize="large" /> },
  { id: 11, label: 'Education', icon: <SchoolIcon fontSize="large" /> },
  { id: 12, label: 'Work', icon: <WorkIcon fontSize="large" /> },
  { id: 13, label: 'Sports', icon: <SportsSoccerIcon fontSize="large" /> },
  { id: 14, label: 'Photography', icon: <CameraAltIcon fontSize="large" /> },
  { id: 15, label: 'Maps', icon: <MapIcon fontSize="large" /> },
  { id: 16, label: 'Health', icon: <LocalHospitalIcon fontSize="large" /> },
  { id: 17, label: 'Transport', icon: <DirectionsCarIcon fontSize="large" /> },
  { id: 18, label: 'Library', icon: <LocalLibraryIcon fontSize="large" /> },
  { id: 19, label: 'Movies', icon: <LocalMoviesIcon fontSize="large" /> },
  { id: 20, label: 'Pets', icon: <PetsIcon fontSize="large" /> },
];

const MainMenu = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 1 ,
      display: 'flex',
      flexDirection: 'column',

      backgroundColor: '#ef12ff',

    }}>
      <Grid container spacing={2} justifyContent="center">
        {menuItems.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                backgroundColor: '#fafafa',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <IconButton color="primary" size="large">
                {item.icon}
              </IconButton>
              <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MainMenu;
