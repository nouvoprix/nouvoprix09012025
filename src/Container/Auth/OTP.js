import React, {Component, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  BackHandler,
} from 'react-native';
import {Colors, NavService, Shadows} from '../../config';
import CustomBackground from '../../components/CustomBackground';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import Icons from '../../assets/Icons';
import OTPTextInput from '@twotalltotems/react-native-otp-input';
import AppBackground from '../../components/AppBackground';
import Toast from 'react-native-toast-message';
import {ToastError, ToastSuccess} from '../../config/Helpers/Toast';
import {userVerifyCode, userResendVerifyCode} from '../../redux/APIs';
import {connect} from 'react-redux';
import {t} from 'i18next';
import {compose} from 'redux';
import {withTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

class OTP extends Component {
  state = {
    code: '',
    timerCode: 30,
    resend: false,
    otpInput: null,
    keyboardStatus: undefined,
    OTP: '123456',
  };
  constructor(props) {
    super(props);
    this.timer = null;
  }
  SubmitCode = async () => {
    const {code} = this.state;
    const {screen, _id} = this.props.route.params;
    const {User} = this.props;
    if (code?.length > 0) {
      await userVerifyCode(code, _id, screen);
    } else {
      Toast.show(ToastError(t('str_Invalid_OTP_code')));
    }
  };

  componentDidMount() {
    this.startInterval();
    // BackHandler?.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick,
    // );
    // return () => {
    //   BackHandler?.removeEventListener(
    //     'hardwareBackPress',
    //     this.handleBackButtonClick,
    //   );
    // };
  }
  startInterval = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const {timerCode} = this.state;
      if (timerCode < 1) {
        clearInterval(this.timer);
        this.setState({resend: true});
      } else this.setState({timerCode: timerCode - 1});
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleBackButtonClick() {
    NavService.navigate('Login');
    return true;
  }

  render() {
    const {_id} = this.props.route.params;
    const {timerCode, resend, code} = this.state;
    const otpContainerWidth = width - 60;
    const otpsingle = (width - 90) / 6;
    const {t} = this.props;
    return (
      <CustomBackground>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flexGrow: 1}}
          contentContainerStyle={{
            alignItems: 'center',
            flexGrow: 1,
          }}>
          <View
            style={{
              marginTop: '10%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{color: Colors.black, fontSize: 18, fontWeight: '700'}}>
              {t('str_Verification')}
            </Text>
            <Text
              numberOfLines={3}
              style={{
                marginHorizontal: '15%',
                textAlign: 'center',
                marginTop: 16,
                color: Colors.grey,
                fontWeight: '400',
              }}>
              {t('str_We_have_sent_you_a_sixdigits')}
            </Text>
          </View>
          <OTPTextInput
            style={{width: otpContainerWidth, height: otpsingle}}
            pinCount={6}
            code={code}
            onCodeChanged={c => {
              this.setState({code: c});
            }}
            onCodeFilled={code => this.setState({code: code})}
            autoFocusOnLoad
            codeInputFieldStyle={{
              marginTop: 25,
              width: otpsingle,
              height: otpsingle,
              backgroundColor: Colors.white,
              borderRadius: otpsingle,
              color: Colors.grey,
              borderWidth: 0,
              ...Shadows.shadow5,
              fontSize: 18,
              fontWeight: '500',
              color: Colors.black,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginVertical: '10%',
              }}>
              <Image
                style={{
                  height: 50,
                  width: 50,
                }}
                source={Icons.clock}
                resizeMode="contain"
              />
              <Text
                style={{
                  marginTop: 10,
                  color: Colors.black,
                  alignSelf: 'center',
                }}>
                {`00:${timerCode < 10 ? '0' + timerCode : timerCode}`} Sec
              </Text>
            </View>
          </View>
          <CustomButton
            title={t('str_continue')}
            onPress={() => this.SubmitCode(t)}
            textStyle={{textTransform: 'capitalize'}}
          />
          <Text
            onPress={
              resend
                ? async () => {
                    await userResendVerifyCode(_id);
                    this.setState({timerCode: 30, resend: false, code: ''});
                    this.startInterval();
                  }
                : null
            }
            style={{
              color: Colors.black,
              fontWeight: resend ? '600' : '300',
              alignSelf: 'center',
              fontSize: 14,
              top: Dimensions.get('window').height * 0.08,
            }}>
            {t("str_Didn't_Receive_Code?")}{' '}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: Colors.black,
              }}>
              {t('str_Resend')}
            </Text>
          </Text>
        </ScrollView>
      </CustomBackground>
    );
  }
}
const mapStateToProps = state => {
  return {
    User: state.user.userToken,
  };
};

// export default connect(mapStateToProps)(OTP);
export default compose(withTranslation(), connect(mapStateToProps, null))(OTP);
