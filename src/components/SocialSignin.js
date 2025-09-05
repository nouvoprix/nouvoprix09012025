// npm i @react-native-google-signin/google-signin react-native-fbsdk-next @invertase/react-native-apple-authentication
// npm i @react-native-firebase/app @react-native-firebase/auth

import Toast from 'react-native-toast-message';
import Auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {AccessToken, LoginManager, Settings} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {userSocialSignIn, getDeviceToken} from '../redux/APIs';
import {loaderStart, loaderStop} from '../redux/actions';
import {Colors, NavService} from '../config';

GoogleSignin.configure({
  webClientId:
    '597604842464-gaksl5u9u3fc2qord5lveiuo3eon6nk8.apps.googleusercontent.com',
});

// Settings.setAppID('1101411500700897');

const Google = async () => {
  try {
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = Auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    const userAuth = await Auth().signInWithCredential(googleCredential);
    // const access_token = await (await userAuth.user.getIdToken()).toString();
    const {uid, email} = userAuth?.user;
    await userSocialSignIn(uid, 'google', email);
  } catch (error) {
    Toast.show({
      text1: 'Unable sign in with Google',
      type: 'error',
      visibilityTime: 3000,
    });
  }
};

const Facebook = () => {
  // LoginManager.logInWithPermissions(['public_profile'])
  //   .then(async login => {
  //     if (login.isCancelled) {
  //     } else {
  //       try {
  //         const fbAuth = await AccessToken.getCurrentAccessToken();
  //         const fbCredential = Auth.FacebookAuthProvider.credential(
  //           fbAuth.accessToken,
  //         );
  //         const userAuth = await Auth().signInWithCredential(fbCredential);
  //         await socialSignin(userAuth, 'facebook');
  //       } catch (error) {
  //         Toast.show({
  //           text1: 'Unable to sign in with Facebook',
  //           type: 'error',
  //           visibilityTime: 3000,
  //         });
  //       }
  //     }
  //   })
  //   .catch(error => console.log(error));
};

const Apple = async () => {
  // performs login request
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = Auth?.AppleAuthProvider?.credential(
      identityToken,
      nonce,
    );
    const userAuth = await Auth()?.signInWithCredential(appleCredential);
    const {uid} = userAuth?.user;
    const user_credential = userAuth?.user?._user?.providerData;
    await userSocialSignIn(uid, 'apple', user_credential);
  } catch (error) {
    console.log(error);
    Toast.show({
      text1: 'Unable to sign in with Apple',
      type: 'error',
      visibilityTime: 3000,
    });
  }
};
const signInWithPhoneNumber = async (phoneNumber, formattedPhoneNumber, t) => {
  try {
    loaderStart();
    const confirmation = await Auth().signInWithPhoneNumber(phoneNumber);
    NavService.navigate('PhoneOTP', {
      data: confirmation,
      screenName: 'phone',
      phoneNumber: formattedPhoneNumber,
    });
  } catch (error) {
    console.log(error, 'error');
    Toast.show({
      text1: t('str_an_unknown_error_has_occured'),
      type: 'error',
      visibilityTime: 3000,
    });
  } finally {
    loaderStop();
  }
};
export default {Google, Apple, Facebook, signInWithPhoneNumber};
