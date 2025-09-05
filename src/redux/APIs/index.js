import { NavService } from '../../config';
import Toast from 'react-native-toast-message';
import postApi, { fetchApi } from '../RequestTypes/post';
import putApi from '../RequestTypes/put';
import getApi from '../RequestTypes/get';
import * as EmailValidator from 'email-validator';
import {
  logoutUser,
  savePolicy,
  saveProducts,
  saveProfile,
  saveTerms,
  saveToken,
  saveUser,
} from '../actions';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import { ToastSuccess } from '../../config/Helpers/Toast';
import deleteApi from '../RequestTypes/delete';
import i18n from '../../config/Helpers/i18n';

var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(50)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

export const getDeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) return token;
    else return '';
  } catch (error) {
    console.log(error);
  }
};

//  USER REGISTRATION MODULE
export async function userSocialSignIn(
  socialToken,
  socialType,
  user_credential,
) {
  const fcmToken = await getDeviceToken();
  const params = {
    user_social_token: socialToken,
    user_social_type: socialType,
    user_device_type: Platform.OS,
    user_device_token: fcmToken ? fcmToken : 'abc',
    email:
      socialType == 'google'
        ? user_credential
        : socialType == 'apple'
          ? user_credential[0]?.email
          : '',
  };
  const data = await postApi('social-login', params);
  if (data?.status == 1 && data?.data?.is_profile == 1) {
    saveToken(data?.data?.user_authentication);
    saveUser(data?.data);
    if (data?.data?.language) {
      i18n
        .changeLanguage(
          data?.data?.language == 'Haitian Creole'
            ? 'HaitianCreole'
            : data?.data?.language,
        )
        .then(() => console.log('language changed'))
        .catch(err => console.log('error', err));
    }
    NavService.reset(0, [{ name: 'UserStack' }]);
  } else if (data?.status == 1 && data?.data?.is_profile == 0) {
    saveToken(data?.data?.user_authentication);
    if (socialType == 'apple') {
      saveToken(data?.data?.user_authentication);
      saveUser(data?.data);
      NavService.reset(0, [{ name: 'UserStack' }]);
      // NavService.navigate('CompleteProfile', {user: user_credential});
    } else {
      NavService.navigate('CompleteProfile');
    }
  }
}
export async function userLogin(email, password, callBackForRecievingInfo) {
  const fcmToken = await getDeviceToken();
  const params = {
    email,
    password,
    user_device_type: Platform.OS,
    user_device_token: fcmToken,
  };
  console.log('payload', params);
  const data = await postApi('login', params);
  console.log('data', data);
  if (
    data?.status == 1 &&
    data?.data?.verified == 1 &&
    data?.data?.is_profile == 1
  ) {
    saveToken(data?.token);
    saveUser(data?.data);
    if (data?.data?.language) {
      i18n
        .changeLanguage(
          data?.data?.language == 'Haitian Creole'
            ? 'HaitianCreole'
            : data?.data?.language,
        )
        .then(() => console.log('language changed'))
        .catch(err => console.log('error', err));
    }
    NavService.reset(0, [{ name: 'UserStack' }]);
  } else if (data?.status == 0 && data?.data?.verified == 0) {
    NavService.replace('OTP', { _id: data?.data?._id, email });
  } else if (data?.status == 1 && data?.data?.is_profile == 0) {
    saveToken(data?.token);
    NavService.replace('CompleteProfile');
  } else if (data?.status == 0 && data?.data?.is_delete == 1) {
    callBackForRecievingInfo(data?.data);
  }
}
export async function userRecoverAccount(user_id) {
  const data = await getApi(`recover-User/${user_id}`);
  console.log('data', data);
  if (data?.status == 1) {
    saveToken(data?.token);
    saveUser(data?.data);
    NavService.reset(0, [{ name: 'UserStack' }]);
  } else if (data?.status == 1 && data?.data?.verified == 0) {
    NavService.replace('OTP', { _id: data?.data?._id, email });
  } else if (data?.status == 1 && data?.data?.is_profile == 0) {
    saveToken(data?.token);
    NavService.replace('CompleteProfile');
  } else if (data?.status == 0 && data?.data?.is_delete == 1) {
    callBackForRecievingInfo(data?.data);
  }
}
export async function userSignup(email, password, confirmPassword) {
  if (!email)
    return Toast.show({
      text1: 'Please enter email',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!password)
    return Toast.show({
      text1: 'Please enter password',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!confirmPassword)
    return Toast.show({
      text1: 'Please enter confirm password',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!EmailValidator.validate(email))
    return Toast.show({
      text1: 'Invalid Email',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!schema.validate(password))
    return Toast.show({
      text1:
        'Password must be of 8 characters long and contain atleast 1 uppercase, 1 lowercase, 1 digit and 1 special character',
      type: 'error',
      visibilityTime: 3000,
    });
  if (password !== confirmPassword)
    return Toast.show({
      text1: 'Confirm Password and Password need to be same',
      type: 'error',
      visibilityTime: 3000,
    });
  const fcmToken = await getDeviceToken();

  const params = {
    email,
    password,
    confirm_password: confirmPassword,
    device_type: Platform.OS,
    device_token: fcmToken,
  };
  const data = await postApi('register', params);
  if (data.status == 1) {
    NavService.replace('OTP', {
      _id: data?.data?.user_id,
      email,
      screen: 'signup',
    });
  } else {
  }
}
export async function userVerifyCode(code, User, screen) {
  const params = {
    verification_code: code,
    user_id: User,
  };
  const data = await postApi('verify-user', params);
  if (data.status == 1) {
    if (screen == 'signup') {
      saveToken(data?.data?.user_authentication);
      NavService.replace('CompleteProfile');
    } else if (screen == 'forgot') {
      NavService.replace('ResetPassword', { screen: 'forgot' });
    } else {
      NavService.replace('Login');
    }
  }
}
export async function userResendVerifyCode(user_id) {
  await postApi('resend-code', { user_id });
}
export async function phoneVerifyLogin(payload) {
  const data = await postApi('social-login', payload);
  if (data?.status == 1 && data?.data?.is_profile == 1) {
    saveToken(data?.data?.user_authentication);
    saveUser(data?.data);
    if (data?.data?.language) {
      i18n
        .changeLanguage(
          data?.data?.language == 'Haitian Creole'
            ? 'HaitianCreole'
            : data?.data?.language,
        )
        .then(() => console.log('language changed'))
        .catch(err => console.log('error', err));
    }
    NavService.reset(0, [{ name: 'UserStack' }]);
  } else if (data?.status == 1 && data?.data?.is_profile == 0) {
    saveToken(data?.data?.user_authentication);
    NavService.replace('CompleteProfile');
  }
}
export async function userCompleteProfile(
  name,
  address,
  country,
  selectedImage,
  zipcode,
  language,
) {
  const params = {
    name,
    address,
    country: country !== null ? country?.name : null,
    currency: country !== null ? country?.currency : null,
    zip_code: zipcode,
    language,
  };
  if (selectedImage != null) {
    const { path, mime } = selectedImage;
    params.profilePicture = {
      uri: path,
      name: `Profile${Date.now()}.${mime.slice(mime.lastIndexOf('/') + 1)}`,
      type: mime,
    };
  }
  // if (zipcode.length < 5) {
  //   return Toast.show({
  //     text1: 'Zip code should be at least 5 digits',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });
  // }

  const data = await postApi('update-profile', params, true);

  if (data.status == 1) {
    saveToken(data?.data?.user_authentication);
    saveUser(data?.data);
    Toast.show({
      text1: 'Profile created successfully.',
      type: 'success',
      visibilityTime: 3000,
    });
    NavService.reset(0, [{ name: 'UserStack' }]);
  }
}
export async function userForgetPassword(email) {
  const data = await postApi('forgot-password', { email });

  if (data.status == 1) {
    saveUser(data);
    NavService.replace('OTP', {
      _id: data?.data?.user_id,
      email,
      screen: 'forgot',
    });
    // saveToken(data?.data?.user_id);
    // saveUser(data?.data);
  }
}
export async function userGetData() {
  const data = await postApi('get-profile', {});

  if (data.status == 1) {
    saveUser(data?.data);
  }
}
export async function userVerifyForgetPasswordCode(otp, _id) {
  const params = {
    otp,
    _id,
  };
  const data = await postApi('user/verifyaccount', params);
  if (data.status == 1) {
    NavService.replace('ResetPassword', { email: data?.data?.email });
  }
}
export async function userResendForgetPasswordCode(email) {
  await postApi('user/resendotp', { email });
}
export async function userChangePassword(existingPasswrod, newPassword) {
  // if (!newPassword)
  //   return Toast.show({
  //     text1: 'Please enter your password',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });
  // if (!existingPasswrod)
  //   return Toast.show({
  //     text1: 'Please enter your confirm password',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });
  // if (!schema.validate(newPassword))
  //   return Toast.show({
  //     text1: 'Password not valid (Use atleast eight character)',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });

  const params = {
    old_password: existingPasswrod,
    new_password: newPassword,
  };
  const data = await postApi('change-password', params);

  if (data.status == 1) {
    NavService.goBack();
  } else {
  }
}
export async function userResetPassword({ uuid, newPassword }) {
  // if (!newPassword)
  //   return Toast.show({
  //     text1: 'Please enter your password',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });
  // if (!schema.validate(newPassword))
  //   return Toast.show({
  //     text1: 'Password not valid (Use atleast eight character)',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });

  const params = {
    user_id: uuid,
    new_password: newPassword,
  };
  const data = await postApi('update-password', params);

  if (data.status == 1) {
    NavService.navigate('Login');
  } else {
  }
}
export async function userLogout() {
  const isSignedIn = await GoogleSignin.isSignedIn();
  if (isSignedIn) await GoogleSignin.signOut();
  await fetchApi('logout', false, true);
  setTimeout(() => {
    NavService.reset(0, [{ name: 'AuthStack' }]);
    Toast.show({
      text1: 'Logout Successfully',
      type: 'success',
      visibilityTime: 3000,
    });
  }, 200);
  logoutUser();
};

const uploadImageToServer = async (image) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: image.type,
    name: image.fileName || 'photo.jpg',
  });

  try {
    const res = await axios.post(`${bucketURL}upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: Constants.defaultTimeout,
    });

  } catch (err) {
    console.error('Upload error:', err.message);
  }
};

export async function userUpdateProfile(
  name,
  address,
  country,
  currency,
  selectedImage,
  zipcode,
  language,
  state
) {
  const params = {
    name,
    address,
    country,
    currency,
    zip_code: zipcode,
    language,
    state
  };
  if (selectedImage != null) {
    const { path, mime } = selectedImage;
    params.profilePicture = {
      uri: path,
      name: `Profile${Date.now()}.${mime.slice(mime.lastIndexOf('/') + 1)}`,
      type: mime,
    };
  }
  // if (zipcode.length < 5) {
  //   return Toast.show({
  //     text1: 'Zip code should be at least 5 digits',
  //     type: 'error',
  //     visibilityTime: 3000,
  //   });
  // }


  const paramData = new FormData();
  paramData.append('name', name);
  paramData.append('state', state);

  paramData.append('address', address);
  if (selectedImage !== null) {
    const { path, mime } = selectedImage;
    paramData.append('profilePicture', {
      uri: path,
      name: `Profile${Date.now()}.${mime.slice(mime.lastIndexOf('/') + 1)}`,
      type: mime,
    });
  }
  if (zipcode) {
    paramData.append('zip_code', zipcode);
  }
  if (country) {
    paramData.append('country', country);
  }
  if (currency) {
    paramData.append('currency', currency);
  }
  if (language) {
    paramData.append('language', language);
  }
  const data = await fetchApi('update-profile', paramData, true, true);
  console.log(paramData, 'paramDataparamDataparamDataparamData');
  if (data?.status == 1) {
    saveUser(data?.data);
    saveToken(data?.data?.user_authentication);
    Toast.show({
      text1: 'Profile Updated successfully.',
      type: 'success',
      visibilityTime: 3000,
    });
    NavService.goBack();
  }
  return;
}
export async function userDelete() {
  const data = await getApi('delete-user');
  if (data?.status == 1) {
    Toast.show({
      text1: 'User Deleted successfully.',
      type: 'success',
      visibilityTime: 3000,
    });
    logoutUser();
    NavService.reset(0, [{ name: 'AuthStack' }]);
  }
  return;
}
export async function TermsConditions(selectedLanguage) {
  const data = await getApi(
    `get-content/terms_and_conditions/${selectedLanguage}`,
    false,
    true,
    false,
    false,
  );
  if (data?.status == 1) {
    NavService.navigate('TermsConditions', { content: data });
  }
  return;
}
export async function PrivacyPolicy(selectedLanguage) {
  const data = await getApi(
    `get-content/privacy_policy/${selectedLanguage}`,
    false,
    true,
    false,
    false,
  );
  if (data?.status == 1) {
    NavService.navigate('PrivacyPolicy', { content: data });
  }
  return;
}

//  USER PRODUCT MODULE

export async function getProducts() {
  const data = await getApi('my-products', false, true, false, false);
  console.log(data, 'hahehehe')
  if (data?.status == 1) {
    return data?.data;
  }
  return;
}

export async function getProductInfo(_id) {
  const data = await getApi(`product-detail/${_id}`, false, true, false, false);
  if (data?.status == 1) {
    // saveProfile(data);
    return data?.data;
  }
  return;
}
export async function buyFeatures(
  receiptJson,
  sku,
  noOfAdsQuantity,
  noOfDays,
  finishTransaction,
  receipt,
) {
  const paramData = {
    transactionReceipt: receiptJson,
    sku,
    platform: Platform.OS == 'ios' ? 'apple' : 'google',
    no_of_features: String(noOfAdsQuantity),
    no_of_days: noOfDays,
  };
  console.log('paramData', paramData);
  const data = await postApi('buy-subscription', paramData);
  await finishTransaction({
    purchase: receipt[0],
    isConsumable: false,
    // developerPayloadAndroid: undefined,
  });
  if (data?.status == 1) {
    // Toast.show(ToastSuccess('Product Added Successfully!'));
    console.log('data', data);
    saveUser(data?.user);
    NavService.navigate('home');
  }
  return;
}
export async function FeatureCurrentProduct(id) {
  const paramData = {
    _id: id,
  };
  const data = await postApi('feature-product', paramData);

  if (data?.status == 1) {
    // NavService.navigate('home');
    saveUser(data?.user);
  }
  return data;
}
export async function createProduct(
  title,
  price,
  category,
  description,
  used,
  lat,
  long,
  venue,
  productCity,
  Owner,
  multipleAssetsPost,
  state
) {
  const paramData = {
    product_title: title,
    product_price: price,
    product_category: category,
    product_description: description,
    product_status: used,
    lat: lat,
    long: long,
    location: venue,
    product_city: productCity,
    first_owner: Owner,
    product_picture: multipleAssetsPost,
    product_state: state ? state : 'Washington',
  };
  console.log(paramData, 'paramDataparamDataparamDataparamData');
  const data = await postApi('add-product', paramData, true);

  if (data?.status == 1) {
    Toast.show(ToastSuccess('Product Added Successfully!'));
    NavService.navigate('home');
  }
  return;
}

//
export async function updateProduct(
  Owner,
  title,
  price,
  category,
  des,
  used,
  lat,
  long,
  venue,
  productCity,
  multipleAssetsPost,
  productId,
  afterImagePath,
) {
  const paramData = {
    product_title: title,
    product_price: price,
    product_category: category,
    product_description: des,
    product_status: used,
    lat: lat,
    long: long,
    location: venue,
    product_city: productCity,
    first_owner: Owner,
    product_picture: multipleAssetsPost,
    prevGallery: JSON.stringify(afterImagePath),
  };

  const data = await postApi(`update-product/${productId}`, paramData, true);

  if (data?.status == 1) {
    Toast.show(ToastSuccess('Product updated Successfully!'));
    NavService.navigate('home');
  }
  return;
}
export async function createRating(rate, review, productId) {
  const paramData = {
    productId,
    rate,
    review,
  };
  const data = await postApi('addReview', paramData);

  if (data?.status == 1) {
    Toast.show(ToastSuccess('Rating Added Successfully!'));
  }
  return;
}
export async function getRatingAndReviews(productId) {
  const data = await getApi(
    `getProductReviews/${productId}`,
    false,
    true,
    false,
    false,
  );

  if (data?.status == 1) {
    return data?.data;
  }
  return [];
}
export async function productDelete(productId) {
  const data = await deleteApi(`delete-product/${productId}`);
  if (data?.status == 1) {
    Toast.show({
      text1: 'Product Deleted successfully.',
      type: 'success',
      visibilityTime: 3000,
    });
  }
  return;
}

export async function Productfeatured(productId) {
  const params = {
    _id: productId,
  };
  const data = await postApi('feature-product', params);
  if (data?.status == 1) {
    Toast.show({
      text1: 'Product Features available',
      type: 'success',
      visibilityTime: 3000,
    });
    return data;
  }
  return;
}

export async function myTrades(type) {
  const data = await getApi(`my-trades/${type}`, false, true, false, false);

  if (data?.status == 1) {
    return data?.data;
  }
  return data;
}

export async function inActiveProducts(productId) {
  const params = {
    _id: productId,
  };

  const data = await postApi('inactive-product', params);

  if (data?.status == 1) {
    Toast.show({
      text1: data?.message,
      type: 'success',
      visibilityTime: 3000,
    });
    return data;
  }
  return;
}
export async function ActiveProducts(productId) {
  const params = {
    _id: productId,
  };

  const data = await postApi('active-product', params);

  if (data?.status == 1) {
    Toast.show({
      text1: data?.message,
      type: 'success',
      visibilityTime: 3000,
    });
    return data;
  }
  return;
}
export async function getAllProducts(
  keyword,
  product_category,
  product_pricel,
  product_priceg,
  city,
  product_status,
  successToast = true,
  page = 1,
  limit = 10,
  apiLoader = true,
  errorToast = true,
  defaultErrorToast = true,
) {
  let queryString = '';
  if (product_priceg !== '' && product_pricel !== '') {
    queryString = `get-products?product_status=${product_status}&keyword=${keyword}&product_price[lt]=${product_pricel}&product_price[gt]=${product_priceg}&product_category=${product_category}&product_city=${city}&page=${page}&limit=${limit}`;
  } else if (product_pricel !== '') {
    queryString = `get-products?product_status=${product_status}&keyword=${keyword}&product_price[lt]=${product_pricel}&product_category=${product_category}&product_city=${city}&page=${page}&limit=${limit}`;
  } else if (product_priceg !== '') {
    queryString = `get-products?product_status=${product_status}&keyword=${keyword}&product_price[gt]=${product_priceg}&product_category=${product_category}&product_city=${city}&page=${page}&limit=${limit}`;
  } else {
    queryString = `get-products?product_status=${product_status}&keyword=${keyword}&product_category=${product_category}&product_city=${city}&page=${page}&limit=${limit}`;
  }

  console.log('queryString', queryString, 'queryString');
  const data = await getApi(
    queryString,
    successToast,
    apiLoader,
    errorToast,
    defaultErrorToast,
  );

  console.log('product api response', data, 'product api response');
  if (data?.status == 1) {
    // Return the full response object so we can access pagination info
    return {
      products: data.allProducts,
      pagination: data.pagination
    };
  }
  return null;
}

export async function getMessageList() {
  const data = await getApi('chatList', false, false, false, false);
  if (data?.status == 1) {
    return data;
  }
  return;
}

export async function getNotifications() {
  const data = await getApi('get-notifications', false, true, false, false);
  if (data?.status == 1) {
    return data;
  }
  return;
}

export async function getOtherProfile(userId) {
  const data = await getApi(
    `other-profile/${userId}`,
    false,
    true,
    false,
    false,
  );
  if (data?.status == 1) {
    console.log('data', data);
    return data;
  }
  return;
}
export async function getAllCountries() {
  const data = await getApi('get-country', false, true, false, false);
  if (data?.status == 1) {
    return data?.data;
  } else {
    return [];
  }
}
export async function getSearchedProducts(keyword = '', page = 1, limit = 10) {
  const data = await getApi(
    `search-products?page=${page}&limit=${limit}&keyword=${keyword}`,
    false,
    true,
    false,
    false,
  );
  if (data?.status == 1) {
    return data?.data;
  } else {
    return [];
  }
}
export async function getCampaignInfo(_id) {
  const data = await getApi(`campaign/${_id}`, false, true, false, false);
  if (data?.status == 1) {
    // saveProfile(data);
    return data?.data;
  }
  return;
}
export async function createCampaign(paramData, finishTransaction, receipt) {
  console.log('paramData', paramData);
  const data = await postApi('campaign', paramData, true);
  await finishTransaction({
    purchase: receipt[0],
    isConsumable: true,
    // developerPayloadAndroid: undefined,
  });
  if (data?.status == 1) {
    Toast.show(ToastSuccess('Campaign Added Successfully!'));
    NavService.navigate('home');
  }
  return;
}
export async function editCampaign(paramData) {
  const data = await putApi('campaign', paramData, true);

  if (data?.status == 1) {
    Toast.show(ToastSuccess('Campaign Updated Successfully!'));
    NavService.goBack();
  }
  return;
}
export async function deleteCampaign(
  campaignId,
  setSelectedCampaignForDeletion,
  allCampaigns,
  setAllCampaigns,
) {
  const data = await deleteApi(`campaign/${campaignId}`, true, true);
  console.log('data', data);
  if (data?.status == 1) {
    Toast.show(ToastSuccess('Campaign Deleted Successfully!'));
    setSelectedCampaignForDeletion(null);
    const remainingCampaigns = allCampaigns?.filter(
      campaign => campaign?._id !== campaignId,
    );
    setAllCampaigns(remainingCampaigns);
    setDataKey(previousState => !previousState);
  }
  return;
}
export async function getCampaignRegions() {
  const data = await getApi('all-regions', false, true, false, false);
  if (data?.status == 1) {
    // saveProfile(data);
    return data?.data;
  }
  return;
}
export async function getCampaignGoals() {
  const data = await getApi('all-goals', false, true, false, false);
  if (data?.status == 1) {
    // saveProfile(data);
    return data?.data;
  }
  return;
}
export async function addCampaignGoals(paramData) {
  const response = await postApi('add-goal', paramData);
  if (response?.status == 1) {
    return response?.data;
  }
  return;
}
export async function getCampaignAdType() {
  const data = await getApi('all-adtypes', false, true, false, false);
  if (data?.status == 1) {
    // saveProfile(data);
    return data?.data;
  }
  return;
}
export async function getCampaigns(queryParams) {
  let apiUrl = 'campaign';
  if (queryParams) {
    apiUrl = `campaign?type=${queryParams}`;
  } else {
    apiUrl = 'campaign';
  }
  const data = await getApi(apiUrl, false, true, false, false);
  console.log('Campaigns: ', data);
  if (data?.status == 1) {
    // saveProfile(data);
    console.log('Campaigns: ', data.data);
    return data?.data;
  }
  return;
}
export async function reportVideo(Params) {
  let apiUrl = 'report-campaign';
  const data = await postApi(apiUrl, Params, false, true, false);
  if (data?.status == 1) {
    // saveProfile(data);
    console.log('Data => ', data);

    return data?.data;
  }
  return;
}
