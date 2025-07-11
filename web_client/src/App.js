import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Users from './components/pages/Users';
import Settings from './components/pages/Settings';
import Posts from './components/pages/Posts';
import Items from './components/pages/Items';
import Wardrobes from './components/pages/Wardrobes';
import PrivateRoute from './components/auth/PrivateRoute';
import SavedPosts from './components/pages/SavedPosts';
import Favorites from './components/pages/Favorites';
import Notifications from './components/pages/Notifications';
import Comments from './components/pages/Comments';
import Suggestions from './components/pages/Suggestions';

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
        <Route path="items" element={<Items />} />
        <Route path="settings" element={<Settings />} />
        <Route path="posts" element={<Posts />} />
        <Route path="wardrobes" element={<Wardrobes />} />
        <Route path="saved-posts" element={<SavedPosts />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="comments" element={<Comments />} />
        <Route path="suggestions" element={<Suggestions />} />
      </Route>
    </Routes>
  );
}

export default App;