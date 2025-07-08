import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Modal, Dimensions, Text, Pressable, Alert, PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { detectClothesAI } from '../api/ai';
import { AppContext } from '../context/AppContext';
import ClothingTagEditor from '../components/ClothingTagEditor';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { IconSymbol } from '../components/ui/IconSymbol';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addPost, user } = useContext(AppContext);
  const [editTags, setEditTags] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

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
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn ảnh!');
        return;
      }

      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại!');
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          console.log('Selected image:', selectedImage);
          setImage(selectedImage);
          setResult(null);
          setEditTags(null);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại!');
    }
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh!');
        return;
      }

      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
        saveToPhotos: true,
      };

      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
          Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại!');
        } else if (response.assets && response.assets.length > 0) {
          const capturedImage = response.assets[0];
          console.log('Captured image:', capturedImage);
          setImage(capturedImage);
          setResult(null);
          setEditTags(null);
        }
      });
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại!');
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
      setResult(res);
      setEditTags(res.tags || []);
    } catch (error) {
      console.error('Error detecting clothes:', error);
      Alert.alert('Lỗi', 'Không thể nhận diện quần áo. Vui lòng thử lại!');
    } finally {
      setLoading(false);
      setShowOverlay(false);
    }
  };

  const handlePost = () => {
    if (!image) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước!');
      return;
    }
    
    if (!editTags || editTags.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhận diện quần áo trước!');
      return;
    }

    const newPost = {
      id: Date.now(),
      user: user || { id: 1, name: 'User Demo' },
      image: image.uri,
      tags: editTags,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    addPost(newPost);
    
    Alert.alert('Thành công', 'Đã đăng bài thành công!', [
      { text: 'OK', onPress: () => {
        setImage(null);
        setResult(null);
        setEditTags(null);
        navigation.navigate('Home');
      }}
    ]);
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Tải ảnh lên & nhận diện</Text>
          
          <View style={styles.btnRow}>
            <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]} onPress={pickImage}>
              <Ionicons name="image-outline" size={20} color="#1976d2" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Chọn ảnh</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={20} color="#1976d2" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Chụp ảnh</Text>
            </Pressable>
          </View>

          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <Pressable 
                style={styles.removeImageBtn} 
                onPress={() => {
                  setImage(null);
                  setResult(null);
                  setEditTags(null);
                }}
              >
                <Ionicons name="close-circle" size={24} color="#f44336" />
              </Pressable>
            </View>
          )}

          {image && !result && (
            <Pressable 
              style={({ pressed }) => [styles.detectBtn, pressed && { opacity: 0.7 }]} 
              onPress={handleDetect} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
              ) : (
                <Ionicons name="search-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              )}
              <Text style={styles.detectBtnText}>
                {loading ? 'Đang nhận diện...' : 'Nhận diện quần áo'}
              </Text>
            </Pressable>
          )}

          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Kết quả nhận diện:</Text>
              <View style={styles.tagsContainer}>
                {editTags?.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.type}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {result && editTags && (
            <Pressable 
              style={({ pressed }) => [styles.postBtn, pressed && { opacity: 0.7 }]} 
              onPress={handlePost}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.postBtnText}>Đăng bài</Text>
            </Pressable>
          )}
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
}); 