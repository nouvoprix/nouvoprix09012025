import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
  Dimensions,
  Linking,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import Icons from '../assets/Icons';
import URL from '../config/Common';
import {Colors, NavService, Shadows} from '../config';
import {
  PrivacyPolicy,
  TermsConditions,
  userDelete,
  userLogout,
} from '../redux/APIs';
import ProfileImage from '../components/ProfileImage';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';
import { getUrl } from '../config/Helpers/getUrl';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

class Drawer extends Component {
  state = {
    renderSubMenu: false,
    selected: false,
    deletePopup: false,
  };
  _renderItem({title, icon, nav, children}) {
    const {renderSubMenu, selected} = this.state;
    const {user} = this.props;
    return (
      <>
        {children ? (
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.setState({
                  renderSubMenu: !this.state.renderSubMenu,
                  selected: !selected,
                });
                LayoutAnimation.linear();
              }}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                // marginBottom: 10,
                borderBottomWidth: !selected ? 3.2 : null,
                borderColor: !selected ? '#eeeeee' : null,
                paddingHorizontal: 20,
                justifyContent: 'space-between',
                height: Dimensions.get('window').height * 0.08,
                backgroundColor: selected ? Colors.primary : null,
                borderRadius: 8,
                marginTop: 0,
              }}>
              <Text
                style={{
                  marginLeft: 10,
                  color: selected ? Colors.white : Colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {title}
              </Text>
              <View
                style={{
                  padding: 10,
                  borderRadius: 7,
                  marginBottom: 5,
                }}>
                <Image
                  source={icon}
                  style={{
                    tintColor: selected ? Colors.white : Colors.black,
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </TouchableOpacity>
            {renderSubMenu && (
              <>
                {children.map((item, index) => {
                  const {title, icon, nav} = item;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        if (item?.routeParam) {
                          this.props.navigation.navigate(nav, {
                            screen: item?.routeParam,
                          });
                        } else if (item?.browser) {
                          Linking.openURL(item?.browser);
                        } else if (nav == 'TermsConditions') {
                          await TermsConditions(
                            this.props?.i18n?.language?.slice(0, 7),
                          );
                        } else if (nav == 'PrivacyPolicy') {
                          await PrivacyPolicy(
                            this.props?.i18n.language?.slice(0, 7),
                          );
                        } else {
                          this.props.navigation.navigate(nav);
                        }
                      }}
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        borderBottomWidth: 3.2,
                        borderColor: '#eeeeee',
                        paddingHorizontal: 20,
                        justifyContent: 'space-between',
                        height: Dimensions.get('window').height * 0.065,
                      }}>
                      <Text
                        style={{
                          marginLeft: 10,
                          color: Colors.primary,
                          fontSize: 16,
                          fontWeight: '700',
                        }}>
                        {title}
                      </Text>
                      <View
                        style={{
                          padding: 10,
                          borderRadius: 7,
                          marginBottom: 5,
                        }}>
                        <Image
                          source={icon}
                          style={{
                            tintColor: Colors.primary,
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              if (nav == 'Logout') {
                // this.props.saveUser(null);
                await userLogout();
              } else if (nav == 'DeleteAcount') {
                this.togglePopUp();
              } else {
                this.props.navigation.navigate(nav);
              }
            }}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              // marginBottom: 10,
              borderBottomWidth: 3.2,
              borderColor: '#eeeeee',
              paddingHorizontal: 20,
              justifyContent: 'space-between',
              height: Dimensions.get('window').height * 0.08,
              marginTop: 0,
              // elevation: 0.2,
            }}>
            <Text
              style={{
                marginLeft: 10,
                color: Colors.black,
                fontSize: 16,
                fontWeight: '600',
              }}>
              {title}
            </Text>
            <View
              style={{
                padding: 10,
                borderRadius: 7,
                marginBottom: 5,
              }}>
              <Image
                source={icon}
                style={{
                  tintColor: Colors.black,
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  }
  togglePopUp = () => {
    this.setState({deletePopup: !this.state.deletePopup});
  };
  render() {
    const {user, t} = this.props;
    const {deletePopup} = this.state;

    const menuItems = [
      {
        icon: Icons.home,
        title: t('str_Home'),
        nav: 'home',
      },
      // {
      //   icon: Icons.stats,
      //   title: t('My_Trades'),
      //   nav: 'MyTrades',
      // },
      // {
      //   icon: Icons.msg,
      //   title: t('My_Messages'),
      //   nav: 'ChatList',
      // },
      {
        icon: Icons.card,
        title: t('str_Ads_Manager'),
        nav: 'AdManager',
      },
      {
        icon: Icons.card,
        title: t('Featured'),
        nav: 'FeatureProduct',
      },
      {
        icon: Icons.setting,
        title: t('str_Settings'),
        nav: 'Setting',
        children: [
          {
            icon: Icons.password,
            title: t('str_Change_Password'),
            nav: 'ChangePassword',
            routeParam: 'screen',
          },
          // {
          //   icon: Icons.card,
          //   title: 'Payment Settings',
          //   nav: 'MyMessages',
          // },
          {
            icon: Icons.termComdition,
            title: t('Terms_&_Conditions'),
            nav: 'TermsConditions',
          },
          {
            icon: Icons.PrivacyPolicy,
            title: t('str_Privacy_Policy'),
            nav: 'PrivacyPolicy',
          },
        ],
      },
      {
        icon: Icons.trash,
        title: t('str_Activating_Deactivating'),
        nav: 'DeleteAcount',
      },
      {
        icon: Icons.power,
        title: t('str_Logout'),
        nav: 'Logout',
      },
    ];
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Colors.white,
          alignItems: 'center',
          // paddingTop: getStatusBarHeight(),
          // borderTopRightRadius: 30,
          // borderBottomRightRadius: 30,
        }}>
        <View
          style={{
            height: Dimensions.get('window').height * 0.18,
            width: '101%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginBottom: 20,
            ...Shadows.shadow3,
          }}>
          <TouchableOpacity
            onPress={() => NavService.navigate('user')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Dimensions.get('window').height * 0.08,
              width: Dimensions.get('window').width * 0.6,
              marginLeft: 14,
              height: Dimensions.get('window').height * 0.08,
            }}>
            {/* <Image
              source={Icons.profile}
              style={{
                height: Dimensions.get('window').height * 0.064,
                width: Dimensions.get('window').width * 0.12,
                marginLeft: 10,
              }}
            /> */}

            {/* <Image
              resizeMode="stretch"
              source={{
                uri:
                  user?.profilePicture !== null &&
                  URL.socketURL + user?.profilePicture,
              }}
              style={{width: 60, height: 60, borderRadius: 100}}
            /> */}
            <ProfileImage
              name={user?.name ? user?.name : ''}
              imageUri={
                user?.profilePicture !== null &&
               getUrl(user?.profilePicture)
              }
              size={90}
            />
            <View style={{marginLeft: 10 , width: '90%'}}>
              <Text
                style={{color: Colors.black, fontSize: 16, fontWeight: '700'}}>
                {user?.name}
              </Text>
              <Text
                style={{color: Colors.grey, fontSize: 14, fontWeight: '400'}}>
                {user?.email}
              </Text>
            </View>
          </TouchableOpacity>
          {/* <ProfileImage size={140} imageUri={user?.image} name={user?.name} />
          <Text> {user?.name}</Text>
          <Text
            numberOfLines={1}
            style={{
              color: Colors.grey,
              fontSize: 14,
              marginTop: 5,
              fontWeight: '600',
            }}>
            {user?.email}
          </Text> */}
        </View>
        <View style={{flex: 1, marginTop: 10, width: '100%'}}>
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
        <Modal
          isVisible={deletePopup}
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
                  {t('str_CONFIRMATION')}
                </Text>
              </View>
              <View style={{padding: 20}}>
                <Text
                  style={{
                    color: Colors.black,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {t('str_You_have_previously_deleted_your_account')}
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
                    onPress={async () => {
                      this.togglePopUp();
                      await userDelete();
                    }}
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
                      {t('Delete')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapState({user: {userData}}) {
  return {
    user: userData,
  };
}

function mapDispatch(dispatch) {
  return {
    saveUser: user => {
      dispatch({type: 'SAVE_USER', payload: user});
    },
  };
}

// export default connect(mapState, mapDispatch)(Drawer);
export default compose(
  withTranslation(),
  connect(mapState, mapDispatch),
)(Drawer);
