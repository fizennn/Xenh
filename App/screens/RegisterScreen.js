import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const RegisterScreen = ({ navigation, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    try {
      // Kiểm tra trùng email
      const res = await axios.get('http://192.168.2.14:3001/users?email=' + encodeURIComponent(email));
      if (res.data && res.data.length > 0) {
        setLoading(false);
        Alert.alert('Lỗi', 'Email đã tồn tại!');
        return;
      }
      // Gửi dữ liệu user mới lên server
              await axios.post('http://192.168.2.14:3001/users', {
        email,
        password,
        username: email.split('@')[0],
        avatar: '',
        bio: ''
      });
      setLoading(false);
      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại!');
      console.log('Register error:', error);
    }
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Đăng ký</Text>
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#1976d2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#1976d2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#888"
          />
          <Pressable onPress={() => setShowPassword(v => !v)} style={{ padding: 4 }}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#1976d2" />
          </Pressable>
        </View>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#1976d2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#888"
          />
          <Pressable onPress={() => setShowConfirmPassword(v => !v)} style={{ padding: 4 }}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#1976d2" />
          </Pressable>
        </View>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
        </Pressable>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchBtn}>
          <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 32,
    letterSpacing: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f6fc',
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e3eafc',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 12,
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
    fontSize: 18,
    letterSpacing: 1,
  },
  switchBtn: {
    marginTop: 8,
    alignItems: 'center',
  },
  switchText: {
    color: '#1976d2',
    fontSize: 15,
  },
});

export default RegisterScreen; 