import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icons from '../assets/Icons';
import Images from '../assets/Images';
import {Colors, NavService, Shadows} from '../config';
import {t} from 'i18next';

export function AppBackground({
  product,
  editeIcon,
  route,
  children,
  title,
  back = false,
  nav = '',
  rightIcon = Images.avatar,
  marginHorizontal,
  rightIconNav = () => {},
  notification = true,
  edit = false,
}) {
  const onPress = () => {
    nav.length
      ? NavService.navigate(nav)
      : back
      ? NavService.goBack()
      : NavService.openDrawer();
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          marginTop: getStatusBarHeight() * 1.4,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={product ? () => NavService.openDrawer() : onPress}
          style={{
            position: 'absolute',
            alignItems: 'center',
            // backgroundColor: Colors.white,
            borderRadius: 18,
            left: 20,
            width: 36,
            height: 36,
            justifyContent: 'center',
            // ...Shadows.shadow3,
          }}>
          {back && (
            <View
              style={{
                position: 'absolute',
                top: 2,
                left: 0,
                alignItems: 'flex-start',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={product ? () => NavService.openDrawer() : onPress}
                style={{
                  // position: 'absolute',
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                  borderRadius: 18,
                  // left: 0,
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  ...Shadows.shadow3,
                }}>
                <Image
                  source={Icons.back}
                  style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                    tintColor: Colors.primary,
                    // borderRadius: 12,
                  }}
                />
              </TouchableOpacity>
              <Text style={{color: 'black', fontSize: 13, marginVertical: 4}}>
                {t('back')}
              </Text>
            </View>
          )}
          {product && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                alignItems: 'flex-start',
                width: 47,
                // backgroundcolor: 'red',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={product ? () => NavService.openDrawer() : onPress}
                style={{
                  // position: 'absolute',
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                  borderRadius: 18,
                  // left: 0,
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  ...Shadows.shadow3,
                }}>
                <Image
                  source={Icons.product}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    tintColor: Colors.primary,
                    // borderRadius: 12,
                  }}
                />
              </TouchableOpacity>
              <Text style={{color: 'black', fontSize: 13, marginVertical: 4}}>
                {t('Menu')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View>
          <Text
            style={{
              color: Colors.black,
              fontWeight: '700',
              fontSize: 22,
              top: -10,
            }}>
            {title}
          </Text>
        </View>
        {notification && (
          <View
            style={{
              position: 'absolute',
              top: -10,
              right: 20,
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                NavService.navigate('Notification');
              }}
              style={{
                // position: 'absolute',
                // right: 20,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 18,
                backgroundColor: Colors.primary,
              }}>
              <Image
                source={Icons.bellring}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  resizeMode: 'cover',
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: !marginHorizontal ? 20 : 0,
          marginBottom: 10,
          overflow: 'visible',
        }}>
        {children}
      </View>
    </View>
  );
}

export default AppBackground;
