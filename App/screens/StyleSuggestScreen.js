import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Pressable, Modal } from 'react-native';
import { suggestOutfitsAI } from '../api/ai';
import TryOnModal from '../components/TryOnModal';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { IconSymbol } from '../components/ui/IconSymbol';
import { Colors } from '../constants/Colors';

const CONTEXTS = [
  { key: 'work', label: 'Đi làm', icon: 'house.fill' },
  { key: 'casual', label: 'Đi chơi', icon: 'paperplane.fill' },
  { key: 'party', label: 'Tiệc', icon: 'chevron.left.forwardslash.chevron.right' },
];

export default function StyleSuggestScreen() {
  const [context, setContext] = useState('casual');
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState([]);
  const [tryOnOutfit, setTryOnOutfit] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSuggest = async () => {
    setLoading(true);
    setShowOverlay(true);
    const res = await suggestOutfitsAI(context);
    setOutfits(res);
    setLoading(false);
    setShowOverlay(false);
  };

  const renderContextButton = (item) => (
    <Pressable
      key={item.key}
      style={[styles.contextBtn, context === item.key && styles.contextBtnActive]}
      onPress={() => setContext(item.key)}
    >
      <IconSymbol name={item.icon} size={22} color={context === item.key ? '#fff' : Colors.light.icon} />
      <ThemedText style={[styles.contextLabel, context === item.key && { color: '#fff' }]}>{item.label}</ThemedText>
    </Pressable>
  );

  const renderOutfit = ({ item }) => (
    <ThemedView style={styles.outfitCard}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <ThemedText type="subtitle" style={styles.desc}>{item.description}</ThemedText>
      <View style={styles.itemList}>
        {item.items.map((cl, idx) => (
          <View key={idx} style={styles.itemRow}>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.icon} />
            <ThemedText style={styles.item}>{cl.type} - {cl.color} - {cl.style}</ThemedText>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.tryBtn} onPress={() => setTryOnOutfit(item)}>
        <ThemedText style={styles.tryBtnText}>Mặc thử</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Gợi ý phối đồ bằng AI</ThemedText>
      <View style={styles.contextRow}>
        {CONTEXTS.map(renderContextButton)}
      </View>
      <TouchableOpacity style={styles.suggestBtn} onPress={handleSuggest} disabled={loading}>
        <ThemedText style={styles.suggestBtnText}>Gợi ý ngay</ThemedText>
      </TouchableOpacity>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOutfit}
        ListEmptyComponent={!loading && <ThemedText style={{ marginTop: 16 }}>Chưa có gợi ý nào.</ThemedText>}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      {/* Overlay loading hiện đại */}
      <Modal visible={showOverlay} transparent animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      </Modal>
      {/* Modal mặc thử outfit */}
      <TryOnModal
        visible={!!tryOnOutfit}
        onClose={() => setTryOnOutfit(null)}
        outfit={tryOnOutfit}
      />
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');
const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { marginBottom: 18, textAlign: 'center' },
  contextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  contextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    borderRadius: 24,
    marginHorizontal: 4,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  contextBtnActive: {
    backgroundColor: Colors.light.tint,
  },
  contextLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  suggestBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
    paddingVertical: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  outfitCard: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: width - 68,
    height: 220,
    borderRadius: CARD_RADIUS,
    marginBottom: 10,
    alignSelf: 'center',
  },
  desc: {
    marginBottom: 8,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  itemList: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 6,
  },
  item: {
    fontSize: 14,
    color: '#333',
  },
  tryBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  tryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
