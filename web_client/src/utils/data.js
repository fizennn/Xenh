export let users = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: '123456', full_name: 'Quản trị viên', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 170, weight: 65, role: 'admin', status: 'active' },
  { id: 2, username: 'user1', email: 'user1@example.com', password: '123456', full_name: 'Nguyễn Văn A', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 175, weight: 70, role: 'user', status: 'active' },
  { id: 3, username: 'user2', email: 'user2@example.com', password: '123456', full_name: 'Trần Thị B', avatar_url: 'https://via.placeholder.com/40', gender: 'female', height: 160, weight: 50, role: 'user', status: 'active' },
  { id: 4, username: 'user3', email: 'user3@example.com', password: '123456', full_name: 'Lê Văn C', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 180, weight: 75, role: 'user', status: 'inactive' },
  { id: 5, username: 'user4', email: 'user4@example.com', password: '123456', full_name: 'Phạm Thị D', avatar_url: 'https://via.placeholder.com/40', gender: 'female', height: 165, weight: 55, role: 'user', status: 'active' },
  { id: 6, username: 'user5', email: 'user5@example.com', password: '123456', full_name: 'Hoàng Văn E', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 172, weight: 68, role: 'admin', status: 'active' },
  { id: 7, username: 'user6', email: 'user6@example.com', password: '123456', full_name: 'Ngô Thị F', avatar_url: 'https://via.placeholder.com/40', gender: 'female', height: 158, weight: 48, role: 'user', status: 'inactive' },
  { id: 8, username: 'user7', email: 'user7@example.com', password: '123456', full_name: 'Đỗ Văn G', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 178, weight: 72, role: 'user', status: 'active' },
  { id: 9, username: 'user8', email: 'user8@example.com', password: '123456', full_name: 'Trần Văn H', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 170, weight: 65, role: 'user', status: 'active' },
  { id: 10, username: 'user9', email: 'user9@example.com', password: '123456', full_name: 'Lê Thị I', avatar_url: 'https://via.placeholder.com/40', gender: 'female', height: 162, weight: 52, role: 'user', status: 'inactive' },
  { id: 11, username: 'user10', email: 'user10@example.com', password: '123456', full_name: 'Phạm Văn J', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 175, weight: 70, role: 'user', status: 'active' },
  { id: 12, username: 'user11', email: 'user11@example.com', password: '123456', full_name: 'Nguyễn Thị K', avatar_url: 'https://via.placeholder.com/40', gender: 'female', height: 160, weight: 50, role: 'user', status: 'active' },
  { id: 13, username: 'user12', email: 'user12@example.com', password: '123456', full_name: 'Hoàng Văn L', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 180, weight: 75, role: 'admin', status: 'active' },
  { id: 14, username: 'user13', email: 'user13@example.com', password: '123456', full_name: 'Ngô Văn M', avatar_url: 'https://via.placeholder.com/40', gender: 'male', height: 172, weight: 68, role: 'user', status: 'inactive' },
  { id: 15, username: 'user14', email: 'user14@example.com', password: '123456', full_name: 'Đỗ Thị N', avatar_url: 'https://via.placeholder.com/40', gender: 'female', height: 165, weight: 55, role: 'user', status: 'active' },
];

