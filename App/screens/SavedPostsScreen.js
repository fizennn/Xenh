import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const SavedPostsScreen = () => {
  const { savedPosts, posts, user, removeSavedPost } = useContext(AppContext);
  // Lọc các bài đã lưu của user hiện tại
  const userSaved = savedPosts.filter(sp => sp.userId === user?.id);
  // Lấy thông tin bài đăng từ postId
  const savedPostDetails = userSaved.map(sp => ({...posts.find(p => p.id === sp.postId), savedId: sp.id})).filter(Boolean);

  const handleRemove = async (savedId) => {
    if (typeof removeSavedPost === 'function') {
      await removeSavedPost(savedId);
    }
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Bài đăng đã lưu</Text>
        {savedPostDetails.length === 0 ? (
          <Text style={styles.empty}>Chưa có bài đăng nào được lưu.</Text>
        ) : (
          <FlatList
            data={savedPostDetails}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable style={({ pressed }) => [styles.postCard, pressed && { opacity: 0.92 }]}>
                <View style={styles.imageBox}>
                  <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                  <View style={styles.imageOverlay} />
                  <View style={styles.avatarOnImage}>
                    <Image source={{ uri: item.user?.avatar || 'https://i.imgur.com/placeholder.png' }} style={styles.avatarImg} />
                  </View>
                  <Pressable onPress={() => handleRemove(item.savedId)} style={styles.removeBtn} android_ripple={{ color: '#f4433622', borderless: true }}>
                    <Ionicons name="close-circle" size={28} color="#f44336" />
                  </Pressable>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.userName}>{item.user?.username || 'User'}</Text>
                  <Text style={styles.caption} numberOfLines={2}>{item.caption || item.title || 'Bài đăng'}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 24,
    letterSpacing: 1,
    textAlign: 'center',
  },
  item: {
    fontSize: 16,
    color: '#222',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flex: 1,
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 220,
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginBottom: 22,
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
    width: 320,
    alignSelf: 'center',
    marginTop: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 0,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    marginRight: 6,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 4,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1.4,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#e3eafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0006',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  avatarOnImage: {
    position: 'absolute',
    left: 18,
    top: 18,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 22,
    width: 44,
    height: 44,
    overflow: 'hidden',
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  removeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    zIndex: 3,
    elevation: 2,
  },
  infoBox: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  caption: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
    marginBottom: 2,
    textAlign: 'left',
    opacity: 0.92,
  },
});

export default SavedPostsScreen; 