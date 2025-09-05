import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import PreLogin from './src/Container/Auth/Pre-login';
import Login from './src/Container/Auth/Login';
import PhoneLogin from './src/Container/Auth/PhoneLogin';
import NavigationService from './src/config/Helpers/NavService';
import ForgotPassword from './src/Container/Auth/ForgotPassword';
import Signin from './src/Container/Auth/Signin';
import OTP from './src/Container/Auth/OTP';
import PhoneOTP from './src/Container/Auth/phoneOTP';
import CompleteProfile from './src/Container/User/CompleteProfile';
import Home from './src/Container/User/Home';
import TabbarComp from './src/components/TabbarComponent';
import DrawerComp from './src/components/Drawer';
import Product from './src/Container/User/Product';
import ProductFeatures from './src/Container/User/ProductFeatures';
import ProductRatingReviews from './src/Container/User/ProductRatingReviews';
import Profile from './src/Container/User/Profile';
import Chat from './src/Container/User/Chat';
import MyProduct from './src/Container/User/MyProduct';
import CreateList from './src/Container/User/CreateList';
import Account from './src/Container/User/Account';
import EditeProfile from './src/Container/User/EditeProfile';
import ChatList from './src/Container/User/ChatList';
import Notification from './src/Container/User/Notification';
import MyTrades from './src/Container/User/MyTrades';
import ChangePassword from './src/Container/User/ChangePassword';
import EditeList from './src/Container/User/EditeList';
import PrivacyPolicy from './src/Container/User/PrivacyPolicy';
import TermsConditions from './src/Container/User/Terms&Conditions';
import ResetPassword from './src/Container/User/ResetPassword';
import FeatureProduct from './src/Container/User/FeatureProduct';
import FeatureCampaign from './src/Container/User/FeatureCampaign';
import AdManager from './src/Container/User/AdManager';
import AdDetail from './src/Container/User/AdDetail';
import CreateAd from './src/Container/User/CreateAd';
import EditAd from './src/Container/User/EditAd';
import i18n from './src/config/Helpers/i18n';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();


const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="pre-login">
      <Stack.Screen name="pre-login" component={PreLogin} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="PhoneOTP" component={PhoneOTP} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
    </Stack.Navigator>
  );
};

const BottomTab = () => {
  const count = useSelector(state => state.user?.unreadChatsCount || 0);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="home"
      tabBar={props => <TabbarComp count={count} {...props} insets={insets} />}>
      <Tab.Screen name="home" component={MyProduct} />
      <Tab.Screen name="user" component={Account} />
      <Tab.Screen name="search" component={Home} />
      <Tab.Screen name="MyMessages" component={ChatList} />
      <Tab.Screen name="MyTrades" component={MyTrades} />
    </Tab.Navigator>
  );
};

const ScreenStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'UserAppStack'}>
      <Stack.Screen name="UserAppStack" component={UserAppStack} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="ProductFeatures" component={ProductFeatures} />
      <Stack.Screen
        name="ProductRatingReviews"
        component={ProductRatingReviews}
      />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="CreateList" component={CreateList} />
      <Stack.Screen name="EditeProfile" component={EditeProfile} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="EditList" component={EditeList} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="FeatureProduct" component={FeatureProduct} />
      <Stack.Screen name="FeatureCampaign" component={FeatureCampaign} />
      <Stack.Screen name="AdManager" component={AdManager} />
      <Stack.Screen name="AdDetail" component={AdDetail} />
      <Stack.Screen name="CreateAd" component={CreateAd} />
      <Stack.Screen name="EditAd" component={EditAd} />
    </Stack.Navigator>
  );
};

const UserAppStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '80%',
          backgroundColor: 'transparent',
        },
      }}
      drawerContent={props => <DrawerComp {...props} />}
      initialRouteName={'BottomTab'}>
      <Drawer.Screen name="BottomTab" component={BottomTab} />
      {/* <Drawer.Screen name="MyTrades" component={MyTrades} />
      <Drawer.Screen name="MyMessages" component={ChatList} /> */}
    </Drawer.Navigator>
  );
};

class AppNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      initialRouteName: 'AuthStack',
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const { user } = this.props;
      SplashScreen.hide();
      if (user && user !== null) {
        i18n
          .changeLanguage(
            user?.language == 'Haitian Creole'
              ? 'HaitianCreole'
              : user?.language,
          )
          .then(() => console.log('language changed'))
          .catch(err => console.log('error', err));
        this.setState({ initialRouteName: 'UserStack' });
      }
      this.setState({ ready: true });
    }, 2500);
  }
  render() {
    const { initialRouteName, ready } = this.state;
    if (!ready) {
      return null;
    }
    return (
      <>
        <NavigationContainer
          ref={ref => NavigationService.setTopLevelNavigator(ref)}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialRouteName}>
            <Stack.Screen name="AuthStack" component={AuthStack} />
            <Stack.Screen name="UserStack" component={ScreenStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state?.user.userData,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps)(AppNavigation);
