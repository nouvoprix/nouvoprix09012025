import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {connect} from 'react-redux';
import Icons from '../assets/Icons';
import {Colors, NavService} from '../config';
import {userLogout} from '../redux/APIs';
import {logout} from '../redux/actions';
import ProfileImage from './ProfileImage';

const menuItems = [
  {
    icon: Icons.home,
    title: 'Home',
    nav: 'Home',
  },
  {
    icon: Icons.profile,
    title: 'My Profile',
    nav: 'Profile',
  },
  {
    icon: Icons.bag,
    title: 'My Postings',
    nav: 'MyPosting',
  },
  {
    icon: Icons.settings,
    title: 'Settings',
    nav: 'Settings',
  },
  {
    icon: Icons.card,
    title: 'Card Details',
    nav: 'CardDetails',
  },
  {
    icon: Icons.password,
    title: 'Change Password',
    nav: 'ChangePassword',
  },
  {
    icon: Icons.termsConditions,
    title: 'Terms & Conditions',
    nav: 'TermsConditions',
  },
  {
    icon: Icons.privacyPolicy,
    title: 'Privacy Policy',
    nav: 'PrivacyPolicy',
  },
  {
    icon: Icons.power,
    title: 'Logout',
    nav: 'Auth',
  },
];

class Drawer extends Component {
  _renderItem({title, icon, nav}) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (title === 'Logout') {
            userLogout();
          } else if (title === 'Home') {
            this.props.navigation.navigate('Tab', {screen: 'Home'});
          } else {
            this.props.navigation.navigate(nav);
          }
        }}
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 7,
          }}>
          <Image
            source={icon}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
              tintColor: Colors.white,
            }}
          />
        </View>
        <Text
          style={{
            marginLeft: 10,
            color: Colors.white,
            fontSize: 16,
            fontWeight: '500',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    const {user} = this.props;
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Colors.dark,
          alignItems: 'center',
          paddingTop: getStatusBarHeight(),
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
        }}>
        <View
          style={{
            marginTop: 20,
            // flexDirection: 'row',
            width: '80%',
            marginLeft: -10,
            alignItems: 'center',
            paddingBottom: 20,
            flexDirection: 'row',
          }}>
          <ProfileImage size={100} imageUri={user?.image} name={user?.name} />
          <View
            style={{
              marginLeft: '4%',
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: Colors.white,
                fontSize: 16,
                marginTop: 10,
              }}>
              {user?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: Colors.lightGrey,
                fontSize: 14,
                marginTop: 15,
              }}>
              {user?.email}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, marginTop: 30, width: '80%'}}>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={menuItems}
            style={{
              height: '100%',
            }}
            renderItem={({item}) => this._renderItem(item)}
          />
        </View>
      </View>
    );
  }
}

function mapState({reducer: {user}}) {
  return {
    user,
  };
}

function mapDispatch(dispatch) {
  return {
    logout: (token, userID) => {
      dispatch(logout(token, userID));
    },
  };
}

export default connect(mapState, mapDispatch)(Drawer);
