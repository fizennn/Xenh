import React, { useState } from 'react';
import { Modal, View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { tryOnOutfitAI } from '../api/ai';

// Modal thử outfit bằng AI
export default function TryOnModal({ visible, onClose, outfit }) {
  const [portrait, setPortrait] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chọn/chụp ảnh chân dung
  const pickPortrait = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setPortrait(response.assets[0]);
        setResult(null);
      }
    });
  };
  const takePortrait = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setPortrait(response.assets[0]);
        setResult(null);
      }
    });
  };

  // Gửi ảnh chân dung + outfit tới AI
  const handleTryOn = async () => {
    if (!portrait) return;
    setLoading(true);
    const res = await tryOnOutfitAI(portrait, outfit);
    setResult(res);
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Mặc thử outfit bằng AI</Text>
        <View style={styles.row}>
          <Button title="Chọn ảnh chân dung" onPress={pickPortrait} />
          <Button title="Chụp ảnh" onPress={takePortrait} />
        </View>
        {portrait && (
          <Image source={{ uri: portrait.uri }} style={styles.portrait} />
        )}
        {portrait && (
          <Button title="Mặc thử ngay" onPress={handleTryOn} disabled={loading} />
        )}
        {loading && <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 16 }} />}
        {result && (
          <View style={styles.resultBox}>
            <Text>Kết quả AI:</Text>
            <Image source={{ uri: result.resultImage }} style={styles.resultImg} />
          </View>
        )}
        <Button title="Đóng" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  portrait: { width: 180, height: 180, borderRadius: 90, alignSelf: 'center', marginBottom: 12 },
  resultBox: { marginTop: 16, alignItems: 'center' },
  resultImg: { width: 220, height: 320, borderRadius: 12, marginTop: 8 },
}); 