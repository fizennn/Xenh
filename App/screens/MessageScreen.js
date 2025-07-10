import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../context/AppContext';

const API_URL = 'http://192.168.2.14:3001/messages';

const MessageScreen = ({ route }) => {
  const { user } = useContext(AppContext);
  const { toUser } = route.params; // user object của người nhận
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  // Lấy tin nhắn giữa 2 user
  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_URL);
      // Lọc tin nhắn giữa user hiện tại và toUser
      const filtered = res.data.filter(
        m => (m.fromUserId === user.id && m.toUserId === toUser.id) ||
             (m.fromUserId === toUser.id && m.toUserId === user.id)
      );
      setMessages(filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Tự động refresh mỗi 2s
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = {
      fromUserId: user.id,
      toUserId: toUser.id,
      content: input,
      createdAt: new Date().toISOString()
    };
    try {
      await axios.post(API_URL, newMsg);
      setInput('');
      fetchMessages();
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      alert('Không gửi được tin nhắn!');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.fromUserId === user.id ? styles.myMsg : styles.otherMsg]}>
      <Text style={styles.msgText}>{item.content}</Text>
      <Text style={styles.msgTime}>{new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat với {toUser.username}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() + item.createdAt}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eaf2fb' },
  header: { padding: 16, backgroundColor: '#1976d2', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  message: { maxWidth: '80%', marginBottom: 10, borderRadius: 16, padding: 10 },
  myMsg: { alignSelf: 'flex-end', backgroundColor: '#1976d2' },
  otherMsg: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#dce3ed' },
  msgText: { color: '#222', fontSize: 16 },
  msgTime: { color: '#888', fontSize: 12, marginTop: 4, alignSelf: 'flex-end' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#dce3ed' },
  input: { flex: 1, fontSize: 16, backgroundColor: '#f6fafd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  sendBtn: { backgroundColor: '#1976d2', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18 },
});

export default MessageScreen; 