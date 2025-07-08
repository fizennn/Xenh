import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const suggestions = [
  { id: '1', title: 'Phong cách mùa hè', desc: 'Áo phông trắng + Quần short jeans + Giày sneaker' },
  { id: '2', title: 'Công sở thanh lịch', desc: 'Sơ mi xanh + Quần tây đen + Giày lười' },
  { id: '3', title: 'Dạo phố năng động', desc: 'Áo thun graphic + Quần jogger + Giày thể thao' },
];

export default function StyleSuggestScreen() {
  return (
    <LinearGradient colors={['#a1c4fd', '#c2e9fb']} style={styles.gradient}>
      <View style={styles.card}>
        <Text style={styles.title}>Gợi ý phối đồ</Text>
        <FlatList
          data={suggestions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.suggestBox}>
              <Ionicons name="bulb-outline" size={20} color="#1976d2" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.suggestTitle}>{item.title}</Text>
                <Text style={styles.suggestDesc}>{item.desc}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
        />
      </View>
    </LinearGradient>
  );
}

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
  suggestBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f6fc',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 270,
  },
  suggestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  suggestDesc: {
    fontSize: 14,
    color: '#555',
  },
});
