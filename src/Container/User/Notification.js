import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import AppBackground from '../../components/AppBackground';
import NotificationCard from '../../components/NotificationCard';
import {getNotifications} from '../../redux/APIs';

const Notification = ({navigation}) => {
  const [notification, setNotificationData] = useState();
  const {t} = useTranslation();
  useEffect(() => {
    const get = async () => {
      const focusListner = navigation.addListener('focus', async () => {
        const notificationData = await getNotifications();
        setNotificationData(notificationData?.data);
      });
      return focusListner;
    };
    get();
  }, []);
  return (
    <AppBackground back title={t('Notifications')} notification={false}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notification}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{color: 'black'}}>{t('No_Notification_found')}</Text>
          </View>
        )}
        renderItem={({item}) => <NotificationCard item={item} />}
      />
    </AppBackground>
  );
};

export default Notification;

const styles = StyleSheet.create({});
