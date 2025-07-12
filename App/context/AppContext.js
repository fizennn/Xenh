import axios from 'axios';
import { BASE_URL } from '../constants/api';
import React, { createContext, useEffect, useState } from 'react';

// Tạo context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [wardrobes, setWardrobes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes, itemsRes, wardrobesRes, favoritesRes, savedPostsRes, notificationsRes, commentsRes] = await Promise.all([
          axios.get(`${BASE_URL}/posts`),
          axios.get(`${BASE_URL}/users`),
          axios.get(`${BASE_URL}/items`),
          axios.get(`${BASE_URL}/wardrobes`),
          axios.get(`${BASE_URL}/favorites`),
          axios.get(`${BASE_URL}/savedPosts`),
          axios.get(`${BASE_URL}/notifications`),
          axios.get(`${BASE_URL}/comments`),
        ]);
        const postsData = postsRes.data;
        const usersData = usersRes.data;
        const itemsData = itemsRes.data;
        const wardrobesData = wardrobesRes.data;
        const favoritesData = favoritesRes.data;
        const savedPostsData = savedPostsRes.data;
        const notificationsData = notificationsRes.data;
        const commentsData = commentsRes.data;
        // Join user vào từng post
        const postsWithUser = postsData.map(post => ({
          ...post,
          user: usersData.find(u => String(u.id) === String(post.userId)) || null
        }));
        setPosts(postsWithUser);
        setUsers(usersData);
        setItems(itemsData);
        setWardrobes(wardrobesData);
        setFavorites(favoritesData);
        setSavedPosts(savedPostsData);
        setNotifications(notificationsData);
        setComments(commentsData);
        setUser(usersData[0] || null);
        setFollowing(usersData.length > 1 ? [usersData[1]?.id, usersData[2]?.id].filter(Boolean) : []);
      } catch (err) {
        setPosts([]);
        setUsers([]);
        setItems([]);
        setWardrobes([]);
        setFavorites([]);
        setSavedPosts([]);
        setNotifications([]);
        setComments([]);
        setUser(null);
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Thêm bài đăng mới
  const addPost = (post) => {
    // Join user vào post mới dựa trên userId
    const postWithUser = {
      ...post,
      user: users.find(u => String(u.id) === String(post.userId)) || null
    };
    setPosts([postWithUser, ...posts]);
  };

  // Like một bài đăng
  const likePost = (postId) => {
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // Thêm bình luận cho bài đăng (đẩy lên server)
  const addComment = async (postId, comment) => {
    try {
      const res = await axios.post(`${BASE_URL}/comments`, comment);
      setComments(prev => [res.data, ...prev]);
    } catch (err) {
      alert('Không thể gửi bình luận!');
    }
  };

  // Thêm favorite
  const addFavorite = async (favorite) => {
    try {
      const res = await axios.post(`${BASE_URL}/favorites`, favorite);
      setFavorites(prev => [res.data, ...prev]);
    } catch (err) {
      alert('Không thể thêm yêu thích!');
    }
  };

  // Xóa favorite
  const removeFavorite = async (favoriteId) => {
    try {
      await axios.delete(`${BASE_URL}/favorites/${favoriteId}`);
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
    } catch (err) {
      alert('Không thể xóa yêu thích!');
    }
  };

  // Thêm savedPost
  const addSavedPost = async (savedPost) => {
    try {
      const res = await axios.post(`${BASE_URL}/savedPosts`, savedPost);
      setSavedPosts(prev => [res.data, ...prev]);
    } catch (err) {
      alert('Không thể lưu bài!');
    }
  };

  // Xóa savedPost
  const removeSavedPost = async (savedPostId) => {
    try {
      await axios.delete(`${BASE_URL}/savedPosts/${savedPostId}`);
      setSavedPosts(prev => prev.filter(s => s.id !== savedPostId));
    } catch (err) {
      alert('Không thể bỏ lưu bài!');
    }
  };

  // Theo dõi một người dùng
  const followUser = (userId) => {
    if (!following.includes(userId)) setFollowing([...following, userId]);
  };

  // Bỏ theo dõi một người dùng
  const unfollowUser = (userId) => {
    setFollowing(following.filter(id => id !== userId));
  };

  const loginUser = (userObj) => setUser(userObj);

  const setUserAndSyncPosts = (newUser) => {
    setUser(newUser);
    setPosts(posts =>
      posts.map(post =>
        String(post.userId) === String(newUser.id)
          ? { ...post, user: newUser }
          : post
      )
    );
  };

  return (
    <AppContext.Provider value={{
      user, setUser, loginUser, posts, setPosts, users, setUsers, items, setItems, wardrobes, setWardrobes, favorites, setFavorites, savedPosts, setSavedPosts, notifications, setNotifications, comments, setComments, addPost, likePost, addComment, addFavorite, removeFavorite, addSavedPost, removeSavedPost, following, followUser, unfollowUser, loading, setUserAndSyncPosts
    }}>
      {children}
    </AppContext.Provider>
  );
}; 