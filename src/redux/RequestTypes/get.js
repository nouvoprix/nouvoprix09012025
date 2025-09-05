import axios from 'axios';
import Toast from 'react-native-toast-message';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Common} from '../../config';
import {store} from '../index';
import {loaderStart, loaderStop} from '../actions';
import {userLogout} from '../APIs';

axios.defaults.baseURL = Common.baseURL;
axios.defaults.timeout = Common.defaultTimeout;

function storeUpdate() {
  let user_authentication = store.getState()?.user?.userToken;
  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${user_authentication}`;
}

export default async function getApi(
  endpoint,
  successToast = true,
  startLoader = true,
  showError = true,
  defaultError = true,
) {
  storeUpdate();
  if (startLoader) {
    loaderStart();
  }
  try {
    const response = await axios.get(endpoint);
    loaderStop();
    {
      successToast
        ? Toast.show({
            text1: response.data.message,
            type: 'success',
            visibilityTime: 5000,
          })
        : null;
    }
    return response.data;
  } catch (e) {
    loaderStop();
    if (
      e.message.includes('timeout of ') &&
      e.message.includes('ms exceeded')
    ) {
      Toast.show({
        text1: "Can't connect to server",
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else if (e?.response?.status == 401) {
      console.log('SESSION OUt');
      Toast.show({
        text1: 'Session out',
        type: 'error',
        visibilityTime: 2000,
      });
      GoogleSignin.signOut();
      userLogout();
    } else if (e.response?.data?.message && showError) {
      Toast.show({
        text1: e.response.data.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else if (defaultError) {
      Toast.show({
        text1: e.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    }
    return null;
  }
}
