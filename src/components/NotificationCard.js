import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  TranslateText,
  GetSelectedLanguage,
} from '../config/Helpers/googleTranslate';
import URL from '../config/Common';
import Images from '../assets/Images';
import {Colors, NavService, Shadows} from '../config';
import { getUrl } from '../config/Helpers/getUrl';

const NotificationCard = ({item}) => {
  const {t, i18n} = useTranslation();
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDescription, setNotificationDescription] = useState('');

  const getTranslatedText = async (text, type) => {
    const result = await TranslateText(text, GetSelectedLanguage(i18n));
    if (type == 'title') {
      setNotificationTitle(result);
    }
    if (type == 'description') {
      setNotificationDescription(result);
    }
  };
  useEffect(() => {
    getTranslatedText(item?.title, 'title');
    getTranslatedText(item?.body, 'description');
  }, []);
  return (
    <TouchableOpacity
      // onPress={() => NavService.navigate('Chat')}
      style={{
        height: Dimensions.get('window').height * 0.11,
        width: '100%',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        backgroundColor: Colors.white,
        ...Shadows.shadow3,
        marginBottom: 14,
      }}>
      <TouchableOpacity
        onPress={() =>
          NavService.navigate(
            'Profile',
            (details = {
              name: item?.sender_name,
              email: item?.sender_email,
              image: item?.sender_image,
              id: item?.sender_id,
            }),
          )
        }
        style={{
          flex: 2,
          // backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
          height: Dimensions.get('window').height * 0.08,
          width: Dimensions.get('window').width * 0.15,
          borderRadius: 30,
        }}>
        <Image
          source={
            item?.sender_image !== null
              ? {
                  uri:getUrl(item?.sender_image,)
                }
              : Images.user
          }
          resizeMode={'stretch'}
          style={{
            height: Dimensions.get('window').height * 0.07,
            width: Dimensions.get('window').width * 0.13,
            // borderRadius: 100,
          }}
        />
      </TouchableOpacity>
      <View style={{flex: 8}}>
        <Text style={{color: Colors.black, fontWeight: '600', fontSize: 16}}>
          {notificationTitle}
        </Text>
        <Text
          style={{
            color: Colors.grey,
            fontSize: 14,
            fontWeight: '400',
            paddingLeft: 2,
          }}>
          {notificationDescription}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
            marginHorizontal: 5,
          }}>
          <Text style={{color: Colors.grey, fontSize: 13}}>
            {item?.date?.slice(0, 11)}
          </Text>
          <Text
            style={{
              color: Colors.grey,
              fontSize: 13,
              fontWeight: '400',
              paddingLeft: 2,
            }}>
            {item?.date?.slice(11, 18)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
