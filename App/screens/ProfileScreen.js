import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const userInfo = {
  email: 'user@email.com',
  name: 'Người dùng mẫu',
  avatar: 'https://i.pravatar.cc/150?img=3',
};

const ProfileScreen = ({ navigation, onLogout }) => {
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleChangePassword = () => {
    if (!oldPw || !newPw || !confirmPw) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp!');
      return;
    }
    Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
    setOldPw(''); setNewPw(''); setConfirmPw(''); setShowChangePw(false);
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
        <Text style={styles.title}>{userInfo.name}</Text>
        <Text style={styles.email}>{userInfo.email}</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          onPress={() => setShowChangePw(v => !v)}
        >
          <Text style={styles.buttonText}>{showChangePw ? 'Hủy đổi mật khẩu' : 'Đổi mật khẩu'}</Text>
        </Pressable>
        {showChangePw && (
          <View style={styles.pwBox}>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#1976d2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu cũ"
                value={oldPw}
                onChangeText={setOldPw}
                secureTextEntry
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#1976d2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                value={newPw}
                onChangeText={setNewPw}
                secureTextEntry
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#1976d2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry
                placeholderTextColor="#888"
              />
            </View>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && { opacity: 0.7, backgroundColor: '#1565c0' }]}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Xác nhận đổi mật khẩu</Text>
            </Pressable>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.navigate('SavedPosts')}
        >
          <Text style={styles.buttonText}>Bài đăng đã lưu</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7, backgroundColor: '#d32f2f' }]}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
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
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
    letterSpacing: 1,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  pwBox: {
    marginVertical: 16,
    width: '100%',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f6fc',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e3eafc',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#222',
  },
});

export default ProfileScreen; 