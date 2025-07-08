import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Màn hình khám phá các bài đăng phổ biến
export default function ExploreScreen({ navigation }) {
  const { posts } = useContext(AppContext);
  // Sắp xếp bài đăng theo số like giảm dần
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);

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
        <View style={styles.titleRow}>
          <Ionicons name="flame" size={28} color="#ff6b35" />
          <Text style={styles.title}>Khám phá phổ biến</Text>
        </View>
        <Text style={styles.subtitle}>Những bài đăng được yêu thích nhất</Text>
      </View>
      
      <View style={styles.feedCard}>
        <FlatList
          data={sortedPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[styles.postCard, index === 0 && styles.topPost]} 
              onPress={() => navigation.navigate('PostDetail', { post: item })}
            >
              {index === 0 && (
                <View style={styles.topBadge}>
                  <Ionicons name="trophy" size={16} color="#fff" />
                  <Text style={styles.topBadgeText}>#1</Text>
                </View>
              )}
              
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Pressable onPress={() => navigation.navigate('UserProfile', { user: item.user })}>
                    <Text style={styles.userName}>{item.user?.name || 'User'}</Text>
                  </Pressable>
                  <Text style={styles.postTime}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                <View style={styles.popularityBox}>
                  <Ionicons name="flame" size={16} color="#ff6b35" />
                  <Text style={styles.popularityText}>{item.likes || 0}</Text>
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
                  {item.tags?.slice(0, 3).map((tag, tagIndex) => (
                    <Pressable 
                      key={tagIndex} 
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
                    <Ionicons name="heart" size={16} color="#ff6b35" />
                    <Text style={styles.statText}>{item.likes || 0}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="chatbubble" size={16} color="#666" />
                    <Text style={styles.statText}>{item.comments?.length || 0}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="eye" size={16} color="#666" />
                    <Text style={styles.statText}>{Math.floor((item.likes || 0) * 1.5)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Chưa có bài đăng nào.</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </LinearGradient>
  );
}

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
    position: 'relative',
  },
  topPost: {
    backgroundColor: '#fff3e0',
    borderWidth: 2,
    borderColor: '#ffb74d',
  },
  topBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  topBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 2,
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
  popularityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularityText: {
    color: '#ff6b35',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
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