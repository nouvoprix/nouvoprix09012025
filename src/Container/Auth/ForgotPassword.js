import {Colors, NavService} from '../../config';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import CustomBackground from '../../components/CustomBackground';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import CustomTextInputView from '../../components/CustomTextInputView';
import Icons from '../../assets/Icons';
import * as EmailValidator from 'email-validator';
// import {login} from '../../../redux/APIs';
import Toast from 'react-native-toast-message';

import {ToastError, ToastSuccess} from '../../config/Helpers/Toast';
import {userForgetPassword} from '../../redux/APIs';
import { withTranslation } from 'react-i18next';

class ForgotPassword extends Component {
  state = {
    email: '',
  };

  onSignin = async t => {
    const {email} = this.state;
    if (email) {
      if (EmailValidator.validate(email)) {
        await userForgetPassword(email);
        // NavService.navigate('OTP', {screen: 'forgot'});
        // Toast.show(
        //   ToastSuccess(
        //     'OTP verification code has been sent to your email address',
        //   ),
        // );
      } else {
        Toast.show(ToastError(t('str_Please_enter_a_valid_email_address')));
      }
    } else {
      Toast.show(ToastError(t('str_Email_field_can')));
    }
  };

  render() {
    const {email} = this.state;
    const {t} = this.props;
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
              {t('str_Forgot_Password')}
            </Text>
            <CustomTextInputView
              containerStyle={{
                marginBottom: 20,
                width: '85%',
                color: Colors.grey,
              }}
              placeholder={t('str_Email')}
              label={t('str_Email')}
              value={email}
              Onchange={value => this.setState({email: value})}
            />

            <View
              style={{
                marginTop: '30%',
              }}>
              <CustomButton
                title={t('str_Reset')}
                onPress={() => this.onSignin(t)}
              />
            </View>
          </View>
        </View>
      </CustomBackground>
    );
  }
}

// export default ForgotPassword;
export default withTranslation()(ForgotPassword);
