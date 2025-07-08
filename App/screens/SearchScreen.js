import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const samplePosts = [
  { id: '1', title: 'Bài đăng 1', description: 'Mô tả bài đăng 1' },
  { id: '2', title: 'Bài đăng 2', description: 'Mô tả bài đăng 2' },
  { id: '3', title: 'Thời trang mùa hè', description: 'Gợi ý phối đồ mùa hè' },
];

const SearchScreen = () => {
  const [query, setQuery] = useState('');

  const filteredResults = samplePosts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Tìm kiếm</Text>
        <View style={styles.inputBox}>
          <Ionicons name="search-outline" size={20} color="#1976d2" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nhập từ khóa..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#888"
          />
        </View>
        {filteredResults.length === 0 ? (
          <Text style={styles.empty}>Không tìm thấy kết quả phù hợp.</Text>
        ) : (
          <FlatList
            data={filteredResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Ionicons name="document-text-outline" size={18} color="#1976d2" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
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
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f6fc',
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e3eafc',
    width: '100%',
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
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: 240,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  itemDesc: {
    fontSize: 14,
    color: '#555',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default SearchScreen; 