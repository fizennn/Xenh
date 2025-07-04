import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';
import PostItem from '../components/PostItem';

// Màn hình khám phá các bài đăng phổ biến
export default function ExploreScreen() {
  const { posts } = useContext(AppContext);
  // Sắp xếp bài đăng theo số like giảm dần
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khám phá bài đăng phổ biến</Text>
      <FlatList
        data={sortedPosts}
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