export let posts = [
  { id: 1, user_id: 2, title: 'Bài viết đầu tiên', description: 'Mô tả bài viết đầu tiên', image_url: 'https://via.placeholder.com/300x200', favs: 15, items: 5, full_name: 'Nguyễn Văn A', avatar_url: 'https://via.placeholder.com/40' },
  { id: 2, user_id: 3, title: 'Bài viết thứ hai', description: 'Mô tả bài viết thứ hai', image_url: 'https://via.placeholder.com/300x200', favs: 10, items: 3, full_name: 'Trần Thị B', avatar_url: 'https://via.placeholder.com/40' },
  { id: 3, user_id: 4, title: 'Bài viết thứ ba', description: 'Mô tả bài viết thứ ba', image_url: 'https://via.placeholder.com/300x200', favs: 20, items: 7, full_name: 'Lê Văn C', avatar_url: 'https://via.placeholder.com/40' },
  { id: 4, user_id: 5, title: 'Bài viết thứ tư', description: 'Mô tả bài viết thứ tư', image_url: 'https://via.placeholder.com/300x200', favs: 8, items: 2, full_name: 'Phạm Thị D', avatar_url: 'https://via.placeholder.com/40' },
  { id: 5, user_id: 6, title: 'Bài viết thứ năm', description: 'Mô tả bài viết thứ năm', image_url: 'https://via.placeholder.com/300x200', favs: 12, items: 4, full_name: 'Hoàng Văn E', avatar_url: 'https://via.placeholder.com/40' },
  { id: 6, user_id: 7, title: 'Bài viết thứ sáu', description: 'Mô tả bài viết thứ sáu', image_url: 'https://via.placeholder.com/300x200', favs: 15, items: 6, full_name: 'Ngô Thị F', avatar_url: 'https://via.placeholder.com/40' },
  { id: 7, user_id: 8, title: 'Bài viết thứ bảy', description: 'Mô tả bài viết thứ bảy', image_url: 'https://via.placeholder.com/300x200', favs: 9, items: 3, full_name: 'Đỗ Văn G', avatar_url: 'https://via.placeholder.com/40' },
  { id: 8, user_id: 9, title: 'Bài viết thứ tám', description: 'Mô tả bài viết thứ tám', image_url: 'https://via.placeholder.com/300x200', favs: 18, items: 5, full_name: 'Trần Văn H', avatar_url: 'https://via.placeholder.com/40' },
  { id: 9, user_id: 10, title: 'Bài viết thứ chín', description: 'Mô tả bài viết thứ chín', image_url: 'https://via.placeholder.com/300x200', favs: 7, items: 2, full_name: 'Lê Thị I', avatar_url: 'https://via.placeholder.com/40' },
  { id: 10, user_id: 11, title: 'Bài viết thứ mười', description: 'Mô tả bài viết thứ mười', image_url: 'https://via.placeholder.com/300x200', favs: 14, items: 4, full_name: 'Phạm Văn J', avatar_url: 'https://via.placeholder.com/40' },
  { id: 11, user_id: 12, title: 'Bài viết thứ mười một', description: 'Mô tả bài viết thứ mười một', image_url: 'https://via.placeholder.com/300x200', favs: 11, items: 3, full_name: 'Nguyễn Thị K', avatar_url: 'https://via.placeholder.com/40' },
  { id: 12, user_id: 13, title: 'Bài viết thứ mười hai', description: 'Mô tả bài viết thứ mười hai', image_url: 'https://via.placeholder.com/300x200', favs: 16, items: 5, full_name: 'Hoàng Văn L', avatar_url: 'https://via.placeholder.com/40' },
  { id: 13, user_id: 14, title: 'Bài viết thứ mười ba', description: 'Mô tả bài viết thứ mười ba', image_url: 'https://via.placeholder.com/300x200', favs: 13, items: 4, full_name: 'Ngô Văn M', avatar_url: 'https://via.placeholder.com/40' },
  { id: 14, user_id: 15, title: 'Bài viết thứ mười bốn', description: 'Mô tả bài viết thứ mười bốn', image_url: 'https://via.placeholder.com/300x200', favs: 10, items: 3, full_name: 'Đỗ Thị N', avatar_url: 'https://via.placeholder.com/40' },
  { id: 15, user_id: 2, title: 'Bài viết thứ mười lăm', description: 'Mô tả bài viết thứ mười lăm', image_url: 'https://via.placeholder.com/300x200', favs: 17, items: 6, full_name: 'Nguyễn Văn A', avatar_url: 'https://via.placeholder.com/40' },
  { id: 16, user_id: 3, title: 'Bài viết thứ mười sáu', description: 'Mô tả bài viết thứ mười sáu', image_url: 'https://via.placeholder.com/300x200', favs: 12, items: 4, full_name: 'Trần Thị B', avatar_url: 'https://via.placeholder.com/40' },
  { id: 17, user_id: 4, title: 'Bài viết thứ mười bảy', description: 'Mô tả bài viết thứ mười bảy', image_url: 'https://via.placeholder.com/300x200', favs: 9, items: 3, full_name: 'Lê Văn C', avatar_url: 'https://via.placeholder.com/40' },
  { id: 18, user_id: 5, title: 'Bài viết thứ mười tám', description: 'Mô tả bài viết thứ mười tám', image_url: 'https://via.placeholder.com/300x200', favs: 15, items: 5, full_name: 'Phạm Thị D', avatar_url: 'https://via.placeholder.com/40' },
  { id: 19, user_id: 6, title: 'Bài viết thứ mười chín', description: 'Mô tả bài viết thứ mười chín', image_url: 'https://via.placeholder.com/300x200', favs: 11, items: 4, full_name: 'Hoàng Văn E', avatar_url: 'https://via.placeholder.com/40' },
  { id: 20, user_id: 7, title: 'Bài viết thứ hai mươi', description: 'Mô tả bài viết thứ hai mươi', image_url: 'https://via.placeholder.com/300x200', favs: 13, items: 5, full_name: 'Ngô Thị F', avatar_url: 'https://via.placeholder.com/40' },
];

