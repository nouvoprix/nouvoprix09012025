import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AppBackground from '../../components/AppBackground';
import FastInput from '../../components/FastInput';
import CustomButton from '../../components/CustomButton';
import Toast from 'react-native-toast-message';
import {ToastError, ToastSuccess} from '../../config/Helpers/Toast';
import {NavService} from '../../config';
import { userResetPassword } from '../../redux/APIs';
import { useSelector } from 'react-redux';
import {useTranslation} from 'react-i18next';

const ResetPassword = ({route}) => {
  const {screen} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const State = useSelector(state => state.user.userData);
  const uuid = State?.data?.user_id;
  const {t} = useTranslation();

  OnChange = async () => {
    if (newPassword) {
      if (newPassword.length >= 8) {
        if (confirmPassword.length >= 8) {
          if (newPassword.length === confirmPassword.length) {
            if (screen == 'forgot') {
              await userResetPassword({uuid, newPassword});
            } else {
              NavService.navigate('Login');
            }
            // Toast.show(ToastSuccess('Password changed successfully'));
          } else {
            Toast.show(
              ToastError(
                `${t('New_Password_and_Confirm_Password_must_be_same')}`,
              ),
            );
          }
        } else {
          Toast.show(
            ToastError(`${t("Confirm_New_Password_field_can't_be_empty")}`),
          );
        }
      } else {
        Toast.show(
          ToastError(
            `${t(
              'Password_must_be_of_8_characters_long_and_contain_atleast_1_uppercase,_1_lowercase,_1_digit_and_1_special_character.',
            )}`,
          ),
        );
      }
    } else {
      Toast.show(ToastError(`${t("New_Password_field_can't_be_empty.")}`));
    }

    function handleBackButtonClick() {
      NavService.navigate('Login');
      return true;
    }
    useEffect(() => {
      BackHandler?.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        BackHandler?.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      };
    }, []);
  };
  return (
    <AppBackground notification={false} title={t('Reset_Password')}>
      <FastInput
        placeholder={t('New_Password')}
        password
        value={newPassword}
        Onchange={value => setNewPassword(value)}
      />
      <FastInput
        placeholder={t('Confirm_New_Password')}
        password
        value={confirmPassword}
        Onchange={value => setConfirmPassword(value)}
      />
      <CustomButton
        onPress={OnChange}
        title={t('Reset')}
        buttonStyle={{
          top: Dimensions.get('window').height * 0.46,
          alignSelf: 'center',
        }}
      />
    </AppBackground>
  );
};

export default ResetPassword;
