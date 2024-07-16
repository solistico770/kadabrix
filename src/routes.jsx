
  import React from 'react';
  import { Routes, Route } from 'react-router-dom';

  import CatalogIndex from './pages/catalog/index.jsx';
import LoginIndex from './pages/login/index.jsx';
import MenuIndex from './pages/menu/index.jsx';
import NotesIndex from './pages/notes/index.jsx';
import SignupIndex from './pages/signup/index.jsx';
import UsersIndex from './pages/users/index.jsx';

  const AppRoutes = () => (
    <Routes>
      <Route path="/catalog" element={<CatalogIndex />} />
<Route path="/login" element={<LoginIndex />} />
<Route path="/menu" element={<MenuIndex />} />
<Route path="/notes" element={<NotesIndex />} />
<Route path="/signup" element={<SignupIndex />} />
<Route path="/users" element={<UsersIndex />} />
    </Routes>
  );

  export default AppRoutes;
  