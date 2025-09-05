import React, { Component, createRef } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import CustomButton from '../../components/CustomButton';
import CustomImagePicker from '../../components/CustomImagePicker';
import Icons from '../../assets/Icons';
import ProfileImage from '../../components/ProfileImage';
import languages from '../../assets/Data/languages';
import CustomTextInputView from '../../components/CustomTextInputView';
import AppBackground from '../../components/AppBackground';
import { getAllCountries, userUpdateProfile } from '../../redux/APIs';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { ToastError } from '../../config/Helpers/Toast';
import { connect } from 'react-redux';
import URLS from '../../config/Common';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import i18n from '../../config/Helpers/i18n';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { locationData } from '../../config/locations';
import { getUrl } from '../../config/Helpers/getUrl';

const { width } = Dimensions.get('window');

// Dummy states/departments data

class EditeProfile extends Component {
  constructor(props) {
    super(props);
    this.actionSheetCountryRef = createRef();
    this.actionSheetStateRef = createRef();
    this.actionSheetLanguageRef = createRef();

    const { Data } = this.props;
    this.state = {
      name: Data?.name,
      language: Data?.language,
      address: '',
      state: Data?.state,
      country: Data?.country,
      currency: Data?.currency,
      city: '',
      newCities: [],
      selectedImage: null,
      zipcode: Data?.zip_code,
      startLanguage: 'English',
      // New states for country-state functionality
      countries: [],
      allCountries: [],
      availableStates: [], // States for selected country
      isStateSelectionEnabled: false, // Enable state selection after country is selected
    };
  }

  componentDidMount() {
    this.getCountries();
    // Set initial states if country is already selected
    if (this.state.country) {
      this.updateStatesForCountry(this.state.country);
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
      this.setState({ countries: allCountries, allCountries: countries });
    } else {
      this.setState({ countries: [], allCountries: [] });
    }
  };

  // New method to update states based on selected country
  updateStatesForCountry = (selectedCountry, shouldClearState = false) => {
    const statesForCountry = locationData[selectedCountry] || [];
    this.setState({
      availableStates: statesForCountry,
      isStateSelectionEnabled: statesForCountry.length > 0,
      ...(shouldClearState && { state: '' }), // Only clear state if shouldClearState is true

      // state: '', // Clear previously selected state when country changes
    });
  };
  componentDidMount() {
    this.getCountries();
    // Set initial states if country is already selected - DON'T clear existing state
    if (this.state.country) {
      this.updateStatesForCountry(this.state.country, false); // false = don't clear state
    }
  }

  CompleteProfile = async t => {
    const {
      name,
      address,
      language,
      currency,
      zipcode,
      selectedImage,
      country,
      state,
    } = this.state;

    if (name || address || country || selectedImage || zipcode || language) {
      await userUpdateProfile(
        name,
        address,
        country,
        currency,
        selectedImage,
        zipcode,
        language,
        state,
      );
      const { User } = this.props;
    } else {
      Toast.show(ToastError(`${t("Field's_can't_be_empty")}`));
    }
  };

  changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => this.setState({ startLanguage: value }))
      .catch(err => console.log('error', err));
  };

  render() {
    const userData = this.props.route?.params?.userData;
    const { Data, t } = this.props;

    const {
      allCountries,
      name,
      countries,
      language,
      country,
      currency,
      selectedImage,
      zipcode,
      state,
      availableStates,
      isStateSelectionEnabled,
    } = this.state;

    return (
      <AppBackground back title={t('Edit_Profile')} notification={false}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingVertical: 20 }}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          {console.log(state, 'statestatestatestate')}

          {/* Country Selection ActionSheet */}
          <ActionSheetComponent
            ref={this.actionSheetCountryRef}
            title={t('Select_a_Country')}
            dataset={countries}
            onPress={item => {
              const currentSelectedCountry = item;
              const getDetailOfCurrentlySelectedCountry = allCountries?.filter(
                country => country?.name == currentSelectedCountry,
              );
              if (getDetailOfCurrentlySelectedCountry?.length > 0) {
                this.setState({
                  country: getDetailOfCurrentlySelectedCountry[0]?.name,
                  currency: getDetailOfCurrentlySelectedCountry[0]?.currency,
                });
                // Update states for the selected country and CLEAR state since user is changing country
                this.updateStatesForCountry(getDetailOfCurrentlySelectedCountry[0]?.name, true); // true = clear state
              }
            }}
          />
          {/* State Selection ActionSheet */}
          <ActionSheetComponent
            ref={this.actionSheetStateRef}
            title={t('State')}
            dataset={availableStates}
            onPress={item => {
              this.setState({ state: item });
            }}
          />

          {/* Language Selection ActionSheet */}
          <ActionSheetComponent
            ref={this.actionSheetLanguageRef}
            title={t('Select_a_Language')}
            dataset={languages}
            onPress={item => {
              this.setState({ language: item });
              if (item == 'Haitian Creole') {
                this.changeLanguage('HaitianCreole');
              } else {
                this.changeLanguage(item);
              }
            }}
          />

          <View
            style={{
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 40,
              marginTop: 20,
            }}>
            <View style={{ marginBottom: 16 }}>
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
                    this.setState({ selectedImage: { path, mime } });
                  }}>
                  <ProfileImage
                    name={Data?.name}
                    imageUri={
                      selectedImage?.path
                        ? selectedImage?.path
                        : getUrl(Data?.profilePicture)
                    }
                    size={138}
                  />
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
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  </View>
                </CustomImagePicker>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'space-between',
              }}>
              {/* Name Input */}
              <CustomTextInputView
                maxLength={40}
                containerStyle={{
                  marginBottom: 18,
                  marginTop: 18,
                  width: width - 60,
                }}
                placeholder={!Data?.name ? `${'Enter_Name'}` : Data?.name}
                label={t('Name')}
                value={name}
                Onchange={value => this.setState({ name: value })}
              />

              {/* Language Selection */}
              <CustomTextInputView
                containerStyle={{
                  marginBottom: 18,
                  width: '120%',
                  alignSelf: 'center',
                }}
                placeholder={
                  !Data?.language ? `${t('Select_a_Language')}` : Data?.language
                }
                down={true}
                value={language ? language : Data?.language}
                editable={false}
                openActionSheet={() =>
                  this.actionSheetLanguageRef.current.show()
                }
              />

              {/* Country Selection */}
              <CustomTextInputView
                containerStyle={{
                  marginBottom: 18,
                  width: '120%',
                  alignSelf: 'center',
                }}
                placeholder={!Data?.country ? t('Country') : Data?.country}
                value={country}
                down={true}
                editable={false}
                openActionSheet={() =>
                  this.actionSheetCountryRef.current.show()
                }
              />

              {/* State Selection - Only enabled when country is selected */}
              <CustomTextInputView
                containerStyle={{
                  marginBottom: 18,
                  width: '120%',
                  alignSelf: 'center',
                  opacity: isStateSelectionEnabled ? 1 : 0.5,
                }}
                placeholder={
                  !isStateSelectionEnabled
                    ? t('Select_Country_First')
                    : !state
                      ? t('State')
                      : state
                }
                value={state}
                down={true}
                editable={false}
                openActionSheet={() => {
                  if (isStateSelectionEnabled) {
                    this.actionSheetStateRef.current.show();
                  } else {
                    Toast.show(ToastError(t('Please_select_country_first')));
                  }
                }}
              />

              {/* Currency and Zip Code Row */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: width - 60,
                }}>
                <CustomTextInputView
                  containerStyle={{
                    width: '45%',
                  }}
                  placeholder={
                    !Data?.currency ? t('str_Currency') : Data?.currency
                  }
                  value={currency}
                  editable={false}
                />
                <CustomTextInputView
                  maxLength={7}
                  containerStyle={{
                    width: '45%',
                  }}
                  placeholder={
                    !Data?.zip_code
                      ? `${t('Zip_code')}`
                      : Data?.zip_code?.toString()
                  }
                  type="number-pad"
                  value={zipcode?.toString()}
                  Onchange={value => this.setState({ zipcode: value })}
                />
              </View>
            </View>
            <View style={{ marginBottom: 10 }}>
              <CustomButton
                title={t('Update_Profile')}
                onPress={() => this.CompleteProfile(t)}
              />
            </View>
          </View>
        </ScrollView>
      </AppBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    User: state.user.userToken,
    Data: state.user.userData,
  };
};

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(EditeProfile);
