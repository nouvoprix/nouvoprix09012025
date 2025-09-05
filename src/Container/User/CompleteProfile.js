import React, {Component, createRef} from 'react';
import {Dimensions, Image, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {withTranslation} from 'react-i18next';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors, NavService, Shadows} from '../../config';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import CustomBackground from '../../components/CustomBackground';
import CustomButton from '../../components/CustomButton';
import CustomImagePicker from '../../components/CustomImagePicker';
import Icons from '../../assets/Icons';
import ProfileImage from '../../components/ProfileImage';
// import cities from '../../assets/Data/cities';
// import countries from '../../assets/Data/countries';
import languages from '../../assets/Data/languages';
import CustomTextInputView from '../../components/CustomTextInputView';
import {ToastError} from '../../config/Helpers/Toast';
import Images from '../../assets/Images';
import {getAllCountries, userCompleteProfile} from '../../redux/APIs';
import i18n from '../../config/Helpers/i18n';

const {width} = Dimensions.get('window');
class CompleteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCountries: [],
      countries: [],
      name: '',
      dateOfBirth: '',
      address: '',
      state: '',
      country: null,
      selectedImage: null,
      zipcode: '',
      language: '',
      startLanguage: 'English',
    };
    this.actionSheetStateRef = createRef();
    this.actionSheetLanguageRef = createRef();
  }
  componentDidMount() {
    this.getCountries();
    const {user} = this.props.route.params;
    if (user) {
      this.setState({name: user[0]?.displayName});
    }
  }
  getCountries = async () => {
    const countries = await getAllCountries();
    if (countries?.length > 0) {
      const allCountries = [];
      const result = await countries?.map(country => {
        allCountries?.push(country?.name);
      });
      await Promise.all(result);
      this.setState({countries: allCountries, allCountries: countries});
    } else {
      this.setState({countries: [], allCountries: []});
    }
  };
  CompleteProfile = async t => {
    const {name, address, language, country, zipcode, selectedImage, state} =
      this.state;
    if (!name) {
      // if (!name && !language && !address && !zipcode && !country) {
      Toast.show(ToastError(`${t("Field's_can't_be_empty")}`));
    } else if (name == '') {
      Toast.show({
        text1: `${t('Please_enter_Name')}`,
        type: 'error',
        visibilityTime: 3000,
      });
    } else if (country == '') {
      Toast.show({
        text1: `${t('Select_a_Country')}`,
        type: 'error',
        visibilityTime: 3000,
      });
    } else {
      await userCompleteProfile(
        name,
        address,
        country,
        selectedImage,
        zipcode,
        language,
        state
      );
    }
  };
  changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => this.setState({startLanguage: value}))
      .catch(err => console.log('error', err));
  };
  render() {
    const userData = this.props.route?.params?.userData;
    const {
      allCountries,
      name,
      countries,
      language,
      selectedImage,
      zipcode,
      country,
      state
    } = this.state;
    const {t} = this?.props;
    return (
      <CustomBackground
        title={t('Complete_Profile')}
        notification={false}
        Inapp={false}>
        {/* <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{
          // alignItems: 'center',
          flexGrow: 1,
          marginTop: getStatusBarHeight(),
        }}> */}

        <ActionSheetComponent
          ref={this.actionSheetStateRef}
          title={t('Select_a_Country')}
          dataset={countries}
          onPress={item => {
            const currentSelectedCountry = item;
            const getDetailOfCurrentlySelectedCountry = allCountries?.filter(
              country => country?.name == currentSelectedCountry,
            );
            if (getDetailOfCurrentlySelectedCountry?.length > 0) {
              this.setState({
                country: getDetailOfCurrentlySelectedCountry[0],
              });
            }
          }}
        />
        <ActionSheetComponent
          ref={this.actionSheetLanguageRef}
          title={t('Select_a_Language')}
          dataset={languages}
          onPress={item => {
            this.setState({language: item});
            if (item == 'Haitian Creole') {
              this.changeLanguage('HaitianCreole');
            } else {
              this.changeLanguage(item);
            }
          }}
        />
        {/* <View style={{alignItems:'center'}}> 


        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: Colors.black,
          }}>
          {t('Complete_Profile')}
        </Text>
        </View> */}
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 40,
            marginTop: 40,
          }}>
          <View style={{marginBottom: 16}}>
            {this.props.route.params?.user ? null : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 35 / 2,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomImagePicker
                  style={{
                    width: 120,
                    height: 120,
                  }}
                  onImageChange={(path, mime) => {
                    this.setState({selectedImage: {path, mime}});
                  }}>
                  <ProfileImage
                    name={userData?.fullName}
                    imageUri={
                      selectedImage ? {uri: selectedImage.path} : Images.user
                    }
                    innerAsset={true}
                  />
                  {!selectedImage ? (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: -10,
                        right: 0,
                        backgroundColor: 'white',
                        padding: 10,
                        alignItems: 'center',
                        borderRadius: 25,
                      }}>
                      <Image
                        source={Icons.plus}
                        style={{width: 20, height: 20, resizeMode: 'contain'}}
                      />
                    </View>
                  ) : null}
                </CustomImagePicker>
              </View>
            )}
          </View>
          <CustomTextInputView
            maxLength={40}
            containerStyle={{marginBottom: 18, marginTop: 18, width: '100%'}}
            placeholder={t('Name')}
            label={t('Name')}
            value={name}
            Onchange={value => this.setState({name: value})}
          />
          <CustomTextInputView
            containerStyle={{marginBottom: 18, width: '100%'}}
            placeholder={`${t(`Select_a_Language`)} (${t('optional')})`}
            down={true}
            value={language}
            Onchange={value => {
              this.setState({language: value});
              this.changeLanguage(item);
            }}
            editable={false}
            openActionSheet={() => this.actionSheetLanguageRef.current.show()}
          />

          {/* <CustomTextInputView
            containerStyle={{marginBottom: 18, width: '100%'}}
            placeholder={t('Address')}
            value={address}
            Onchange={value => this.setState({address: value})}
          /> */}
          <View
            style={{
              width: '100%',
              ...Shadows.shadow3,

              borderRadius: 32,
              marginBottom: 16,
              backgroundColor: Colors.white,
            }}>
            <GooglePlacesAutocomplete
              enableHighAccuracyLocation
              // currentLocation
              fetchDetails
              disableScroll
              enablePoweredByContainer={false}
              listViewDisplayed={false}
              placeholder={`${t(`Location`)} (${t('optional')})`}
              placeholderTextColor={Colors.grey}
              onPress={(data, details = null) => {
                const {formatted_address, geometry} = details;
                this.setState({address: formatted_address});
              }}
              styles={{
                textInput: {
                  backgroundColor: 'transparent',
                  // flex: 1,
                  height: 50,
                  // width:'100%',
                  color: Colors?.darkGray,
                },
                description: {color: Colors?.darkGray},
              }}
              textInputProps={{
                placeholderTextColor: Colors?.darkGray,
              }}
              query={{
                key: 'AIzaSyCdx6W3QLTKq8l4tEsirmAO_-Y7ysy5Bp8',
                language: 'en',
                types: 'premise',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
            }}>
            <CustomTextInputView
              containerStyle={{
                width: '100%',
              }}
              placeholder={`${t(`Country`)}`}
              value={country?.name}
              down={true}
              editable={false}
              openActionSheet={() => this.actionSheetStateRef.current.show()}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
            }}>
            <CustomTextInputView
              maxLength={7}
              containerStyle={{
                width: '100%',
              }}
              placeholder={`${t(`State`)} / ${t('Department')} / ${t('Province')}`}
              type="default"
              value={state}
              Onchange={value => this.setState({state: value})}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
            }}>
            <CustomTextInputView
              maxLength={7}
              containerStyle={{
                width: '100%',
              }}
              placeholder={`${t(`Zip_code`)} (${t('optional')})`}
              type="number-pad"
              value={zipcode}
              Onchange={value => this.setState({zipcode: value})}
            />
          </View>
          <CustomButton
            title={t('CREATE_PROFILE')}
            onPress={() => this.CompleteProfile(t)}
            buttonStyle={{
              marginBottom: 20,
              marginTop: 30,
            }}
          />
        </View>
        {/* </ScrollView> */}
      </CustomBackground>
    );
  }
}
export default withTranslation()(CompleteProfile);
