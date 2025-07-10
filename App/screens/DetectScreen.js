import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { detectClothesAI } from '../api/ai';

export default function DetectScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để chọn ảnh!');
      return;
    }
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImage(res.assets[0]);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh!');
      return;
    }
    let res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImage(res.assets[0]);
      setResult(null);
    }
  };

  const handleDetect = async () => {
    if (!image) {
      Alert.alert('Lỗi', 'Vui lòng chọn hoặc chụp ảnh trước!');
      return;
    }
    setLoading(true);
    try {
      const res = await detectClothesAI(image);
      const names = (res.tags || []).map(tag => tag.type).filter(Boolean);
      setResult(names);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể nhận diện quần áo. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Nhận diện trang phục (AI)</Text>
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
        <TouchableOpacity style={styles.aiBtn} onPress={handleDetect}>
          <Ionicons name="sparkles-outline" size={20} color="#fff" />
          <Text style={styles.aiBtnText}>Nhận diện trang phục</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="small" color="#1976d2" style={{ marginVertical: 8 }} />}
        {result && result.length > 0 && (
          <View style={{ marginTop: 10, marginBottom: 8 }}>
            <Text style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: 4 }}>Kết quả nhận diện:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {result.map((name, idx) => (
                <View key={idx} style={{ backgroundColor: '#e3f2fd', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginRight: 6, marginBottom: 6 }}>
                  <Text style={{ color: '#1976d2', fontWeight: '600' }}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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
    alignSelf: 'center',
    marginTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
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
}); 