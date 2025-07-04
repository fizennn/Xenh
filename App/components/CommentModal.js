import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

// Modal hiển thị và thêm bình luận cho bài đăng
export default function CommentModal({ visible, onClose, post }) {
  const [text, setText] = useState('');
  const { user, addComment } = useContext(AppContext);

  // Thêm bình luận mới
  const handleAddComment = () => {
    if (text.trim()) {
      addComment(post.id, { user: user.name, text, createdAt: new Date().toISOString() });
      setText('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Bình luận</Text>
        <FlatList
          data={post.comments}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <Text style={styles.user}>{item.user}:</Text>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Chưa có bình luận nào.</Text>}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Nhập bình luận..."
          />
          <Button title="Gửi" onPress={handleAddComment} />
        </View>
        <Button title="Đóng" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  commentBox: { marginBottom: 10, backgroundColor: '#f2f2f2', borderRadius: 6, padding: 8 },
  user: { fontWeight: 'bold' },
  text: { marginBottom: 2 },
  time: { fontSize: 10, color: '#888' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 6, marginRight: 8 },
}); 