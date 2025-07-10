import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { router } from 'expo-router';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const { posts, savedPosts, notifications, setNotifications, user, addSavedPost, users } = useContext(AppContext);

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

  const handleSavePost = async (post) => {
    if (savedPosts.find(p => p.postId === post.id && p.userId === user?.id)) {
      Alert.alert('Thông báo', 'Bài đăng đã được lưu!');
      return;
    }
    const newSaved = { userId: user?.id, postId: post.id };
    if (typeof addSavedPost === 'function') {
      await addSavedPost(newSaved);
    }
    const newNoti = { id: Date.now().toString(), userId: user?.id, type: 'save', message: `Bạn đã lưu bài đăng: ${post.user?.name || post.user?.username || 'User'}`, createdAt: new Date().toISOString() };
    setNotifications([newNoti, ...notifications]);
    Alert.alert('Thành công', 'Đã lưu bài đăng!');
  };

  const handleGoToSavedPosts = () => {
    navigation.navigate('SavedPosts');
  };

  const handleGoToNotifications = () => {
    navigation.navigate('Notifications');
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
      <View style={styles.headerContainer}>
        <View style={styles.welcomeRow}>
          <Image
            source={{ uri: user?.avatar || 'https://i.imgur.com/placeholder.png' }}
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>
            Xin chào, <Text style={{ fontWeight: 'bold', color: '#1976d2' }}>{user?.username || 'bạn'}</Text>!
          </Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn} onPress={handleGoToSavedPosts}>
            <Ionicons name="bookmark-outline" size={26} color="#1976d2" />
            <Text style={styles.actionLabel}>Bài đã lưu</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={handleGoToNotifications}>
            <Ionicons name="notifications-outline" size={26} color="#1976d2" />
            <Text style={styles.actionLabel}>Thông báo</Text>
          </Pressable>
        </View>
        <View style={styles.searchBoxNew}>
          <Ionicons name="search" size={20} color="#1976d2" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInputNew}
            placeholder="Tìm kiếm bài đăng, sản phẩm, người dùng..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
        </View>
      </View>
      <View style={styles.feedCard}>
        <Text style={styles.subtitle}>Bảng tin</Text>
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const postUser = item.user;
            return (
              <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item)}>
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Pressable onPress={() => navigation.navigate('UserProfile', { user: postUser })}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          source={{ uri: postUser?.avatar || 'https://i.imgur.com/placeholder.png' }}
                          style={{ width: 28, height: 28, borderRadius: 14, marginRight: 6 }}
                        />
                        <Text style={styles.userName}>{postUser?.username || 'Ẩn danh'}</Text>
                      </View>
                    </Pressable>
                    <Text style={styles.postTime}>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {user?.id !== postUser?.id && postUser && (
                      <Pressable
                        style={styles.msgBtn}
                        onPress={() => router.push(`/messages/${postUser.id}`)}
                        android_ripple={{ color: '#e3f2fd', borderless: true }}
                      >
                        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1976d2" />
                      </Pressable>
                    )}
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
            );
          }}
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
    backgroundColor: undefined,
    // Nền sẽ là LinearGradient xanh như màn upload
  },
  headerContainer: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#dce3ed',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#d0dff5',
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderColor: '#dce3ed',
    borderWidth: 1,
  },
  actionLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  searchBoxNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#dce3ed',
  },
  searchInputNew: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  feedCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 14,
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#edf2fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  saveBtn: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 6,
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f2f2f2',
  },
  postFooter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#e1f0ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWithLink: {
    backgroundColor: '#e9f9ee',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
    marginTop: 4,
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
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
  msgBtn: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 6,
    marginRight: 4,
  },
});

export default HomeScreen; 