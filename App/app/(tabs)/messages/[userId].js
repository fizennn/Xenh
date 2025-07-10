import { useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import MessageScreen from '../../../screens/MessageScreen';

export default function MessageScreenWrapper() {
  const { userId } = useLocalSearchParams();
  const { users, loading } = useContext(AppContext);
  if (loading) return null; // hoặc có thể trả về loading indicator
  const toUser = users.find(u => String(u.id) === String(userId));
  if (!toUser) return null;
  return <MessageScreen route={{ params: { toUser } }} />;
} 