import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const LoginScreen = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { users, loading: loadingUsers, loginUser } = useContext(AppContext);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }
    if (loadingUsers) {
      Alert.alert('Đang tải dữ liệu người dùng, vui lòng đợi...');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Login attempt:', { email, password });
      console.log('Current users:', users);
      const foundUser = users.find(u => u.email === email && u.password === password);
      console.log('Found user:', foundUser);
      if (foundUser) {
        if (typeof onLogin === 'function') {
          onLogin(foundUser);
        }
        if (typeof loginUser === 'function') {
          loginUser(foundUser);
        }
      } else {
        Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng!');
      }
    }, 500);
  };

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Đăng nhập</Text>
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
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
        </Pressable>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.switchBtn}>
          <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.switchBtn}>
          <Text style={[styles.switchText, { color: 'red' }]}>Quên mật khẩu?</Text>
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

export default LoginScreen; 