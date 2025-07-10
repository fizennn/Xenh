import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { detectClothesAI } from '../api/ai';
import { AppContext } from '../context/AppContext';

export default function UploadScreen({ navigation, route }) {
  const editingPost = route?.params?.post;
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addPost, user } = useContext(AppContext);
  const [editTags, setEditTags] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [caption, setCaption] = useState('');
  const [newTag, setNewTag] = useState('');

  // Nếu là sửa bài đăng, fill dữ liệu cũ
  React.useEffect(() => {
    if (editingPost) {
      setImage(editingPost.image ? { uri: editingPost.image } : null);
      setCaption(editingPost.caption || '');
      setEditTags(editingPost.tags || []);
    }
  }, [editingPost]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Quyền truy cập Camera",
            message: "Ứng dụng cần quyền truy cập camera để chụp ảnh",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Từ chối",
            buttonPositive: "Đồng ý"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Quyền truy cập Thư viện",
            message: "Ứng dụng cần quyền truy cập thư viện ảnh",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Từ chối",
            buttonPositive: "Đồng ý"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn ảnh!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage);
      setResult(null);
      setEditTags([]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const capturedImage = result.assets[0];
      setImage(capturedImage);
      setResult(null);
      setEditTags([]);
    }
  };

  const handleDetect = async () => {
    if (!image) {
      Alert.alert('Lỗi', 'Vui lòng chọn hoặc chụp ảnh trước!');
      return;
    }
    setLoading(true);
    setShowOverlay(true);
    try {
      const res = await detectClothesAI(image);
      // Chỉ lấy tên trang phục (type) từ kết quả AI
      const names = (res.tags || []).map(tag => tag.type).filter(Boolean);
      setEditTags(names.map(name => ({ type: name })));
      setResult({ names });
    } catch (error) {
      console.error('Error detecting clothes:', error);
      Alert.alert('Lỗi', 'Không thể nhận diện quần áo. Vui lòng thử lại!');
    } finally {
      setLoading(false);
      setShowOverlay(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy bài đăng?', [
      { text: 'Không', style: 'cancel' },
      { text: 'Hủy', style: 'destructive', onPress: () => {
        setImage(null);
        setCaption('');
        setEditTags([]);
        setResult(null);
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Home');
        }
      }}
    ]);
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước!');
      return;
    }
    if (!editTags || editTags.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất 1 tag sản phẩm!');
      return;
    }
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để đăng bài!');
      return;
    }
    if (!caption.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả/caption cho bài đăng!');
      return;
    }
    const newPost = {
      userId: user.id,
      image: image.uri,
      tags: editTags,
      caption: caption.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    try {
      if (editingPost) {
        // Gửi PUT/PATCH lên server để cập nhật bài đăng
        const updatedPost = {
          ...editingPost,
          image: image.uri,
          tags: editTags,
          caption: caption.trim(),
        };
        await axios.put(`http://192.168.2.14:3001/posts/${editingPost.id}`, updatedPost);
        addPost(updatedPost); // hoặc cập nhật context đúng cách nếu có hàm updatePost
        Alert.alert('Thành công', 'Đã cập nhật bài đăng!');
        navigation.goBack();
        return;
      }
              const res = await axios.post('http://192.168.2.14:3001/posts', newPost);
      addPost(res.data);
      Alert.alert('Thành công', 'Đã đăng bài thành công!', [
        { text: 'OK', onPress: () => {
          setImage(null);
          setResult(null);
          setEditTags([]);
          setCaption('');
          navigation.navigate('Home');
        }}
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng bài. Vui lòng thử lại!');
    }
  };

  // Thêm tag thủ công
  const handleAddTag = () => {
    const name = newTag.trim();
    if (!name) return;
    if (editTags.some(t => t.type === name)) return;
    setEditTags([...editTags, { type: name }]);
    setNewTag('');
  };
  // Xoá tag
  const handleRemoveTag = (idx) => {
    setEditTags(editTags.filter((_, i) => i !== idx));
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Đăng bài mới</Text>
          {/* Chọn/chụp ảnh */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="#1976d2" />
              <Text style={styles.imageBtnText}>Chọn ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={22} color="#1976d2" />
              <Text style={styles.imageBtnText}>Chụp ảnh</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <Image source={{ uri: image.uri }} style={{ width: '100%', height: 220, borderRadius: 16, marginBottom: 12 }} resizeMode="cover" />
          )}

          {/* Caption input */}
          <Text style={styles.label}>Mô tả bài đăng</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Nhập mô tả/caption cho bài đăng..."
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={2}
          />

          {/* Tag sản phẩm: nhập thủ công + hiển thị tag đẹp */}
          <Text style={styles.label}>Tag sản phẩm (có thể nhập thủ công)</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Nhập tên trang phục..."
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addTagBtn} onPress={handleAddTag}>
              <Ionicons name="add-circle-outline" size={22} color="#1976d2" />
              <Text style={styles.addTagBtnText}>Thêm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsList}>
            {editTags.map((tag, idx) => (
              <View key={idx} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag.type}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(idx)}>
                  <Ionicons name="close-circle" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Hiển thị kết quả nhận diện đơn giản */}
          {result && result.names && result.names.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 8 }}>
              <Text style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: 4 }}>Kết quả nhận diện:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {result.names.map((name, idx) => (
                  <View key={idx} style={{ backgroundColor: '#e3f2fd', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginRight: 6, marginBottom: 6 }}>
                    <Text style={{ color: '#1976d2', fontWeight: '600' }}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Nhận diện AI là tuỳ chọn */}
          <TouchableOpacity style={styles.aiBtn} onPress={handleDetect}>
            <Ionicons name="sparkles-outline" size={20} color="#fff" />
            <Text style={styles.aiBtnText}>Nhận diện trang phục (AI)</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="small" color="#1976d2" style={{ marginVertical: 8 }} />}

          {/* Nút đăng bài và hủy */}
          <View style={styles.actionBtnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Ionicons name="close-circle-outline" size={20} color="#f44336" />
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.postBtnText}>{editingPost ? 'Cập nhật bài đăng' : 'Đăng bài'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {showOverlay && (
        <Modal transparent visible={showOverlay}>
          <View style={styles.overlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#1976d2" />
              <Text style={styles.loadingText}>Đang nhận diện quần áo...</Text>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3eafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 8,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#e3eafc',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  detectBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#f2f6fc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#1976d2',
    marginTop: 12,
    fontWeight: '500',
  },
  label: {
    fontSize: 15,
    color: '#1976d2',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#dce3ed',
    borderRadius: 12,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    marginBottom: 8,
    color: '#222',
  },
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  imageBtnText: {
    color: '#1976d2',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 15,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'center',
  },
  aiBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 18,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderColor: '#f44336',
    marginHorizontal: 4,
    minWidth: 120,
    justifyContent: 'center',
    elevation: 2,
  },
  cancelBtnText: {
    color: '#f44336',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#43a047',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginHorizontal: 4,
    minWidth: 120,
    justifyContent: 'center',
    elevation: 2,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dce3ed',
    borderRadius: 10,
    padding: 8,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#222',
  },
  addTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  addTagBtnText: {
    color: '#1976d2',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 15,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  tagChipText: {
    color: '#1976d2',
    fontWeight: '600',
    fontSize: 15,
    marginRight: 4,
  },
}); 