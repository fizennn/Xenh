import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants/api';
import { AppContext } from '../context/AppContext';

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [caption, setCaption] = useState(post.caption);
  const [image, setImage] = useState(post.image);
  const { setPosts, posts } = useContext(AppContext);

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${BASE_URL}/posts/${post.id}`, {
        caption,
        image
      });
      // Cập nhật lại post trong context
      setPosts(posts.map(p => (p.id === post.id ? { ...p, caption, image } : p)));
      Alert.alert('Thành công', 'Bài viết đã được cập nhật!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật bài viết!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sửa Caption:</Text>
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        multiline
      />
      <Text style={styles.label}>Sửa Ảnh (URL):</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
      />
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
      <Button title="Lưu" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4 },
  image: { width: '100%', height: 200, marginVertical: 12, borderRadius: 8 }
});

export default EditPostScreen; 