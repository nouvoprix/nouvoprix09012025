import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import Colors from '../../config/colors';
import CustomBackground from '../../components/CustomBackground';
import SocialSignin from '../../components/SocialSignin';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

class App extends Component {
  state = {
    agreementModal: false,
    terms: false,
    policy: false,
    navigator: '',
  };

  render() {
    const { agreementModal, terms, policy, navigator } = this.state;
    const { t, insets } = this.props;
    const methods = [
      {
        name: t('str_Email'),
        icon: Icons.email,
        onPress: () => navigation.navigate('Login'),
        color: Colors.primary,
      },
      // {
      //   name: t('str_Facebook'),
      //   icon: Icons.facebook,
      //   color: Colors.facebook,
      //   // onPress: SocialSignin.Facebook,
      // },
      {
        name: t('str_Google'),
        icon: Icons.google,
        color: Colors.google,
        onPress: () => SocialSignin.Google(),
      },
      {
        name: 'Phone',
        icon: Icons.phone,
        color: Colors.primary,
        onPress: () => navigation.navigate('PhoneLogin'),
      },
      {
        name: t('str_Apple'),
        icon: Icons.apple,
        color: 'black',
        onPress: () => SocialSignin.Apple(),
      },
    ];
    const { navigation } = this.props;
    return (
      <CustomBackground>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            width: '100%',
          }}>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              width: '100%',
              marginBottom: 15 + insets.bottom,

            }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: Colors.black,
                marginVertical: '8%',
              }}>
              {t('str_Pre_Login')}
            </Text>
            {methods.map((method, i) => {
              const { color, name, icon, onPress } = method;
              if (Platform.OS == 'android' && name == t('str_Apple'))
                return null;
              return (
                <TouchableOpacity
                  onPress={onPress}
                  key={i}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: color,
                    borderRadius: 30,
                    width: width - 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 7,
                    height: 60,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icon}
                    style={{
                      marginRight: 20,
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                      tintColor: Colors.white,
                      position: 'absolute',
                      left: width / 8,
                    }}
                  />

                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: Colors.white,
                      position: 'absolute',
                      left: width / 4,
                    }}>
                    {t('str_Sign_In_With')} {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </CustomBackground>
    );
  }
}

// export default App;
export default withTranslation()(withSafeAreaInsets(App));
