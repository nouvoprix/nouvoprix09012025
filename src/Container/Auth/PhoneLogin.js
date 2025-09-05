import React, {Component, createRef} from 'react';
import {Text, Keyboard, View, StyleSheet, Dimensions} from 'react-native';
import Toast from 'react-native-toast-message';
// import PhoneInput from 'react-native-phone-number-input';
import PhoneInput from 'react-native-international-phone-number';
import {parsePhoneNumber} from 'awesome-phonenumber';
import {withTranslation} from 'react-i18next';
import CustomBackground from '../../components/CustomBackground';
import CustomButton from '../../components/CustomButton';
import SocialSignin from '../../components/SocialSignin';
import {Colors, NavService, Shadows} from '../../config';

const {width} = Dimensions.get('screen');
class PhoneLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      formattedPhoneNumber: '',
      selectedCountry: null,
    };
    this.phoneInput = createRef(null);
  }

  onSubmit = async t => {
    const {phoneNumber, formattedPhoneNumber, selectedCountry} = this.state;
    if (!phoneNumber) {
      Toast.show({
        text1: t('str_Please_enter_phone_number'),
        type: 'error',
        visibilityTime: 3000,
      });
    } else {
      Keyboard.dismiss();
      const userEnteredPhoneNumber =
        `${selectedCountry?.callingCode}${phoneNumber}`?.split(' ')?.join('');
      const pn = parsePhoneNumber(userEnteredPhoneNumber);
      if (pn?.valid) {
        await SocialSignin.signInWithPhoneNumber(
          userEnteredPhoneNumber,
          userEnteredPhoneNumber,
          t,
        );
      } else {
        return Toast.show({
          text1: t('str_The_phone_number_is_not_correct'),
          type: 'error',
          visibilityTime: 3000,
        });
      }
    }
  };
  handleSelectedCountry = country => {
    console.log('country', country);
    this.setState({
      selectedCountry: country,
    });
  };

  handleInputValue = phoneNumber => {
    this.setState({
      phoneNumber: phoneNumber,
    });
  };
  render() {
    const {t} = this.props;
    const {phoneNumber, formattedPhoneNumber, selectedCountry} = this.state;
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
              marginTop: 20,
              alignItems: 'center',
              flex: 1,
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: Colors.black,
                marginVertical: '8%',
              }}>
              {t('str_Sign_In')}
            </Text>
            {/* <CustomPhoneInput
              leftIcon={Icons.phone}
              placeholder={'Phone Number'}
              placeholderTextColor={Colors.border}
              containerStyle={{
                borderColor: Colors.offWhite,
                marginBottom: 15,
              }}
              borderStyles={{borderLeftWidth: 1}}
              value={formattedPhoneNumber}
              formattedPhoneNumber={formattedPhoneNumber}
              phoneNumber={phoneNumber}
              onChangePhoneInput={(phoneNumberFormat, phoneNumber) =>
                this.setState({
                  formattedPhoneNumber: phoneNumberFormat,
                  phoneNumber: phoneNumber,
                })
              }
            /> */}
            {/* <PhoneInput
              ref={this.phoneInput}
              defaultValue={phoneNumber}
              defaultCode="US"
              layout="second"
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.textContainerPhone}
              textInputStyle={{padding: 0}}
              onChangeText={text => {
                this.setState({phoneNumber: text});
              }}
              onChangeFormattedText={text => {
                this.setState({formattedPhoneNumber: text});
              }}
              withDarkTheme
              placeholder={'Phone Number'}
              textInputProps={{
                placeholderTextColor: Colors.grey,
                maxLength: 14,
              }}
            /> */}
            <PhoneInput
              defaultCountry="US"
              value={phoneNumber}
              selectedCountry={selectedCountry}
              onChangePhoneNumber={this.handleInputValue}
              onChangeSelectedCountry={this.handleSelectedCountry}
              getFullPhoneNumber={phoneNum =>
                console.log('phone number', phoneNum)
              }
              phoneInputStyles={{
                container: {
                  backgroundColor: Colors.white,
                  borderColor: '#F3F3F3',
                  width: width * 0.9,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  ...Shadows.shadow5,
                },
                flagContainer: {
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                  backgroundColor: '#F3F3F3',
                  // borderRadius: 30,
                  justifyContent: 'center',
                },
                flag: {},
                caret: {
                  color: '#808080',
                  fontSize: 16,
                },
                divider: {
                  backgroundColor: '#808080',
                },
                callingCode: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#808080',
                },
                input: {
                  color: '#808080',
                  fontSize: 14,
                  borderRadius: 30,
                },
              }}
            />
            <CustomButton
              title={t('str_Sign_In')}
              onPress={() => this.onSubmit(t)}
              buttonStyle={{marginTop: 20}}
            />
          </View>
        </View>
      </CustomBackground>
    );
  }
}

export default withTranslation()(PhoneLogin);

const styles = StyleSheet.create({
  phoneContainer: {
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 50,
    paddingHorizontal: 7,
    paddingVertical: 0,
    height: 55,
    borderWidth: 0,
    borderColor: Colors.offWhite,
    marginVertical: 0,
    borderColor: Colors.white,
    borderWidth: 1,
    ...Shadows.shadow5,
  },
  textContainerPhone: {
    padding: 0,
    backgroundColor: 'transparent',
  },
});
