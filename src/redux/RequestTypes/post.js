import axios from 'axios';
import Toast from 'react-native-toast-message';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Common} from '../../config';
import {loaderStart, loaderStop} from '../actions';
import {store} from '../index';
import {userLogout} from '../APIs';

axios.defaults.baseURL = Common.baseURL;
axios.defaults.timeout = Common.defaultTimeout;

function storeUpdate() {
  let user_authentication = store.getState()?.user?.userToken;
  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${user_authentication}`;
}

export default async function postApi(
  endpoint,
  params = null,
  isFormData = false,
  successToast = true,
  startLoader = true,
  stopLoader = true,
) {
  let newParams = params;
  storeUpdate();
  if (startLoader) {
    loaderStart();
  }
  if (isFormData) {
    newParams = new FormData();
    for (let key in params) {
      if (key == 'product_picture') {
        const productPictures = params[key];
        productPictures.map(item => {
          newParams.append(key, item);
        });
      } else {
        newParams.append(key, params[key]);
      }
    }
  }
  try {
    const response = await axios.post(endpoint, newParams, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        accept: 'application/json',
      },
    });
    console.log("ress: ", response.data)
    if (stopLoader) {
      loaderStop();
    }
    {
      successToast &&
        Toast.show({
          text1: response.data.message,
          type: 'success',
          visibilityTime: 5000,
        });
    }
    return response.data;
  } catch (e) {
    loaderStop();
    if (
      e?.message.includes('timeout of ') &&
      e?.message.includes('ms exceeded')
    ) {
      Toast.show({
        text1: "Can't connect to server",
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else if (e?.response?.status == 401) {
      Toast.show({
        text1: 'Session out',
        type: 'error',
        visibilityTime: 2000,
      });
      GoogleSignin.signOut();
      userLogout();
    } else if (e.response?.data?.message) {
      Toast.show({
        text1: e.response.data.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else {
      Toast.show({
        text1: e?.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    }
    return e?.response?.data;
  }
}
export async function fetchApi(
  endpoint,
  params = null,
  successToast = true,
  startLoader = true,
  token = null,
  stopLoader = true,
) {
  let user_authentication =
    store.getState()?.user?.userData?.user_authentication;
  if (startLoader) {
    loaderStart();
  }
  try {
    const response = await fetch(Common.baseURL + endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user_authentication}`,
      },
      body: params,
    });
    if (stopLoader) {
      loaderStop();
    }
    let json = await response.json();

    // {
    //   successToast
    //     ? Toast.show({
    //         text1: response.data.message,
    //         type: 'success',
    //         visibilityTime: 5000,
    //       })
    //     : null;
    // }

    return json;
  } catch (e) {
    // dispatch({type: 'LOADER_STOP'});
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
    } else if (e.response?.data?.message) {
      Toast.show({
        text1: e.response.data.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else if (e.response?.data?.message) {
      Toast.show({
        text1: e.response.data.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else {
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
