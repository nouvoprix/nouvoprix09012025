import React from 'react';
import { Dimensions, Text, Image, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import { Colors, NavService, Shadows } from '../config';
import Icons from '../assets/Icons';
import URL from '../config/Common';
import { getUrl } from '../config/Helpers/getUrl';

const CustomChatList = ({ img, title, details, detailsList, unreadCount, onPress }) => {
  const user = useSelector(state => state.user?.userData);
  let chatData =
    detailsList?.sender_id?._id !== user?._id
      ? detailsList?.sender_id
      : detailsList?.receiver_id;
  const offered = false;
  return (
    chatData && (
      <View
        style={{
          height: Dimensions.get('window').height * 0.08,
          backgroundColor: Colors.white,
          borderRadius: 30,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          ...Shadows.shadow3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 6,
          }}>
          <Image
            source={{ uri: getUrl(chatData?.profilePicture) }}
            style={{
              borderRadius: 25,
              height: 45,
              width: 45,
            }}
          />
          <Text
            style={{
              color: Colors.black,
              fontSize: 18,
              fontWeight: '700',
              paddingLeft: 8,
            }}>
            {chatData?.name}
          </Text>
          {unreadCount > 0 && <View style={{
            backgroundColor: Colors.green,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 20,
            borderRadius: 10,
          }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontWeight: '700',
                // paddingLeft: 8,
              }}>
              {unreadCount}
            </Text>
          </View>}
        </View>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              height: 35,
              width: 35,
            }}>
            <Image
              source={Icons.forward}
              resizeMode={'contain'}
              style={{
                height: Dimensions.get('window').height * 0.03,
                width: Dimensions.get('window').width * 0.05,
              }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 11, marginVertical: 4, color: 'black' }}>
            {t('Chat')}
          </Text>
        </View>
      </View>
    )
  );
};

export default CustomChatList;
