import {Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import Toast from 'react-native-toast-message';
import {Colors} from '../../config';

const sleep = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
export const openLink = async urlScheme => {
  try {
    const url = String(urlScheme)?.includes('http')
      ? String(urlScheme).toLowerCase()
      : `https://${urlScheme}`;
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: Colors?.primary,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: Colors?.primary,
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        // headers: {
        //   'my-custom-header': 'my custom header value',
        // },
      });
      await sleep(800);
      // Alert.alert(JSON.stringify(result));
    } else Linking.openURL(url);
  } catch (error) {
    Toast.show({
      text1: error?.message,
      textStyle: {textAlign: 'center'},
      type: 'error',
      visibilityTime: 5000,
    });
  }
};
