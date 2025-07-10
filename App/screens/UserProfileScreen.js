import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Alert, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { router } from 'expo-router';

const UserProfileScreen = ({ route, navigation }) => {
  const { posts, users } = useContext(AppContext);
  const userId = route?.params?.user?.id;
  const user = users.find(u => u.id === userId);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  if (!user) {
    return (
      <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
          <Text style={styles.errorTitle}>Không tìm thấy người dùng!</Text>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  // Lọc bài đăng của user này
  const userPosts = posts.filter(post => post.userId === user.id);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      'Thành công', 
      isFollowing ? 'Đã hủy theo dõi!' : 'Đã theo dõi thành công!'
    );
  };

  const handleMessage = () => {
    router.push(`/messages/${user.id}`);
  };

  const handleBlock = () => {
    Alert.alert(
      'Chặn người dùng',
      'Bạn có chắc muốn chặn người dùng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Chặn', 
          style: 'destructive',
          onPress: () => {
            setIsBlocked(true);
            Alert.alert('Thành công', 'Đã chặn người dùng!');
          }
        }
      ]
    );
  };

  const handlePostPress = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#666" />
          </Pressable>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <Pressable style={styles.moreBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color="#666" />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#1976d2" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.username || user.name}</Text>
              <Text style={styles.userStatus}>Đang hoạt động</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{userPosts.length}</Text>
                  <Text style={styles.statLabel}>Bài đăng</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>1.2k</Text>
                  <Text style={styles.statLabel}>Theo dõi</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>856</Text>
                  <Text style={styles.statLabel}>Người theo dõi</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={[styles.actionBtn, isFollowing && styles.followingBtn]} 
              onPress={handleFollow}
            >
              <Ionicons 
                name={isFollowing ? "checkmark" : "add"} 
                size={18} 
                color={isFollowing ? "#fff" : "#1976d2"} 
              />
              <Text style={[styles.actionBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              </Text>
            </Pressable>
            
            <Pressable style={styles.messageBtn} onPress={handleMessage}>
              <Ionicons name="chatbubble-outline" size={18} color="#fff" />
              <Text style={styles.messageBtnText}>Nhắn tin</Text>
            </Pressable>
            
            <Pressable style={styles.blockBtn} onPress={handleBlock}>
              <Ionicons name="ban-outline" size={18} color="#f44336" />
            </Pressable>
          </View>
        </View>

        {/* User Posts */}
        <View style={styles.postsCard}>
          <View style={styles.postsHeader}>
            <Ionicons name="images-outline" size={20} color="#1976d2" />
            <Text style={styles.postsTitle}>Bài đăng ({userPosts.length})</Text>
          </View>
          
          {userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable style={styles.postItem} onPress={() => handlePostPress(item)}>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                  )}
                  <View style={styles.postInfo}>
                    <Text style={styles.postTags}>
                      {item.tags?.slice(0, 2).map(t => t.type).join(' • ') || 'No tags'}
                    </Text>
                    <View style={styles.postStats}>
                      <View style={styles.postStat}>
                        <Ionicons name="heart" size={14} color="#e53935" />
                        <Text style={styles.postStatText}>{item.likes || 0}</Text>
                      </View>
                      <View style={styles.postStat}>
                        <Ionicons name="chatbubble" size={14} color="#666" />
                        <Text style={styles.postStatText}>{item.comments?.length || 0}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            />
          ) : (
            <View style={styles.noPostsContainer}>
              <Ionicons name="images-outline" size={48} color="#ccc" />
              <Text style={styles.noPostsText}>Chưa có bài đăng nào</Text>
            </View>
          )}
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>
            <Ionicons name="information-circle-outline" size={20} color="#1976d2" />
            {' '}Giới thiệu
          </Text>
          <Text style={styles.aboutText}>
            Người dùng yêu thích thời trang và chia sẻ phong cách của mình với cộng đồng.
          </Text>
          <View style={styles.aboutDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText}>Hà Nội, Việt Nam</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>Tham gia từ 2023</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  moreBtn: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4caf50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  followingBtn: {
    backgroundColor: '#1976d2',
  },
  followingBtnText: {
    color: '#fff',
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  messageBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  blockBtn: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 12,
  },
  postsCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 20,
  },
  postsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginLeft: 8,
  },
  postItem: {
    width: 120,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  postInfo: {
    padding: 8,
  },
  postTags: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  postStats: {
    flexDirection: 'row',
    gap: 8,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  postStatText: {
    fontSize: 12,
    color: '#666',
  },
  noPostsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noPostsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  aboutCard: {
    backgroundColor: '#fff',
    padding: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfileScreen; 