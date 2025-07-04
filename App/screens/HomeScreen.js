import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import PostItem from '../components/PostItem';

// Màn hình trang chủ, hiển thị danh sách bài đăng
export default function HomeScreen() {
  const { posts } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bảng tin</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostItem post={item} />}
        ListEmptyComponent={<Text>Chưa có bài đăng nào.</Text>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f7fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 18, color: '#1976d2', letterSpacing: 1 },
}); 