import React, { createContext, useState } from 'react';

// Tạo context
export const AppContext = createContext();

// Dữ liệu mẫu người dùng
const sampleUsers = [
  { id: 1, name: 'User Demo' },
  { id: 2, name: 'Linh Fashion' },
  { id: 3, name: 'Phong Style' },
];

// Dữ liệu mẫu bài đăng
const samplePosts = [
  {
    id: 101,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo sơ mi', color: 'Trắng', style: 'Formal', link: 'https://www.google.com' },
      { type: 'Quần tây', color: 'Đen', style: 'Formal', link: 'https://www.youtube.com' },
    ],
    createdAt: '2024-05-01T09:00:00Z',
    likes: 12,
    comments: [
      { user: 'User Demo', text: 'Đẹp quá!', createdAt: '2024-05-01T10:00:00Z' },
      { user: 'Phong Style', text: 'Phong cách công sở chuẩn!', createdAt: '2024-05-01T11:00:00Z' },
    ],
  },
  {
    id: 102,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo thun', color: 'Xanh', style: 'Casual', link: 'https://www.facebook.com' },
      { type: 'Quần short', color: 'Be', style: 'Casual' },
      { type: 'Giày sneaker', color: 'Trắng', style: 'Sporty', link: 'https://www.github.com' },
    ],
    createdAt: '2024-05-02T08:00:00Z',
    likes: 8,
    comments: [
      { user: 'Linh Fashion', text: 'Năng động quá!', createdAt: '2024-05-02T09:00:00Z' },
    ],
  },
  {
    id: 103,
    user: sampleUsers[0],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    tags: [
      { type: 'Đầm dạ hội', color: 'Đỏ', style: 'Elegant', link: 'https://www.stackoverflow.com' },
      { type: 'Giày cao gót', color: 'Đen', style: 'Elegant' },
    ],
    createdAt: '2024-05-03T07:00:00Z',
    likes: 15,
    comments: [
      { user: 'Linh Fashion', text: 'Quá sang!', createdAt: '2024-05-03T08:00:00Z' },
      { user: 'Phong Style', text: 'Đỉnh!', createdAt: '2024-05-03T09:00:00Z' },
    ],
  },
  // 17 bài đăng mẫu bổ sung
  {
    id: 104,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo khoác', color: 'Xám', style: 'Street', link: 'https://www.reddit.com' },
      { type: 'Quần jeans', color: 'Xanh', style: 'Street' },
    ],
    createdAt: '2024-05-04T09:00:00Z',
    likes: 7,
    comments: [
      { user: 'User Demo', text: 'Chất quá!', createdAt: '2024-05-04T10:00:00Z' },
    ],
  },
  {
    id: 105,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo hoodie', color: 'Đen', style: 'Sporty', link: 'https://www.twitter.com' },
      { type: 'Quần jogger', color: 'Xám', style: 'Sporty' },
    ],
    createdAt: '2024-05-05T09:00:00Z',
    likes: 10,
    comments: [
      { user: 'Linh Fashion', text: 'Đẹp!', createdAt: '2024-05-05T10:00:00Z' },
    ],
  },
  {
    id: 106,
    user: sampleUsers[0],
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo len', color: 'Nâu', style: 'Vintage', link: 'https://shopee.vn/aolen' },
      { type: 'Chân váy', color: 'Đen', style: 'Vintage' },
    ],
    createdAt: '2024-05-06T09:00:00Z',
    likes: 5,
    comments: [
      { user: 'Phong Style', text: 'Dễ thương!', createdAt: '2024-05-06T10:00:00Z' },
    ],
  },
  {
    id: 107,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo blazer', color: 'Be', style: 'Chic', link: 'https://tiki.vn/blazer' },
      { type: 'Quần tây', color: 'Nâu', style: 'Chic' },
    ],
    createdAt: '2024-05-07T09:00:00Z',
    likes: 9,
    comments: [
      { user: 'User Demo', text: 'Sang trọng!', createdAt: '2024-05-07T10:00:00Z' },
    ],
  },
  {
    id: 108,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo phông', color: 'Trắng', style: 'Basic', link: 'https://shopee.vn/aophong' },
      { type: 'Quần short', color: 'Xanh', style: 'Basic' },
    ],
    createdAt: '2024-05-08T09:00:00Z',
    likes: 6,
    comments: [
      { user: 'Linh Fashion', text: 'Mát mẻ!', createdAt: '2024-05-08T10:00:00Z' },
    ],
  },
  {
    id: 109,
    user: sampleUsers[0],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo khoác bomber', color: 'Xanh rêu', style: 'Street', link: 'https://tiki.vn/bomber' },
      { type: 'Quần jeans', color: 'Đen', style: 'Street' },
    ],
    createdAt: '2024-05-09T09:00:00Z',
    likes: 11,
    comments: [
      { user: 'Phong Style', text: 'Ngầu!', createdAt: '2024-05-09T10:00:00Z' },
    ],
  },
  {
    id: 110,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo sơ mi caro', color: 'Đỏ', style: 'Casual', link: 'https://shopee.vn/aosomicaro' },
      { type: 'Quần kaki', color: 'Nâu', style: 'Casual' },
    ],
    createdAt: '2024-05-10T09:00:00Z',
    likes: 13,
    comments: [
      { user: 'User Demo', text: 'Đậm chất Hàn!', createdAt: '2024-05-10T10:00:00Z' },
    ],
  },
  {
    id: 111,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo khoác da', color: 'Đen', style: 'Rock', link: 'https://tiki.vn/aokhoacda' },
      { type: 'Quần jeans', color: 'Xám', style: 'Rock' },
    ],
    createdAt: '2024-05-11T09:00:00Z',
    likes: 14,
    comments: [
      { user: 'Linh Fashion', text: 'Chất chơi!', createdAt: '2024-05-11T10:00:00Z' },
    ],
  },
  {
    id: 112,
    user: sampleUsers[0],
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo len cổ lọ', color: 'Trắng', style: 'Winter', link: 'https://shopee.vn/aolencolo' },
      { type: 'Chân váy len', color: 'Xám', style: 'Winter' },
    ],
    createdAt: '2024-05-12T09:00:00Z',
    likes: 7,
    comments: [
      { user: 'Phong Style', text: 'Ấm áp!', createdAt: '2024-05-12T10:00:00Z' },
    ],
  },
  {
    id: 113,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo khoác dạ', color: 'Nâu', style: 'Elegant', link: 'https://tiki.vn/aokhoacda' },
      { type: 'Quần tây', color: 'Đen', style: 'Elegant' },
    ],
    createdAt: '2024-05-13T09:00:00Z',
    likes: 12,
    comments: [
      { user: 'User Demo', text: 'Đẹp dịu dàng!', createdAt: '2024-05-13T10:00:00Z' },
    ],
  },
  {
    id: 114,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo vest', color: 'Xám', style: 'Formal', link: 'https://shopee.vn/aovest' },
      { type: 'Quần tây', color: 'Đen', style: 'Formal' },
    ],
    createdAt: '2024-05-14T09:00:00Z',
    likes: 16,
    comments: [
      { user: 'Linh Fashion', text: 'Lịch lãm!', createdAt: '2024-05-14T10:00:00Z' },
    ],
  },
  {
    id: 115,
    user: sampleUsers[0],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo thun dài tay', color: 'Xanh', style: 'Basic', link: 'https://tiki.vn/aothundai' },
      { type: 'Quần jeans', color: 'Xanh', style: 'Basic' },
    ],
    createdAt: '2024-05-15T09:00:00Z',
    likes: 8,
    comments: [
      { user: 'Phong Style', text: 'Đơn giản mà đẹp!', createdAt: '2024-05-15T10:00:00Z' },
    ],
  },
  {
    id: 116,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo croptop', color: 'Trắng', style: 'Sexy', link: 'https://shopee.vn/croptop' },
      { type: 'Quần jeans', color: 'Xanh', style: 'Sexy' },
    ],
    createdAt: '2024-05-16T09:00:00Z',
    likes: 20,
    comments: [
      { user: 'User Demo', text: 'Quyến rũ!', createdAt: '2024-05-16T10:00:00Z' },
    ],
  },
  {
    id: 117,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo sơ mi lụa', color: 'Hồng', style: 'Elegant', link: 'https://tiki.vn/aosomilua' },
      { type: 'Quần tây', color: 'Đen', style: 'Elegant' },
    ],
    createdAt: '2024-05-17T09:00:00Z',
    likes: 11,
    comments: [
      { user: 'Linh Fashion', text: 'Sang trọng!', createdAt: '2024-05-17T10:00:00Z' },
    ],
  },
  {
    id: 118,
    user: sampleUsers[0],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo khoác gió', color: 'Xanh', style: 'Sporty', link: 'https://shopee.vn/aokhoacgio' },
      { type: 'Quần jogger', color: 'Đen', style: 'Sporty' },
    ],
    createdAt: '2024-05-18T09:00:00Z',
    likes: 9,
    comments: [
      { user: 'Phong Style', text: 'Năng động!', createdAt: '2024-05-18T10:00:00Z' },
    ],
  },
  {
    id: 119,
    user: sampleUsers[1],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo len oversize', color: 'Be', style: 'Vintage', link: 'https://tiki.vn/aolenoversize' },
      { type: 'Quần jeans', color: 'Xanh', style: 'Vintage' },
    ],
    createdAt: '2024-05-19T09:00:00Z',
    likes: 13,
    comments: [
      { user: 'User Demo', text: 'Thời trang!', createdAt: '2024-05-19T10:00:00Z' },
    ],
  },
  {
    id: 120,
    user: sampleUsers[2],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: [
      { type: 'Áo khoác lông', color: 'Trắng', style: 'Winter', link: 'https://shopee.vn/aokhoaclong' },
      { type: 'Quần jeans', color: 'Đen', style: 'Winter' },
    ],
    createdAt: '2024-05-20T09:00:00Z',
    likes: 18,
    comments: [
      { user: 'Linh Fashion', text: 'Ấm áp!', createdAt: '2024-05-20T10:00:00Z' },
    ],
  },
];

// Provider bọc toàn bộ app
export const AppProvider = ({ children }) => {
  // State người dùng (có thể mở rộng sau)
  const [user, setUser] = useState(sampleUsers[0]);
  // State danh sách bài đăng
  const [posts, setPosts] = useState(samplePosts);
  // State danh sách người dùng đã theo dõi (id)
  const [following, setFollowing] = useState([2, 3]);

  // Thêm bài đăng mới
  const addPost = (post) => setPosts([post, ...posts]);

  // Like một bài đăng
  const likePost = (postId) => {
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // Thêm bình luận cho bài đăng
  const addComment = (postId, comment) => {
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  // Theo dõi một người dùng
  const followUser = (userId) => {
    if (!following.includes(userId)) setFollowing([...following, userId]);
  };

  // Bỏ theo dõi một người dùng
  const unfollowUser = (userId) => {
    setFollowing(following.filter(id => id !== userId));
  };

  return (
    <AppContext.Provider value={{ user, setUser, posts, addPost, likePost, addComment, following, followUser, unfollowUser }}>
      {children}
    </AppContext.Provider>
  );
}; 