export let favorites = [
  { id: 1, user_id: 2, post_id: 1, fav_id: 1, user_fav: 1 },
  { id: 2, user_id: 3, post_id: 2, fav_id: 2, user_fav: 1 },
  { id: 3, user_id: 4, post_id: 3, fav_id: 3, user_fav: 0 },
  { id: 4, user_id: 5, post_id: 4, fav_id: 4, user_fav: 1 },
  { id: 5, user_id: 6, post_id: 5, fav_id: 5, user_fav: 0 },
  { id: 6, user_id: 7, post_id: 6, fav_id: 6, user_fav: 1 },
  { id: 7, user_id: 8, post_id: 7, fav_id: 7, user_fav: 0 },
  { id: 8, user_id: 9, post_id: 8, fav_id: 8, user_fav: 1 },
  { id: 9, user_id: 10, post_id: 9, fav_id: 9, user_fav: 0 },
  { id: 10, user_id: 11, post_id: 10, fav_id: 10, user_fav: 1 },
  { id: 11, user_id: 12, post_id: 11, fav_id: 11, user_fav: 0 },
  { id: 12, user_id: 13, post_id: 12, fav_id: 12, user_fav: 1 },
  { id: 13, user_id: 14, post_id: 13, fav_id: 13, user_fav: 0 },
  { id: 14, user_id: 15, post_id: 14, fav_id: 14, user_fav: 1 },
  { id: 15, user_id: 2, post_id: 15, fav_id: 15, user_fav: 0 },
  { id: 16, user_id: 3, post_id: 16, fav_id: 16, user_fav: 1 },
  { id: 17, user_id: 4, post_id: 17, fav_id: 17, user_fav: 0 },
  { id: 18, user_id: 5, post_id: 18, fav_id: 18, user_fav: 1 },
  { id: 19, user_id: 6, post_id: 19, fav_id: 19, user_fav: 0 },
  { id: 20, user_id: 7, post_id: 20, fav_id: 20, user_fav: 1 },
];

export let products = [
  { id: 1, name: 'Áo thun', type: 'Quần áo', color: 'Trắng', pattern: 'Trơn', style: 'Cơ bản', shop_id: 1 },
  { id: 2, name: 'Quần jeans', type: 'Quần áo', color: 'Xanh', pattern: 'Trơn', style: 'Hiện đại', shop_id: 1 },
  { id: 3, name: 'Váy maxi', type: 'Quần áo', color: 'Đỏ', pattern: 'Hoa', style: 'Bohemian', shop_id: 1 },
  { id: 4, name: 'Áo sơ mi', type: 'Quần áo', color: 'Trắng', pattern: 'Cà vạt', style: 'Công sở', shop_id: 2 },
  { id: 5, name: 'Quần short', type: 'Quần áo', color: 'Đen', pattern: 'Trơn', style: 'Thể thao', shop_id: 2 },
  { id: 6, name: 'Váy đầm', type: 'Quần áo', color: 'Xanh', pattern: 'Chấm bi', style: 'Dạo phố', shop_id: 2 },
  { id: 7, name: 'Áo hoodie', type: 'Quần áo', color: 'Xám', pattern: 'In hình', style: 'Thanh niên', shop_id: 3 },
  { id: 8, name: 'Quần dài', type: 'Quần áo', color: 'Nâu', pattern: 'Trơn', style: 'Cổ điển', shop_id: 3 },
  { id: 9, name: 'Váy liền', type: 'Quần áo', color: 'Hồng', pattern: 'Hoa nhí', style: 'Nữ tính', shop_id: 3 },
  { id: 10, name: 'Áo khoác', type: 'Quần áo', color: 'Đen', pattern: 'Trơn', style: 'Đông', shop_id: 4 },
  { id: 11, name: 'Quần jogger', type: 'Quần áo', color: 'Xanh lá', pattern: 'Trơn', style: 'Thể thao', shop_id: 4 },
  { id: 12, name: 'Váy xếp ly', type: 'Quần áo', color: 'Vàng', pattern: 'Trơn', style: 'Dạ hội', shop_id: 4 },
  { id: 13, name: 'Áo thun cổ V', type: 'Quần áo', color: 'Xanh dương', pattern: 'Trơn', style: 'Cơ bản', shop_id: 5 },
  { id: 14, name: 'Quần kaki', type: 'Quần áo', color: 'Be', pattern: 'Trơn', style: 'Công sở', shop_id: 5 },
  { id: 15, name: 'Váy suông', type: 'Quần áo', color: 'Đỏ', pattern: 'Trơn', style: 'Dạo phố', shop_id: 5 },
  { id: 16, name: 'Áo len', type: 'Quần áo', color: 'Xám', pattern: 'Trơn', style: 'Đông', shop_id: 6 },
  { id: 17, name: 'Quần ống rộng', type: 'Quần áo', color: 'Đen', pattern: 'Trơn', style: 'Hiện đại', shop_id: 6 },
  { id: 18, name: 'Váy midi', type: 'Quần áo', color: 'Xanh lá', pattern: 'Hoa', style: 'Nữ tính', shop_id: 6 },
  { id: 19, name: 'Áo phông', type: 'Quần áo', color: 'Trắng', pattern: 'In chữ', style: 'Thanh niên', shop_id: 7 },
  { id: 20, name: 'Quần baggy', type: 'Quần áo', color: 'Xám', pattern: 'Trơn', style: 'Thể thao', shop_id: 7 },
];

export const updateUsers = (newUsers) => { users = newUsers; };
export const updatePosts = (newPosts) => { posts = newPosts; };
export const updateProducts = (newProducts) => { products = newProducts; };