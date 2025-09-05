import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBackground from '../../components/AppBackground';
import CustomChatList from '../../components/CustomChatList';
import { getMessageList } from '../../redux/APIs';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user?.userData?._id);
  const [ChatListData, setChatListData] = useState([]);
  const [viewedChats, setViewedChats] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const socket = useSelector(state => state.socket);

  const loadViewedChats = async () => {
    try {
      const key = 'viewedChats_' + user_id;
      const viewed = await AsyncStorage.getItem(key);
      if (viewed) {
        setViewedChats(new Set(JSON.parse(viewed)));
      } else {
        setViewedChats(new Set());
      }
    } catch (error) {
      console.error('Error loading viewed chats:', error);
    }
  };

  const saveViewedChats = async (chats) => {
    try {
      const key = 'viewedChats_' + user_id;
      await AsyncStorage.setItem(key, JSON.stringify([...chats]));
    } catch (error) {
      console.error('Error saving viewed chats:', error);
    }
  };

  const getMessageListFunction = async () => {
    const data = await getMessageList();
    console.log("Chat List => ", data?.listChat);
    setChatListData(data?.listChat);

    // Calculate unread chats count using ref
    if (data?.listChat) {
      const unreadCount = data.listChat.reduce((count, chat) => {
        const isViewed = viewedChatsRef.current.has(chat._id);
        if (!isViewed && chat.unreadCount > 0) {
          return count + 1;
        }
        return count;
      }, 0);
      dispatch({ type: 'SET_UNREAD_CHATS_COUNT', payload: unreadCount });
    }
  };

  const viewedChatsRef = useRef(viewedChats);

  useEffect(() => {
    viewedChatsRef.current = viewedChats;
  }, [viewedChats]);

  useEffect(() => {
    loadViewedChats();
  }, [user_id]);

  useEffect(() => {
    setLoading(true);
    console.log("socket=>", socket, user_id);
    const handleResponse = (data) => {
      try {
        console.log("RES_CHAT=> ", data);
        const uniqueData = data?.data.filter((item, index, self) => self.findIndex(i => i._id === item._id) === index);
        setChatListData(uniqueData);
        setLoading(false);

        // Calculate unread chats count using ref to avoid infinite loop
        if (uniqueData) {
          const unreadCount = uniqueData.reduce((count, chat) => {
            const isViewed = viewedChatsRef.current.has(chat._id);
            if (!isViewed && chat.unreadCount > 0) {
              return count + 1;
            }
            return count;
          }, 0);
          dispatch({ type: 'SET_UNREAD_CHATS_COUNT', payload: unreadCount });
        }
      } catch (error) {
        console.error("Error => ", error);
        setLoading(false);
      }
    };
    socket.on('response', handleResponse);
    socket.emit('get_chat_list', {
      curr_user_Id: user_id
    });
    return () => {
      socket.off('response', handleResponse);
    };
  }, [socket, user_id, dispatch]);

  // Recalculate unread count when viewedChats changes
  useEffect(() => {
    if (ChatListData.length > 0) {
      const unreadCount = ChatListData.reduce((count, chat) => {
        const isViewed = viewedChatsRef.current.has(chat._id);
        if (!isViewed && chat.unreadCount > 0) {
          return count + 1;
        }
        return count;
      }, 0);
      dispatch({ type: 'SET_UNREAD_CHATS_COUNT', payload: unreadCount });
    }
  }, [viewedChats, ChatListData, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      socket.emit('get_chat_list', { curr_user_Id: user_id });
    });
    return unsubscribe;
  }, [navigation, user_id]);

  return (
    <AppBackground
      marginHorizontal
      product
      title={t('My_Messages')}
      notification>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={ChatListData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              style={{
                marginVertical: '50%',
                alignItems: 'center',
                alignSelf: 'center',
                alignContent: 'center',
              }}>
              <Text style={{ color: 'black' }}>{t('No_messages_found')}</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const isViewed = viewedChats.has(item._id);
            return (
              <CustomChatList
                unreadCount={isViewed ? 0 : item?.unreadCount}
                img={item?.receiver_id?.profilePicture}
                title={item?.receiver_id?.name}
                detailsList={item}
                details={{
                  receiver_id:
                    user_id != item?.receiver_id?._id
                      ? item?.receiver_id?._id
                      : item?.sender_id?._id,
                  product_id: item?.product_id?._id,
                  product_price: item?.product_id?.product_price,
                  product_title: item?.product_id?.product_title,
                  product_picture: item?.product_id?.product_picture,
                  user_title:
                    item?.sender_id?._id !== user_id
                      ? item?.sender_id?.name
                      : item?.receiver_id?.name,
                }}
                onPress={() => {
                  const newViewed = new Set([...viewedChats, item._id]);
                  setViewedChats(newViewed);
                  saveViewedChats(newViewed);
                  navigation.navigate('Chat', { details: {
                    receiver_id:
                      user_id != item?.receiver_id?._id
                        ? item?.receiver_id?._id
                        : item?.sender_id?._id,
                    product_id: item?.product_id?._id,
                    product_price: item?.product_id?.product_price,
                    product_title: item?.product_id?.product_title,
                    product_picture: item?.product_id?.product_picture,
                    user_title:
                      item?.sender_id?._id !== user_id
                        ? item?.sender_id?.name
                        : item?.receiver_id?.name,
                  }, offered: false });
                }}
              />
            );
          }}
        />
      )}
    </AppBackground>
  );
};

export default ChatList;
