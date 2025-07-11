import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { detectClothesAI, suggestOutfitsAI, chatWithAI } from '../api/ai';

export default function AIChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Xin chào! Tôi là AI Fashion Assistant. Tôi có thể giúp bạn nhận diện trang phục và đưa ra gợi ý phối đồ. Bạn có thể gửi ảnh hoặc mô tả trang phục của mình.',
      timestamp: new Date(),
      suggestions: ['Gợi ý phối đồ', 'Tư vấn màu sắc', 'Phong cách thời trang', 'Gửi ảnh nhận diện'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const addMessage = (content, type = 'user', image = null, suggestions = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      image,
      suggestions,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = selectedImage 
      ? 'Tôi đã gửi một ảnh để nhận diện trang phục.'
      : inputText.trim();
    
    addMessage(userMessage, 'user', selectedImage);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      if (selectedImage) {
        // Xử lý nhận diện ảnh
        const result = await detectClothesAI(selectedImage);
        const detectedItems = result.tags || [];
        
        let response = 'Tôi đã nhận diện được các trang phục sau:\n\n';
        detectedItems.forEach((item, index) => {
          response += `${index + 1}. ${item.type} - Màu: ${item.color}, Phong cách: ${item.style}\n`;
        });
        
        response += '\nBạn có muốn tôi gợi ý cách phối đồ với những trang phục này không?';
        
        setTimeout(() => {
          addMessage(response, 'bot');
          setIsTyping(false);
        }, 1000);
      } else {
        // Xử lý text input bằng AI chatbot
        const aiResponse = await chatWithAI(inputText);
        setTimeout(() => {
          addMessage(aiResponse.response, 'bot', null, aiResponse.suggestions);
          setIsTyping(false);
        }, 1000);
      }
    } catch (error) {
      setTimeout(() => {
        addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 'bot');
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      {item.type === 'bot' && (
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={20} color="#fff" />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userBubble : styles.botBubble
      ]}>
        {item.image && (
          <Image 
            source={{ uri: item.image.uri }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        <Text style={[
          styles.messageText,
          item.type === 'user' ? styles.userText : styles.botText
        ]}>
          {item.content}
        </Text>
        
        {item.suggestions && item.type === 'bot' && (
          <View style={styles.suggestionsContainer}>
            {item.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>AI Fashion Assistant</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>AI đang nhập...</Text>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      {!isTyping && messages.length === 1 && (
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Thao tác nhanh:</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleSuggestionPress('Gợi ý phối đồ công sở')}
            >
              <Ionicons name="briefcase-outline" size={24} color="#667eea" />
              <Text style={styles.quickActionText}>Công sở</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleSuggestionPress('Gợi ý phối đồ dự tiệc')}
            >
              <Ionicons name="wine-outline" size={24} color="#667eea" />
              <Text style={styles.quickActionText}>Dự tiệc</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleSuggestionPress('Tư vấn màu sắc')}
            >
              <Ionicons name="color-palette-outline" size={24} color="#667eea" />
              <Text style={styles.quickActionText}>Màu sắc</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => handleSuggestionPress('Phong cách thời trang')}
            >
              <Ionicons name="shirt-outline" size={24} color="#667eea" />
              <Text style={styles.quickActionText}>Phong cách</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
            <Ionicons name="image-outline" size={24} color="#667eea" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={takePhoto} style={styles.attachButton}>
            <Ionicons name="camera-outline" size={24} color="#667eea" />
          </TouchableOpacity>

          <View style={styles.textInputContainer}>
            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                <TouchableOpacity 
                  onPress={() => setSelectedImage(null)}
                  style={styles.removeImageButton}
                >
                  <Ionicons name="close-circle" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tin nhắn hoặc gửi ảnh..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity 
            onPress={handleSendMessage}
            style={[
              styles.sendButton,
              (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled
            ]}
            disabled={!inputText.trim() && !selectedImage}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={(!inputText.trim() && !selectedImage) ? '#ccc' : '#fff'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuButton: {
    padding: 8,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 4,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#333',
  },
  botText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: '#333',
    fontSize: 16,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginHorizontal: 2,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    borderRadius: 10,
  },
  textInput: {
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#667eea',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  suggestionButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    minWidth: 70,
  },
  quickActionText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
}); 