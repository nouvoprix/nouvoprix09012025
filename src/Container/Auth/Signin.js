import {Colors, NavService} from '../../config';
import React, {Component, useState} from 'react';
import {Dimensions, Platform, Text, TouchableOpacity, View} from 'react-native';

import CustomBackground from '../../components/CustomBackground';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import CustomTextInputView from '../../components/CustomTextInputView';
import Icons from '../../assets/Icons';
import * as EmailValidator from 'email-validator';
import Toast from 'react-native-toast-message';
import {ToastError, ToastSuccess} from '../../config/Helpers/Toast';
import {useDispatch} from 'react-redux';
import {userSignup} from '../../redux/APIs';
import {t} from 'i18next';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, SetconfirmPassword] = useState('');

  OnSubmit = async () => {
    await userSignup(email.toLowerCase(), password, confirmPassword);
  };
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
            {t('str_Signup')}
          </Text>
          <CustomTextInputView
            containerStyle={{
              marginBottom: 20,
              width: '85%',
              color: Colors.black,
            }}
            placeholder={t('str_Email')}
            label={t('str_Email')}
            value={email}
            Onchange={value => setEmail(value)}
          />
          <CustomTextInputView
            containerStyle={{
              marginBottom: 20,
              width: '85%',
              color: Colors.black,
            }}
            placeholder={t('str_Password')}
            label={t('str_Password')}
            value={password}
            Onchange={value => setPassword(value)}
          />
          <CustomTextInputView
            containerStyle={{
              marginBottom: 20,
              width: '85%',
              color: Colors.black,
            }}
            placeholder={t('str_Confirm_Password')}
            label={t('str_Confirm_Password')}
            value={confirmPassword}
            Onchange={value => SetconfirmPassword(value)}
          />
          <CustomButton
            title={t('str_Signup')}
            onPress={() => OnSubmit()}
            buttonStyle={{
              marginTop: 20,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: Colors.grey,
            }}>
            {t('str_Already_have_an_account')}{' '}
          </Text>
          <TouchableOpacity onPress={() => NavService.navigate('Login')}>
            <Text
              style={{
                color: Colors.primary,
                textDecorationLine: 'underline',
                textDecorationColor: Colors.primary,
                // marginTop: 5,
                fontSize: 16,
              }}>
              {t('str_Login_Now')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomBackground>
  );
};

export default Signin;
