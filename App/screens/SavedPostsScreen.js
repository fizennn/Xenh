import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SavedPostsScreen = ({ route }) => {
  const savedPosts = route?.params?.savedPosts || [];

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Bài đăng đã lưu</Text>
        {savedPosts.length === 0 ? (
          <Text style={styles.empty}>Chưa có bài đăng nào được lưu.</Text>
        ) : (
          <FlatList
            data={savedPosts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.postRow}>
                <Ionicons name="bookmark-outline" size={20} color="#1976d2" style={{ marginRight: 8 }} />
                <Text style={styles.item}>{item.title}</Text>
              </View>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
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
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 24,
    letterSpacing: 1,
    textAlign: 'center',
  },
  item: {
    fontSize: 16,
    color: '#222',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flex: 1,
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 220,
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default SavedPostsScreen; 