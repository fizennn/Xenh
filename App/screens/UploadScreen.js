import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { detectClothesAI } from '../api/ai';
import { AppContext } from '../context/AppContext';
import ClothingTagEditor from '../components/ClothingTagEditor';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { IconSymbol } from '../components/ui/IconSymbol';
import { Colors } from '../constants/Colors';

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addPost, user } = useContext(AppContext);
  const [editTags, setEditTags] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setImage(response.assets[0]);
        setResult(null);
      }
    });
  };

  const takePhoto = async () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setImage(response.assets[0]);
        setResult(null);
      }
    });
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    setShowOverlay(true);
    const res = await detectClothesAI(image);
    setResult(res);
    setEditTags(res.tags);
    setLoading(false);
    setShowOverlay(false);
  };

  const handlePost = () => {
    if (!image || !editTags) return;
    addPost({
      id: Date.now(),
      user,
      image: image.uri,
      tags: editTags,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    });
    setImage(null);
    setResult(null);
    setEditTags(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>Đăng outfit mới</ThemedText>
      {/* Illustration và hướng dẫn khi chưa có ảnh */}
      {!image && (
        <>
          <Image source={require('../assets/images/splash-icon.png')} style={styles.illustration} />
          <ThemedText style={styles.guideText}>
            Chọn hoặc chụp ảnh outfit của bạn để nhận diện và chia sẻ phong cách!
          </ThemedText>
          <View style={styles.uploadBox}>
            <IconSymbol name="paperplane.fill" size={48} color={Colors.light.tint} style={{ opacity: 0.8 }} />
            <ThemedText style={styles.uploadBoxText}>Chọn hoặc chụp ảnh</ThemedText>
          </View>
        </>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
          <IconSymbol name="paperplane.fill" size={26} color="#fff" />
          <ThemedText style={styles.actionBtnText}>Chọn ảnh</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
          <IconSymbol name="house.fill" size={26} color="#fff" />
          <ThemedText style={styles.actionBtnText}>Chụp ảnh</ThemedText>
        </TouchableOpacity>
      </View>
      {image && (
        <ThemedView style={styles.imageCard}>
          <Image source={{ uri: image.uri }} style={styles.image} />
        </ThemedView>
      )}
      {image && (
        <TouchableOpacity style={styles.detectBtn} onPress={handleDetect} disabled={loading}>
          <ThemedText style={styles.detectBtnText}>Nhận diện trang phục</ThemedText>
        </TouchableOpacity>
      )}
      {/* Overlay loading hiện đại */}
      <Modal visible={showOverlay} transparent animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      </Modal>
      {result && editTags && (
        <View style={{ width: '100%' }}>
          <ClothingTagEditor tags={editTags} onChange={setEditTags} />
          <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
            <ThemedText style={styles.postBtnText}>Đăng bài</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { padding: 18, alignItems: 'center', backgroundColor: '#f5f7fa', flex: 1 },
  title: { marginBottom: 18, textAlign: 'center' },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 10,
    alignSelf: 'center',
    opacity: 0.92,
  },
  guideText: {
    textAlign: 'center',
    color: Colors.light.icon,
    fontSize: 15,
    marginBottom: 16,
    opacity: 0.85,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#e3f2fd33',
    shadowColor: '#1976d2',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    // Animation nhấp nháy nhẹ
    shadowOffset: { width: 0, height: 2 },
  },
  uploadBoxText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 15,
    marginTop: 8,
    opacity: 0.85,
  },
  buttonRow: { flexDirection: 'row', gap: 16, marginBottom: 18 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 22,
    gap: 10,
    shadowColor: '#1976d2',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: { width: width - 80, height: width - 80, borderRadius: 14, borderWidth: 2, borderColor: Colors.light.tint, alignSelf: 'center' },
  detectBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
    paddingVertical: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  detectBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  postBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 