import React, {Component, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  Keyboard,
  Dimensions,
  BackHandler,
} from 'react-native';
import {Colors, NavService, Shadows} from '../../config';
import CustomBackground from '../../components/CustomBackground';
import CustomButton from '../../components/CustomButton';
import OTPTextInput from '@twotalltotems/react-native-otp-input';
import Toast from 'react-native-toast-message';
import {ToastError, ToastSuccess} from '../../config/Helpers/Toast';
import {userSocialSignIn} from '../../redux/APIs';
import {loaderStart, loaderStop} from '../../redux/actions';
import {connect} from 'react-redux';
import {t} from 'i18next';
import {compose} from 'redux';
import {withTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

class PhoneOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      timerCode: 30,
      resend: false,
      otpInput: null,
      keyboardStatus: undefined,
      OTP: '123456',
    };
    this.timer = null;
  }
  SubmitCode = async () => {
    const {code} = this.state;
    const {data, phoneNumber} = this.props.route.params;
    const {User} = this.props;
    if (code?.length > 0) {
      try {
        Keyboard.dismiss();
        loaderStart();
        const result = await data?.confirm(code);
        await userSocialSignIn(result?.user?.uid, 'phone');
      } catch (error) {
        Toast.show({
          text1: 'OTP is invalid',
          type: 'error',
          visibilityTime: 3000,
        });
      } finally {
        loaderStop();
      }
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
          <CustomButton
            title={t('str_continue')}
            onPress={() => this.SubmitCode(t)}
            buttonStyle={{marginTop: 50}}
            textStyle={{textTransform: 'capitalize'}}
          />
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
export default compose(
  withTranslation(),
  connect(mapStateToProps, null),
)(PhoneOTP);
