import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppBackground from '../../components/AppBackground';
import FastInput from '../../components/FastInput';
import CustomButton from '../../components/CustomButton';
import Toast from 'react-native-toast-message';
import {ToastError, ToastSuccess} from '../../config/Helpers/Toast';
import {NavService} from '../../config';
import {userChangePassword} from '../../redux/APIs';
import {t} from 'i18next';
const ChangePassword = ({route}) => {
  const {screen} = route.params;
  const [existingPasswrod, setExistingPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  OnChange = async t => {
    if (existingPasswrod) {
      if (newPassword) {
        if (newPassword.length >= 8) {
          if (confirmPassword.length >= 8) {
            if (newPassword.length === confirmPassword.length) {
              // if (screen == 'forgot') {
              await userChangePassword(existingPasswrod, newPassword);
              // } else {
              // NavService.goBack();
              // }
              // Toast.show(ToastSuccess('Password changed successfully'));
            } else {
              Toast.show(
                ToastError(
                  t('str_New_Password_and_Confirm_Password_must_be_same'),
                ),
              );
            }
          } else {
            Toast.show(
              ToastError(t("str_Confirm_New_Password_field_can't_be_empty")),
            );
          }
        } else {
          Toast.show(ToastError(t('str_Password_Signup_long_Validation')));
        }
      } else {
        Toast.show(ToastError(t('str_New_Password_field_cant_be_empty')));
      }
    } else {
      Toast.show(ToastError(t('str_Existing_Password_field_cant_be_empty')));
    }
  };

  return (
    <AppBackground back notification={false} title="Change Password">
      <FastInput
        label={t('str_Existing_Password')}
        placeholder={''}
        password
        value={existingPasswrod}
        Onchange={value => setExistingPassword(value)}
      />
      <FastInput
        placeholder={t('str_New_Password')}
        password
        value={newPassword}
        Onchange={value => setNewPassword(value)}
      />
      <FastInput
        placeholder={t('str_Confirm_New_Password')}
        password
        value={confirmPassword}
        Onchange={value => setConfirmPassword(value)}
      />
      <CustomButton
        onPress={() => this.OnChange(t)}
        title={t('str_Change')}
        buttonStyle={{
          top: Dimensions.get('window').height * 0.46,
          alignSelf: 'center',
        }}
      />
    </AppBackground>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
