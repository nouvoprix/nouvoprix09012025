import React, { Component } from 'react';
import Navigation from './Navigation';
import {
  View,
  StatusBar,
  LogBox,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { requestNotifications, openSettings } from 'react-native-permissions';
import { Provider } from 'react-redux';
import { Loader, Colors, Common } from './src/config';
import { store } from './src/redux';
import { io } from 'socket.io-client';
import { I18nextProvider } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import i18n from './src/config/Helpers/i18n';

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Remote debugger']);

const requestNotificationPermission = async () => {
  if (Platform.OS == 'android') {
    requestNotifications(['alert', 'sound', 'badge', 'carPlay']).then(
      ({ status, settings }) => {
        if (status == 'granted') {
          // console.log('status', status);
        } else if (status == 'denied') {
          Toast.show({
            text1: 'Please open notification setting to recieve notification',
            type: 'error',
            visibilityTime: 5000,
          });
          openSettings();
        } else if (status == 'blocked') {
          Toast.show({
            text1: 'Please open notification setting to recieve notification',
            type: 'error',
            visibilityTime: 5000,
          });
          openSettings();
        }
      },
    );
  }
  const authStatus = await messaging().requestPermission({
    alert: true,
    announcement: false,
    badge: true,
    carPlay: true,
    provisional: false,
    sound: true,
  });
  if (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // await handleBackgroundMessages();
  } else {
    // alert(' noti disabled’)
  }
};

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      text1NumberOfLines={5}
      style={{
        borderLeftColor: Colors.green,
        maxHeight: 120,
        height: '100%',
        paddingVertical: 20,
      }}
      text1Style={{
        fontSize: 14,
        color: Colors.black,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1NumberOfLines={5}
      style={{
        borderLeftColor: Colors.icon,
        maxHeight: 120,
        height: '100%',
        paddingVertical: 20,
      }}
      text1Style={{
        fontSize: 14,
        color: Colors.black,
      }}
    />
  ),
};
const saveSocket = () => {
  const socket = io(Common.socketURL);
  store.dispatch({ type: 'SET_SOCKET', payload: socket });
};
class App extends Component {
  componentDidMount() {
    saveSocket();
    requestNotificationPermission();
  }
  render() {
    return (
      <Wrapper>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <Loader />
              <Navigation />
              <Toast config={toastConfig} />
            </Provider>
          </I18nextProvider>
        </GestureHandlerRootView>
      </Wrapper>
    );
  }
}

export default App;

function Wrapper({ children }) {
  if (Platform.OS === 'ios')
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      // keyboardVerticalOffset={20}
      >
        {children}
      </KeyboardAvoidingView>
    );
  return <View style={{ flex: 1 }}>{children}</View>;
}