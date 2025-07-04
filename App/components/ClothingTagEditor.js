import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Editor cho từng tag trang phục
export default function ClothingTagEditor({ tags, onChange }) {
  // Khi thay đổi thông tin tag
  const handleTagChange = (idx, key, value) => {
    const newTags = tags.map((tag, i) =>
      i === idx ? { ...tag, [key]: value } : tag
    );
    onChange(newTags);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa tag cho từng món đồ</Text>
      {tags.map((tag, idx) => (
        <View key={idx} style={styles.tagBox}>
          <Text style={styles.label}>Món {idx + 1}:</Text>
          <TextInput
            style={styles.input}
            value={tag.type}
            onChangeText={(text) => handleTagChange(idx, 'type', text)}
            placeholder="Loại đồ (VD: Áo thun)"
          />
          <TextInput
            style={styles.input}
            value={tag.color}
            onChangeText={(text) => handleTagChange(idx, 'color', text)}
            placeholder="Màu sắc"
          />
          <TextInput
            style={styles.input}
            value={tag.style}
            onChangeText={(text) => handleTagChange(idx, 'style', text)}
            placeholder="Phong cách"
          />
          <TextInput
            style={styles.input}
            value={tag.link || ''}
            onChangeText={(text) => handleTagChange(idx, 'link', text)}
            placeholder="Link mua sắm (nếu có)"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 12 },
  title: { fontWeight: 'bold', marginBottom: 8 },
  tagBox: { backgroundColor: '#f7f7f7', borderRadius: 8, padding: 8, marginBottom: 8 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 6, marginBottom: 6 },
}); 