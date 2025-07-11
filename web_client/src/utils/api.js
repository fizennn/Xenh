// Base URL của server JSON
const BASE_URL = 'http://192.168.100.163:3000';

// Hàm chung để gọi API
async function apiRequest(endpoint, method = 'GET', data) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// USERS CRUD
export const getUsers = () => apiRequest('/users');
export const getUser = (id) => apiRequest(`/users/${id}`);
export const createUser = (user) => apiRequest('/users', 'POST', user);
export const updateUser = (id, user) => apiRequest(`/users/${id}`, 'PUT', user);
export const deleteUser = (id) => apiRequest(`/users/${id}`, 'DELETE');

// POSTS CRUD
export const getPosts = () => apiRequest('/posts');
export const getPost = (id) => apiRequest(`/posts/${id}`);
export const createPost = (post) => apiRequest('/posts', 'POST', post);
export const updatePost = (id, post) => apiRequest(`/posts/${id}`, 'PUT', post);
export const deletePost = (id) => apiRequest(`/posts/${id}`, 'DELETE');

// ITEMS CRUD
export const getItems = () => apiRequest('/items');
export const getItem = (id) => apiRequest(`/items/${id}`);
export const createItem = (item) => apiRequest('/items', 'POST', item);
export const updateItem = (id, item) => apiRequest(`/items/${id}`, 'PUT', item);
export const deleteItem = (id) => apiRequest(`/items/${id}`, 'DELETE');

// FAVORITES CRUD
export const getFavorites = () => apiRequest('/favorites');
export const getFavorite = (id) => apiRequest(`/favorites/${id}`);
export const createFavorite = (favorite) => apiRequest('/favorites', 'POST', favorite);
export const updateFavorite = (id, favorite) => apiRequest(`/favorites/${id}`, 'PUT', favorite);
export const deleteFavorite = (id) => apiRequest(`/favorites/${id}`, 'DELETE');

// SAVED POSTS CRUD
export const getSavedPosts = () => apiRequest('/savedPosts');
export const getSavedPost = (id) => apiRequest(`/savedPosts/${id}`);
export const createSavedPost = (savedPost) => apiRequest('/savedPosts', 'POST', savedPost);
export const updateSavedPost = (id, savedPost) => apiRequest(`/savedPosts/${id}`, 'PUT', savedPost);
export const deleteSavedPost = (id) => apiRequest(`/savedPosts/${id}`, 'DELETE');

// NOTIFICATIONS CRUD
export const getNotifications = () => apiRequest('/notifications');
export const getNotification = (id) => apiRequest(`/notifications/${id}`);
export const createNotification = (notification) => apiRequest('/notifications', 'POST', notification);
export const updateNotification = (id, notification) => apiRequest(`/notifications/${id}`, 'PUT', notification);
export const deleteNotification = (id) => apiRequest(`/notifications/${id}`, 'DELETE');

// COMMENTS CRUD
export const getComments = () => apiRequest('/comments');
export const getComment = (id) => apiRequest(`/comments/${id}`);
export const createComment = (comment) => apiRequest('/comments', 'POST', comment);
export const updateComment = (id, comment) => apiRequest(`/comments/${id}`, 'PUT', comment);
export const deleteComment = (id) => apiRequest(`/comments/${id}`, 'DELETE');

// SUGGESTIONS CRUD
export const getSuggestions = () => apiRequest('/suggestions');
export const getSuggestion = (id) => apiRequest(`/suggestions/${id}`);
export const createSuggestion = (suggestion) => apiRequest('/suggestions', 'POST', suggestion);
export const updateSuggestion = (id, suggestion) => apiRequest(`/suggestions/${id}`, 'PUT', suggestion);
export const deleteSuggestion = (id) => apiRequest(`/suggestions/${id}`, 'DELETE');

// WARDROBES CRUD
export const getWardrobes = () => apiRequest('/wardrobes');
export const getWardrobe = (id) => apiRequest(`/wardrobes/${id}`);
export const createWardrobe = (wardrobe) => apiRequest('/wardrobes', 'POST', wardrobe);
export const updateWardrobe = (id, wardrobe) => apiRequest(`/wardrobes/${id}`, 'PUT', wardrobe);
export const deleteWardrobe = (id) => apiRequest(`/wardrobes/${id}`, 'DELETE'); 