import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import AppBackground from '../../components/AppBackground';
import {Colors, NavService, Shadows} from '../../config';
import Icons from '../../assets/Icons';
import {useSelector} from 'react-redux';
import URLS from '../../config/Common';
import ProfileImage from '../../components/ProfileImage';
import Images from '../../assets/Images';
import {t} from 'i18next';
import { getUrl } from '../../config/Helpers/getUrl';
const Account = () => {
  const data = useSelector(state => state.user.userData);
  return (
    <AppBackground product={true} title={t('str_Account')} notification>
      <View
        style={{
          // height: 240,
          paddingVertical: 10,
          backgroundColor: Colors.white,

          borderRadius: 20,
          ...Shadows.shadow5,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image source={Icons.star} style={{ height: 40, width: 40 }} />
            <Text
              style={{
                fontSize: 16,
                color: Colors.grey,
                fontWeight: '500',
              }}>
              4.5
            </Text>
          </View> */}
        </View>
        <View
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 25,
          }}>
          <View
            style={{
              backgroundColor: Colors.primary,
              height: 60,
              width: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              marginTop: 20,
              marginBottom: 20,
            }}>
            <ProfileImage
              name={data?.name ? data?.name : ''}
              imageUri={
                !data?.profilePicture
                  ? data?.profileImage?.path
                  : getUrl(data?.profilePicture)
              }
              size={138}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              marginBottom: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {data?.name && (
              <Text
                style={{
                  color: Colors.black,
                  fontWeight: '700',
                  fontSize: 18,
                  marginTop: 15,
                }}>
                {!data?.name ? t('str_user_name') : data?.name}
              </Text>
            )}
            {data?.email && (
              <Text
                style={{
                  width: '100%',
                  color: Colors.grey,
                  fontSize: 14,
                  marginBottom: 4,
                  marginTop: 6,
                }}>
                {!data?.email ? t('str_user_email') : data?.email}
              </Text>
            )}
          </View>
          {data?.address && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={Icons.location}
                style={{
                  height: 12,
                  width: 12,
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: 14,
                }}>
                {!data?.address ? '' : data?.address}
              </Text>
            </View>
          )}
          {data?.is_subscribed == 1 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <Text
                style={{
                  color: Colors.grey,
                  fontSize: 14,
                }}>
                Subscription: {data?.no_of_features} Products for{' '}
                {data?.no_of_days} Days
              </Text>
            </View>
          )}
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              NavService.navigate('EditeProfile');
            }}
            style={{
              alignItems: 'center',
              marginTop: 20,
              backgroundColor: Colors.white,
              borderRadius: 30,
              height: 42,
              width: 42,
              justifyContent: 'center',
              ...Shadows.shadow3,
            }}>
            <Image
              source={Icons.write}
              style={{
                height: 25,
                width: 25,
                tintColor: Colors.primary,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.black,
              fontSize: 13,
              marginVertical: 4,
            }}>
            {t('edit')}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
          marginHorizontal: 12,
        }}>
        <Text
          style={{
            color: Colors.black,
            fontSize: 16,
            fontWeight: '600',
          }}>
          {t('str_Language')}
        </Text>
        <Text
          style={{
            color: Colors.black,
            fontSize: 16,
            fontWeight: '600',
          }}>
          {data?.language}
        </Text>
      </View>
    </AppBackground>
  );
};

export default Account;

const styles = StyleSheet.create({});
