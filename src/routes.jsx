
  import React from 'react';
  import { Routes, Route } from 'react-router-dom';

  import CatalogIndex from './pages/catalog/index.jsx';
import LoginIndex from './pages/login/index.jsx';
import NotesIndex from './pages/notes/index.jsx';

  const AppRoutes = () => (
    <Routes>
      <Route path="/catalog" element={<CatalogIndex />} />
<Route path="/login" element={<LoginIndex />} />
<Route path="/notes" element={<NotesIndex />} />
    </Routes>
  );

  export default AppRoutes;
  