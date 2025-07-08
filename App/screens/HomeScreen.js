import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { posts } = useContext(AppContext);

  // Sắp xếp bài đăng theo thời gian mới nhất
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Lọc bài đăng nâng cao theo nhiều trường và nhiều từ khóa
  const filteredPosts = sortedPosts.filter(post => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return true;
    const keywords = keyword.split(/\s+/).filter(Boolean);
    // Gom tất cả trường cần tìm vào 1 chuỗi
    const userName = post.user?.name?.toLowerCase() || '';
    const tags = post.tags?.map(t => [t.type, t.color, t.style].join(' ')).join(' ').toLowerCase() || '';
    const comments = (post.comments || []).map(c => (c.user + ' ' + c.text).toLowerCase()).join(' ');
    // Nếu có trường title thì thêm vào đây
    // const title = (post.title || '').toLowerCase();
    const haystack = [userName, tags, comments].join(' ');
    // Chỉ cần 1 từ khóa khớp là hiển thị
    return keywords.some(word => haystack.includes(word));
  });

  const handlePostPress = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  const handleSavePost = (post) => {
    if (savedPosts.find(p => p.id === post.id)) {
      Alert.alert('Thông báo', 'Bài đăng đã được lưu!');
      return;
    }
    setSavedPosts([...savedPosts, post]);
    setNotifications([
      { id: Date.now().toString(), content: `Bạn đã lưu bài đăng: ${post.user?.name || 'User'}` },
      ...notifications,
    ]);
    Alert.alert('Thành công', 'Đã lưu bài đăng!');
  };

  const handleGoToSavedPosts = () => {
    navigation.navigate('SavedPosts', { savedPosts });
  };

  const handleGoToNotifications = () => {
    navigation.navigate('Notifications', { notifications });
  };

  const handleProductLink = async (link) => {
    if (!link) {
      Alert.alert('Thông báo', 'Sản phẩm này chưa có link mua hàng!');
      return;
    }

    try {
      console.log('Attempting to open link:', link);
      
      // Kiểm tra và chuẩn hóa URL
      let url = link.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      // Kiểm tra URL có hợp lệ không
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(url)) {
        Alert.alert('Lỗi', 'URL không hợp lệ!');
        return;
      }
      
      console.log('Normalized URL:', url);
      
      // Thử mở URL
      const supported = await Linking.canOpenURL(url);
      console.log('Can open URL:', supported);
      
      if (supported) {
        await Linking.openURL(url);
        console.log('Successfully opened URL');
        Alert.alert('Thành công', 'Đã mở link trong trình duyệt!');
      } else {
        Alert.alert('Lỗi', 'Không thể mở link này!');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Lỗi', `Không thể mở link: ${error.message}`);
    }
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Chào mừng bạn đến với Xenh!</Text>
        <View style={styles.buttonRow}>
          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]} onPress={handleGoToSavedPosts}>
            <Ionicons name="bookmark-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>Bài đã lưu</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]} onPress={handleGoToNotifications}>
            <Ionicons name="notifications-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>Thông báo</Text>
          </Pressable>
        </View>
      </View>
      {/* Search Box */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#1976d2" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài đăng, sản phẩm, người dùng..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>
      <View style={styles.feedCard}>
        <Text style={styles.subtitle}>Bảng tin</Text>
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item)}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Pressable onPress={() => navigation.navigate('UserProfile', { user: item.user })}>
                    <Text style={styles.userName}>{item.user?.name || 'User'}</Text>
                  </Pressable>
                  <Text style={styles.postTime}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                <Pressable 
                  style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.7 }]} 
                  onPress={(e) => {
                    e.stopPropagation();
                    handleSavePost(item);
                  }}
                >
                  <Ionicons name="bookmark-outline" size={18} color="#1976d2" />
                </Pressable>
              </View>
              
              {item.image && (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.postFooter}>
                <View style={styles.tagsContainer}>
                  {item.tags?.slice(0, 3).map((tag, index) => (
                    <Pressable 
                      key={index} 
                      style={[styles.tag, tag.link && styles.tagWithLink]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleProductLink(tag.link);
                      }}
                      android_ripple={{ color: '#e0e0e0', borderless: true }}
                    >
                      <Text style={styles.tagText}>{tag.type}</Text>
                      {tag.link && (
                        <Ionicons name="link-outline" size={12} color="#4caf50" style={{ marginLeft: 4 }} />
                      )}
                    </Pressable>
                  ))}
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Ionicons name="heart-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{item.likes || 0}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{item.comments?.length || 0}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy bài đăng phù hợp.</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1976d2',
    paddingVertical: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 16,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  saveBtn: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  postFooter: {
    padding: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWithLink: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default HomeScreen; 