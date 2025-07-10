import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, TextInput, Alert, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const PostDetailScreen = ({ route }) => {
  const post = route?.params?.post;
  const { comments: allComments, addComment, user, users } = useContext(AppContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  // Lấy comments thực tế từ context theo postId
  const postComments = allComments.filter(c => c.postId === post?.id);
  const [comments, setComments] = useState(postComments);
  const navigation = useNavigation();

  useEffect(() => {
    setComments(allComments.filter(c => c.postId === post?.id));
  }, [allComments, post?.id]);

  if (!post) {
    return (
      <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
          <Text style={styles.errorTitle}>Không tìm thấy bài đăng!</Text>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert('Thành công', isSaved ? 'Đã bỏ lưu bài đăng' : 'Đã lưu bài đăng!');
  };

  const handleShare = async () => {
    try {
      const url = `https://xenh.app/post/${post.id}`;
      await Share.share({
        message: url,
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chia sẻ bài viết.');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bình luận!');
      return;
    }
    const newComment = {
      postId: post.id,
      userId: user?.id,
      user: user?.username || user?.name || 'Bạn',
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    if (typeof addComment === 'function') {
      await addComment(post.id, newComment);
    }
    setCommentText('');
    Alert.alert('Thành công', 'Đã thêm bình luận!');
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

  // Lấy user mới nhất cho post
  const postUser = post.user && post.user.username ? post.user : users.find(u => String(u.id) === String(post.userId));

  // Giả sử user là chủ bài viết
  const isOwner = true; // TODO: thay bằng logic kiểm tra chủ bài viết thực tế

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Pressable 
            style={styles.userSection} 
            onPress={() => navigation.navigate('UserProfile', { user: postUser })}
          >
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={24} color="#1976d2" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{postUser?.username || postUser?.name || postUser?.email || 'Ẩn danh'}</Text>
              <Text style={styles.postTime}>
                {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#666" />
          </Pressable>
          {/* Nút Sửa bài đăng, chỉ hiện nếu là bài của user hiện tại */}
          {isOwner && (
            <Pressable style={styles.editBtn} onPress={() => navigation.navigate('EditPostScreen', { post })}>
              <Ionicons name="create-outline" size={22} color="#1976d2" />
              <Text style={styles.editBtnText}>Sửa</Text>
            </Pressable>
          )}
        </View>

        {/* Main Image */}
        {post.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.image }} style={styles.mainImage} resizeMode="cover" />
          </View>
        )}

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Tags */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="shirt-outline" size={20} color="#1976d2" />
              {' '}Sản phẩm trong ảnh
            </Text>
            <View style={styles.tagsContainer}>
              {post.tags?.map((tag, index) => (
                tag.link ? (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.tagItem,
                      styles.tagWithLink,
                      pressed && { opacity: 0.6, transform: [{ scale: 0.96 }] },
                    ]}
                    onPress={() => handleProductLink(tag.link)}
                    android_ripple={{ color: '#e0e0e0', borderless: true }}
                  >
                    <Ionicons name="shirt-outline" size={16} color="#1976d2" />
                    <Text style={styles.tagText}>{tag.type}</Text>
                    {tag.color && (
                      <View style={[styles.colorDot, { backgroundColor: tag.color.toLowerCase() }]} />
                    )}
                    <View style={styles.linkIndicator}>
                      <Ionicons name="link-outline" size={14} color="#4caf50" />
                    </View>
                    <Text style={styles.productLinkText}>Xem sản phẩm</Text>
                  </Pressable>
                ) : (
                  <View key={index} style={styles.tagItem}>
                    <Ionicons name="shirt-outline" size={16} color="#1976d2" />
                    <Text style={styles.tagText}>{tag.type}</Text>
                    {tag.color && (
                      <View style={[styles.colorDot, { backgroundColor: tag.color.toLowerCase() }]} />
                    )}
                  </View>
                )
              ))}
            </View>
          </View>

          {/* Interaction Buttons */}
          <View style={styles.interactionSection}>
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionBtn} onPress={handleLike}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? "#e53935" : "#666"} 
                />
                <Text style={[styles.actionText, isLiked && styles.likedText]}>
                  {isLiked ? (post.likes || 0) + 1 : post.likes || 0}
                </Text>
              </Pressable>
              
              <Pressable style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={24} color="#666" />
                <Text style={styles.actionText}>{comments.length}</Text>
              </Pressable>
              
              <Pressable style={styles.actionBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#666" />
                <Text style={styles.actionText}>Chia sẻ</Text>
              </Pressable>
            </View>
            
            <Pressable style={styles.actionBtn} onPress={handleSave}>
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={isSaved ? "#1976d2" : "#666"} 
              />
            </Pressable>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="chatbubbles-outline" size={20} color="#1976d2" />
              {' '}Bình luận ({comments.length})
            </Text>
            {comments.map((comment, index) => (
              <View key={comment.id || index} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={[styles.commentUserAvatar, comment.user === 'Bạn' && styles.myAvatar]}>
                    <Ionicons name="person" size={16} color={comment.user === 'Bạn' ? "#fff" : "#1976d2"} />
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={[styles.commentUserName, comment.user === 'Bạn' && styles.myCommentName]}>
                      {comment.user}
                    </Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <Text style={styles.commentTime}>
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            {comments.length === 0 && (
              <View style={styles.noCommentsContainer}>
                <Ionicons name="chatbubble-outline" size={32} color="#ccc" />
                <Text style={styles.noComments}>Chưa có bình luận nào.</Text>
                <Text style={styles.noCommentsSub}>Hãy là người đầu tiên bình luận!</Text>
              </View>
            )}
          </View>

          {/* Add Comment */}
          <View style={styles.addCommentSection}>
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Thêm bình luận..."
                placeholderTextColor="#999"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={200}
              />
              <View style={styles.inputActions}>
                <Text style={styles.charCount}>{commentText.length}/200</Text>
                <Pressable 
                  style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]} 
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <Ionicons name="send" size={20} color={commentText.trim() ? "#1976d2" : "#ccc"} />
                </Pressable>
              </View>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  backBtn: {
    padding: 8,
  },
  imageContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  contentCard: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  tagsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagWithLink: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  tagText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  linkIndicator: {
    marginLeft: 4,
  },
  interactionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  likedText: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  commentsSection: {
    marginBottom: 20,
  },
  commentItem: {
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  myAvatar: {
    backgroundColor: '#1976d2',
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  myCommentName: {
    color: '#1976d2',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noComments: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    fontWeight: '500',
  },
  noCommentsSub: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  addCommentSection: {
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingTop: 16,
  },
  commentInputContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
  },
  sendButton: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#f5f5f5',
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
  productLinkText: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginLeft: 8,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
    alignSelf: 'center',
  },
  editBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
});

export default PostDetailScreen; 