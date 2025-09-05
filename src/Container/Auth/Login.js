import {Colors, NavService} from '../../config';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import * as EmailValidator from 'email-validator';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';
import CustomBackground from '../../components/CustomBackground';
import CustomButton from '../../components/CustomButton';
import CustomTextInputView from '../../components/CustomTextInputView';
import {userLogin, userRecoverAccount} from '../../redux/APIs';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      temporaryUser: null,
      deletedUserPopUp: false,
    };
  }

  onSubmit = async t => {
    const {email, password} = this.state;
    if (!email && !password) {
      Toast.show({
        text1: t('str_Please_enter_all_fields'),
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!email) {
      Toast.show({
        text1: t('str_Please_enter_email_address'),
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!EmailValidator.validate(email)) {
      Toast.show({
        text1: t('str_Please_enter_a_valid_email_address'),
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!password) {
      Toast.show({
        text1: t('str_Please_enter_password'),
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (!password > 7) {
      Toast.show({
        text1: t('str_The_password_must_be_at_least_8_characters'),
        type: 'error',
        visibilityTime: 3000,
      });
    }
    // else if (!schema.validate(password)) {
    //   Toast.show({
    //     text1: 'Password not valid (Use atleast one UpperCase Letter, one number and one special character',
    //     type: 'error',
    //     visibilityTime: 3000,
    //   });
    // }
    else {
      // NavService.navigate('UserStack');
      await userLogin(
        email.toLowerCase(),
        password,
        this.callBackForRecievingInfo,
      );
    }
  };
  callBackForRecievingInfo = user => {
    this.setState({temporaryUser: user});
    setTimeout(() => {
      this.togglePopUp();
    }, 500);
  };
  togglePopUp = () => {
    const {deletedUserPopUp} = this.state;
    this.setState({deletedUserPopUp: !deletedUserPopUp});
  };
  recoverAccount = async () => {
    const {temporaryUser} = this.state;
    this.togglePopUp();
    await userRecoverAccount(temporaryUser?._id);
  };
  render() {
    const {t} = this.props;
    const {email, password, deletedUserPopUp} = this.state;
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
            <CustomTextInputView
              placeholder={t('str_Email')}
              label={t('str_Email')}
              value={email}
              Onchange={value => this.setState({email: value})}
              containerStyle={{
                marginBottom: 20,
                width: '85%',
                color: Colors.grey,
              }}
            />
            <CustomTextInputView
              placeholder={t('str_Password')}
              Onchange={value => this.setState({password: value})}
              label={t('str_Password')}
              value={password}
              containerStyle={{
                // marginBottom: 20,
                width: '85%',
                color: Colors.grey,
              }}
            />
            <TouchableOpacity
              onPress={() => NavService.navigate('ForgotPassword')}
              activeOpacity={0.8}
              style={{
                marginLeft: 200,
                marginTop: -20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.primary,
                  marginVertical: 20,
                  textDecorationLine: 'underline',
                }}>
                {t('str_Forgot_Password')}
              </Text>
            </TouchableOpacity>
            <CustomButton
              title={t('str_Sign_In')}
              onPress={() => this.onSubmit(t)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: '20%',
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
              {t("str_Don't_have_a_account?")}{' '}
            </Text>
            <TouchableOpacity onPress={() => NavService.navigate('Signin')}>
              <Text
                style={{
                  color: Colors.primary,
                  textDecorationLine: 'underline',
                  textDecorationColor: Colors.primary,
                  fontSize: 16,
                  // marginTop: 5,
                }}>
                {t('str_Signup')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={deletedUserPopUp}
          backdropOpacity={0.8}
          onBackButtonPress={this.togglePopUp}
          onBackdropPress={this.togglePopUp}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              // paddingHorizontal: 20,
            }}>
            <View
              style={{
                width: '100%',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: Colors.border,
                backgroundColor: Colors.white,
              }}>
              <View
                style={{
                  // backgroundColor: Colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  height: 65,
                  width: '101%',
                  marginLeft: -1,
                  marginTop: -1,
                }}>
                <Text
                  style={{
                    color: Colors.primary,
                    fontSize: 20,
                    fontWeight: '700',
                  }}>
                  ATTENTION
                </Text>
              </View>
              <View style={{padding: 20}}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {t('str_You_have_previously_deleted_your_account')} {'\n'}
                  {t('str_Do_you_want_to_recover_it')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 50,
                    width: '100%',
                    marginTop: 25,
                  }}>
                  <TouchableOpacity
                    onPress={this.togglePopUp}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      backgroundColor: Colors.offWhite,
                      borderTopLeftRadius: 25,
                      borderBottomLeftRadius: 25,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.white,
                        textTransform: 'uppercase',
                      }}>
                      {t('Cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.recoverAccount}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      backgroundColor: Colors.primary,
                      borderTopRightRadius: 25,
                      borderBottomRightRadius: 25,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.white,
                        textTransform: 'uppercase',
                      }}>
                      {t('str_Recover')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </CustomBackground>
    );
  }
}

export default withTranslation()(Login);
