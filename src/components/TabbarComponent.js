import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors, Icon, Shadows} from '../config/index';
import Icons from '../assets/Icons';
import Images from '../assets/Images';
import {getProducts} from '../redux/APIs';
import {withTranslation} from 'react-i18next';

class TabbarComp extends React.Component {
  render() {
    const {t} = this.props;
    const {state, navigation, count} = this.props;
    const {insets} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.white,
          height: 65,
          ...Shadows.shadow3,
          width: 380,
          alignSelf: 'center',
          marginBottom: 8 + insets.bottom,
          borderRadius: 60,
          // height: 65 + insets.bottom,
        }}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            navigation.navigate(route.name);
          };
          let imageSrc = Icons.search;
          let tabName = t('Home');
          if (route.name === 'home') {
            imageSrc = Icons.home;
          }
          if (route.name === 'user') {
            imageSrc = Icons.user;
          }
          if (route.name === 'search') {
            imageSrc = Icons.search;
          }
          if (route.name === 'MyMessages') {
            imageSrc = Icons.msg;
          }
          if (route.name === 'MyTrades') {
            imageSrc = Icons.stats;
          }

          if (route.name === 'MyTrades') {
            tabName = t('My_Trades');
          }
          if (route.name === 'search') {
            tabName = t('search');
          }
          if (route.name === 'user') {
            tabName = t('str_Account');
          }
          if (route.name === 'MyMessages') {
            tabName = t('inbox');
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityRole="button"
              activeOpacity={0.8}
              onPress={onPress}
              style={styles.tabs}>
              <Image
                source={imageSrc}
                style={{
                  height: 22,
                  width: 22,
                  tintColor: isFocused ? Colors.primary : Colors.grey,
                  // tintColor: isFocused ? Colors.primary : Colors.white,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: isFocused ? Colors.primary : Colors.black,
                  fontSize: 11,
                  marginVertical: 4,
                }}>
                {tabName}
              </Text>
              {route.name === 'MyMessages' && parseInt(count) > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -1,
                    width: 19,
                    height: 19,
                    borderRadius: 19 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.primary,
                  }}>
                  <Text
                    style={{
                      fontSize: 9,
                      color: 'white',
                      fontWeight: '900',
                    }}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
export default withTranslation()(TabbarComp);

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 5,
    height: 65,
  },
});
