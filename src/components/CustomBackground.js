import React from 'react';
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Images from '../assets/Images';
import {Colors, NavService, Shadows} from '../config';
import Logo from './Logo';
import {t} from 'i18next';

export default ({
  children,
  Inapp = true,
  product,
  editeIcon,
  route,
  title,
  back = false,
  nav = '',
  rightIcon = Images.avatar,
  marginHorizontal,
  rightIconNav = () => {},
  notification = true,
  edit = false,
}) => {
  const onPress = () => {
    nav.length
      ? NavService.navigate(nav)
      : back
      ? NavService.goBack()
      : NavService.openDrawer();
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: '10%',
        backgroundColor: Inapp ? Colors.white : Colors.background,
      }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{
          alignItems: 'center',
          flexGrow: 1,
        }}>
        {Inapp ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.white,
              borderRadius: 120,
              marginTop: '10%',
              ...Shadows.shadow5,
              height: 240,
              width: 240,
            }}>
            <Logo size={170} />
          </View>
        ) : (
          <View
            style={{
              marginTop: getStatusBarHeight() * 0.5,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 30,
            }}>
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={product ? () => NavService.openDrawer() : onPress}
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  // backgroundColor: Colors.white,
                  borderRadius: 18,
                  top: 5,
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
                      left: 0,
                      alignItems: 'flex-start',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={
                        product ? () => NavService.openDrawer() : onPress
                      }
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
                    <Text style={{color: 'black'}}>{t('back')}</Text>
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
                      onPress={
                        product ? () => NavService.openDrawer() : onPress
                      }
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
                    <Text
                      style={{color: 'black', fontSize: 13, marginVertical: 4}}>
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
                  }}>
                  {title}
                </Text>
              </View>
              {notification && (
                <View
                  style={{
                    position: 'absolute',
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
                  {/* <Text style={{color: 'black'}}>notification</Text> */}
                </View>
              )}
            </>
          </View>
        )}
        <View style={{flex: 2}}>{children}</View>
      </ScrollView>
    </View>
  );
};
