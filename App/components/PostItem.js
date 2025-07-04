import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button, Linking } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CommentModal from './CommentModal';

// Hiển thị một bài đăng outfit
export default function PostItem({ post }) {
  const { likePost, following, followUser, unfollowUser, user } = useContext(AppContext);
  const [showComment, setShowComment] = useState(false);

  // Lấy ký tự đầu tên user làm avatar
  const avatar = post.user?.name ? post.user.name[0].toUpperCase() : '?';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatar}>{avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{post.user?.name || 'Ẩn danh'}</Text>
          <Text style={styles.time}>{new Date(post.createdAt).toLocaleString()}</Text>
        </View>
        {/* Nút theo dõi nếu không phải bài của mình */}
        {post.user?.id !== user.id && (
          following.includes(post.user?.id) ? (
            <TouchableOpacity onPress={() => unfollowUser(post.user.id)}>
              <Text style={styles.followBtn}>Bỏ theo dõi</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => followUser(post.user.id)}>
              <Text style={styles.followBtn}>Theo dõi</Text>
            </TouchableOpacity>
          )
        )}
      </View>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.tags}>
        {post.tags?.map((tag, idx) => (
          <View key={idx} style={styles.tagRow}>
            <Text style={styles.tag}>{tag.type} - {tag.color} - {tag.style}</Text>
            {tag.link ? (
              <TouchableOpacity onPress={() => Linking.openURL(tag.link)}>
                <Text style={styles.buyLink}>Mua ngay</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => likePost(post.id)}>
          <Text style={[styles.icon, { color: '#e53935' }]}>❤️</Text>
          <Text style={styles.iconText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowComment(true)}>
          <Text style={[styles.icon, { color: '#1976d2' }]}>💬</Text>
          <Text style={styles.iconText}>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>
      <CommentModal
        visible={showComment}
        onClose={() => setShowComment(false)}
        post={post}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatarBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#1976d2',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatar: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  username: { fontWeight: 'bold', fontSize: 16 },
  time: { color: '#888', fontSize: 12 },
  followBtn: { color: '#1976d2', marginLeft: 8, fontWeight: 'bold', fontSize: 12, padding: 6 },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 10, marginTop: 4 },
  tags: { flexDirection: 'column', gap: 8, marginBottom: 10 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tag: { backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 4, fontSize: 13, fontWeight: 'bold' },
  buyLink: { color: '#e53935', fontWeight: 'bold', marginLeft: 8, textDecorationLine: 'underline', fontSize: 13 },
  footer: { flexDirection: 'row', gap: 24, marginTop: 6 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 8 },
  icon: { fontSize: 20, marginRight: 4 },
  iconText: { fontSize: 15, fontWeight: 'bold' },
}); 