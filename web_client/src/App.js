import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Users from './components/pages/Users';
import Products from './components/pages/Products';
import Settings from './components/pages/Settings';
import Posts from './components/pages/Posts';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="settings" element={<Settings />} />
        <Route path="posts" element={<Posts />} />
      </Route>
    </Routes>
  );
}

export default App;