import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Image, Pressable, FlatList, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const ProfileScreen = ({ navigation, onLogout }) => {
  const [showChangePw, setShowChangePw] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const { user, posts, setUserAndSyncPosts } = useContext(AppContext);

  // Lọc bài viết của user
  const userPosts = posts.filter(p => String(p.userId) === String(user?.id));

  // Thống kê
  const postCount = userPosts.length;
  const followerCount = 123; // demo
  const followingCount = 45; // demo

  const handleEditProfile = async () => {
    if (!editName) {
      Alert.alert('Lỗi', 'Tên không được để trống!');
      return;
    }
    try {
      const res = await axios.patch(`http://192.168.2.11:3001/users/${user.id}`, {
        username: editName,
        bio: editBio
      });
      setUserAndSyncPosts(res.data);
      setShowEditProfile(false);
      Alert.alert('Thành công', 'Đã cập nhật hồ sơ!');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ!');
    }
  };

  const handleChangePassword = async () => {
    if (!oldPw || !newPw || !confirmPw) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp!');
      return;
    }
    if (oldPw !== user.password) {
      Alert.alert('Lỗi', 'Mật khẩu cũ không đúng!');
      return;
    }
    try {
      const res = await axios.patch(`http://192.168.2.11:3001/users/${user.id}`, {
        password: newPw
      });
      setUserAndSyncPosts(res.data);
      setOldPw(''); setNewPw(''); setConfirmPw(''); setShowChangePw(false);
      Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu!');
    }
  };

  if (!user) {
    return (
      <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
        <View style={styles.card}>
          <Text style={styles.title}>Chưa đăng nhập</Text>
          <Text style={styles.email}>Vui lòng đăng nhập để xem thông tin cá nhân.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.title}>{user.username || user.name || 'User'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {/* Thống kê nhỏ */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 12 }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{postCount}</Text>
            <Text style={{ color: '#888' }}>Bài viết</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{followerCount}</Text>
            <Text style={{ color: '#888' }}>Follower</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{followingCount}</Text>
            <Text style={{ color: '#888' }}>Following</Text>
          </View>
        </View>
        {/* Nút chỉnh sửa hồ sơ */}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7, backgroundColor: '#388e3c' }]}
          onPress={() => {
            setEditName(user.username || '');
            setEditBio(user.bio || '');
            setShowEditProfile(true);
          }}
        >
          <Text style={styles.buttonText}>Chỉnh sửa hồ sơ</Text>
        </Pressable>
        {/* Modal chỉnh sửa hồ sơ */}
        <Modal visible={showEditProfile} animationType="slide" transparent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Chỉnh sửa hồ sơ</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên người dùng"
                value={editName}
                onChangeText={setEditName}
              />
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Bio"
                value={editBio}
                onChangeText={setEditBio}
                multiline
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <Button title="Hủy" onPress={() => setShowEditProfile(false)} color="#888" />
                <View style={{ width: 12 }} />
                <Button title="Lưu" onPress={handleEditProfile} color="#1976d2" />
              </View>
            </View>
          </View>
        </Modal>
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
        {/* Danh sách bài viết của user */}
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 18, marginBottom: 6 }}>Bài viết của bạn</Text>
        <FlatList
          data={userPosts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('PostDetail', { post: item })} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={{ fontWeight: 'bold' }}>{item.caption}</Text>
                  <Text style={{ color: '#888', fontSize: 12 }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ color: '#888', fontStyle: 'italic' }}>Bạn chưa có bài viết nào.</Text>}
          style={{ width: '100%', marginTop: 8, maxHeight: 220 }}
        />
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    color: '#222',
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProfileScreen; 