import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Image as ImageCompressor } from 'react-native-compressor';
import CustomBackground from '../../components/CustomBackground';
import CustomTextInputView from '../../components/CustomTextInputView';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import { Category, Location, Used } from '../../assets/Data/testData';
import { Shadows, Colors } from '../../config';
import Icons from '../../assets/Icons';
import CustomButton from '../../components/CustomButton';
import { ToastError } from '../../config/Helpers/Toast';
import { TranslateText } from '../../config/Helpers/googleTranslate';
import { createProduct } from '../../redux/APIs';
import ImagePicker from '../../components/ImagePicker';
import { locationData } from '../../config/locations/index';
import cities from '../../assets/Data/cities';
import countries from '../../assets/Data/countries';
const CreateList = () => {
  // PRODUCT ASSETS STATES //
  const { t, i18n } = useTranslation();

  const [Owner, setOwner] = useState(false);

  const actionSheetRef1 = React.useRef(null);
  const actionSheetCategoryRef = React.useRef(null);
  const actionSheetLocationRef = React.useRef(null);
  const actionSheetOfferRef = React.useRef(null);
  const actionSheetUsedRef = React.useRef(null);
  const citySheetUsedRef = React.useRef(null);
  const stateSheetUsedRef = React.useRef(null);
  const actionSheetCountryRef = React.useRef(null);

  // PRODUCT FEILDS STATES //
  const [title, setTitle] = useState('');
  const [multipleAssetsPost, setMultipleAssetsPost] = useState('');

  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [used, setUsed] = useState('');

  const [lat, setlat] = useState();
  const [long, setlong] = useState();
  const [venue, setVenue] = useState('');
  const [productCity, setProductCity] = useState('');

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');

  const countryOptions = Object.keys(cities);

  const subdivisionOptions = productCity ? cities[productCity] : [];
  const submitProduct = async () => {
    // console.log(state, 'statestatestatestate');
    if (title == '') {
      Toast.show(ToastError(`${t('Please_enter_product_title')}`));
    } else if (price == '') {
      Toast.show(ToastError(`${t('Please_enter_product_price')}`));
    } else if (category == '') {
      Toast.show(ToastError(`${t('Please_enter_product_category')}`));
    } else if (description == '') {
      Toast.show(ToastError(`${t('Please_enter_product_description')}`));
    }
    // else if (venue == '') {
    //   Toast.show(ToastError(`${t('Please_enter_product_address')}`));
    // }
    else if (productCity == '') {
      Toast.show(ToastError(`${t('Please_enter_product_location_city')}`));
    } else if (used == '') {
      Toast.show(ToastError(`${t('Please_enter_product_status')}`));
    } else if (multipleAssetsPost == '') {
      Toast.show(ToastError('Please provide product images'));
    } else {
      await createProduct(
        title,
        price,
        category,
        description,
        used,
        lat,
        long,
        venue,
        productCity,
        Owner ? 1 : 0,
        multipleAssetsPost,
        state,
      );
    }
  };
  const requestLocationPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: `${t('Nouvoprix_Location_Permission')}`,
          message: `${t(
            'Nouvoprix_needs_location_access_to_get_your_current_location',
          )}`,
          buttonNeutral: `${t('Ask_Me_Later')}`,
          buttonNegative: `${t('Cancel')}`,
          buttonPositive: `${t('OK')}`,
        },
      );
    } catch (err) {
      console.log(err);
    }
  };
  const updateImageInGallery = async (path, mime, type) => {
    let multipleImages = [];
    if (Array.isArray(path)) {
      const arr = path?.map(async item => {
        const result = await ImageCompressor.compress(item.path, {
          maxHeight: 400,
          maxWidth: 400,
          quality: 1,
        });
        let imageObject = {
          uri: result,
          name: `image${Date.now()}${item?.filename}.${item?.mime.slice(
            item?.mime.lastIndexOf('/') + 1,
          )}`,
          type: item?.mime,
          tempType: 'photo',
        };
        multipleImages.push(imageObject);
      });
      await Promise.all(arr);
      const mergeImagesWithExistingGalleryAssets = [
        ...multipleAssetsPost,
        ...multipleImages,
      ];
      setMultipleAssetsPost(mergeImagesWithExistingGalleryAssets);
    } else {
      const getExistingGalleryAssets = [...multipleAssetsPost];
      const imageObject = {
        uri: path,
        name: `image${Date.now()}.${mime.slice(mime.lastIndexOf('/') + 1)}`,
        type: mime,
        tempType: type,
      };
      getExistingGalleryAssets.push(imageObject);
      setMultipleAssetsPost(getExistingGalleryAssets);
    }
  };
  const remmoveAsset = currentProduct => {
    const cloneMultipleAssets = [...multipleAssetsPost];
    const removeTheSelectedAsset = cloneMultipleAssets.filter(
      item => item !== currentProduct,
    );
    setMultipleAssetsPost(removeTheSelectedAsset);
  };
  useEffect(() => {
    Platform.OS == 'android' && requestLocationPermission();
  }, []);
  // console.log(productCity, 'high spee');
  const statesForCountry = locationData[selectedCountry] || [];

  return (
    <CustomBackground
      back
      title={t('Create_Listing')}
      notification={false}
      Inapp={false}>
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <ActionSheetComponent
          ref={actionSheetCategoryRef}
          title={t('Select_a_Category')}
          dataset={Category}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
            console.log('ressss: ', result);
            setCategory(result);
          }}
        />
        <ActionSheetComponent
          ref={actionSheetLocationRef}
          title={t('Select_a_Location')}
          dataset={Location}
          onPress={item => {
            setLocation(item);
          }}
        />
        <ActionSheetComponent
          ref={actionSheetUsedRef}
          title={t('Select_Used')}
          dataset={Used}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
            setUsed(result);
          }}
        />


        {/* State Selection - Only enabled when country is selected */}
        {/* <CustomTextInputView
          containerStyle={{
            marginBottom: 18,
            width: '120%',
            alignSelf: 'center',
            opacity: isStateSelectionEnabled ? 1 : 0.5,
          }}
          placeholder={
            !true
              ? t('Select_Country_First')
              : !state
                ? t('State')
                : state
          }
          value={state}
          down={true}
          editable={false}
          openActionSheet={() => {
            if (true``) {
              this.actionSheetStateRef.current.show();
            } else {
              Toast.show(ToastError(t('Please_select_country_first')));
            }
          }}
        /> */}
        {/* <ActionSheetComponent
          ref={citySheetUsedRef}
          title={t('City')}
          dataset={countryOptions}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
            setProductCity(item);
          }}
        /> */}
        <ActionSheetComponent
          ref={actionSheetCountryRef}
          title={t('Select_a_Country')}
          dataset={countries}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
            setSelectedCountry(item);
            setState(''); // Reset state when country changes
            setProductCity(''); // Reset city when country changes
          }}
        />
        <ActionSheetComponent
          ref={stateSheetUsedRef}
          title={t('State')}
          dataset={statesForCountry}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
            setState(item);
          }}
        />
        <CustomTextInputView
          value={title}
          Onchange={value => setTitle(value)}
          containerStyle={{ color: Colors.grey }}
          placeholder={t('Product_Title')}
          maxLength={50}
        />
        <CustomTextInputView
          value={price}
          Onchange={value => setPrice(value)}
          containerStyle={{ color: Colors.grey }}
          placeholder={t('Price')}
          type={'number-pad'}
        />
        <CustomTextInputView
          placeholder={`${t('Select_Category')}`}
          down={true}
          value={category}
          editable={false}
          openActionSheet={() => actionSheetCategoryRef.current.show()}
          containerStyle={{ color: Colors.grey }}
        />
        <View
          style={{
            width: '98%',
            height: Dimensions.get('window').height * 0.18,
            alignSelf: 'center',
            borderRadius: 10,
            ...Shadows.shadow5,
            backgroundColor: Colors.white,
            paddingHorizontal: 10,
            padding: 8,
            marginBottom: 14,
          }}>
          <TextInput
            style={{
              height: Dimensions.get('window').height * 0.16,
              paddingLeft: Platform.OS === 'ios' ? 10 : 0,
              paddingTop: Platform.OS === 'ios' ? 10 : 0,
              fontSize: 15,
              fontWeight: '400',
              color: Colors.black,
            }}
            numberOfLines={20}
            textAlignVertical="top"
            multiline
            maxLength={276}
            value={description}
            onChangeText={value => setDescription(value)}
            placeholder={t('Decription')}
            placeholderTextColor={'#8B8888'}
          />
          <TouchableOpacity
            onPress={() => imageSelector()}
            style={{
              alignSelf: 'flex-end',
              height: 200,
              top: '58%',
              right: 14,
              marginTop: Platform.OS === 'ios' ? 18 : 0,
            }}
            activeOpacity={0.9}
          />
        </View>
        <View
          style={{
            ...Shadows.shadow3,
            // height: 50,
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
            placeholder={`${t('Enter_Location')} (${t('optional')})`}
            placeholderTextColor={Colors.grey}
            onPress={(data, details = null) => {
              const { formatted_address, geometry } = details;
              setlat(geometry?.location.lat);
              setlong(geometry?.location?.lng);
              setVenue(formatted_address);
            }}
            styles={{
              textInput: {
                backgroundColor: 'transparent',
                // flex: 1,
                height: 50,
                color: Colors?.grey,
              },
              description: { color: Colors?.black },
            }}
            textInputProps={{
              placeholderTextColor: Colors?.grey,
            }}
            query={{
              key: 'AIzaSyCdx6W3QLTKq8l4tEsirmAO_-Y7ysy5Bp8',
              language: 'en',
              types: 'premise',
            }}
          />
        </View>
        <CustomTextInputView
          placeholder={t('Country')}
          value={selectedCountry}
          down={true}
          editable={false}
          openActionSheet={() => actionSheetCountryRef.current.show()}
        />
        {/* <CustomTextInputView
          containerStyle={{
            width: '100%',
            color: Colors.grey,
          }}
          placeholder={t('City')}
          down={true}
          value={productCity}
          editable={false}
          openActionSheet={() => citySheetUsedRef.current.show()}
        /> */}
        {statesForCountry && (
          <CustomTextInputView
            containerStyle={{
              width: '100%',
              color: Colors.grey,
            }}
            placeholder={t('State')}
            down={true}
            value={state}
            editable={false}
            openActionSheet={() => stateSheetUsedRef.current.show()}
          />
        )}
        <CustomTextInputView
          value={productCity}
          Onchange={value => setProductCity(value)}
          containerStyle={{ color: Colors.grey }}
          placeholder={t('City')}
          maxLength={50}
        />
        {/* <CustomTextInputView
          value={productCity}
          Onchange={value => setProductCity(value)}
          containerStyle={{ color: Colors.grey }}
          placeholder={t('City')}
        /> */}
        {/* <CustomTextInputView
          value={state}
          Onchange={value => setState(value)}
          containerStyle={{ color: Colors.grey }}
          placeholder={t('State')}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <CustomTextInputView
            containerStyle={{
              width: '100%',
              color: Colors.grey,
            }}
            placeholder={t('Select_Status')}
            down={true}
            value={used}
            editable={false}
            openActionSheet={() => actionSheetUsedRef.current.show()}
          />
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {multipleAssetsPost &&
              multipleAssetsPost?.map((item, index) => (
                <View
                  style={{ position: 'relative', marginHorizontal: 5 }}
                  key={index + 1}>
                  <Image
                    style={{
                      height: Dimensions.get('window').height * 0.09,
                      width: Dimensions.get('window').height * 0.1,
                      borderRadius: 10,
                      resizeMode: 'contain',
                    }}
                    source={{ uri: item?.uri }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      remmoveAsset(item);
                    }}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        color: 'red',
                      }}>
                      x
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            <View>
              <ImagePicker
                onImageChange={(path, mime, type) => {
                  updateImageInGallery(path, mime, type);
                }}
                uploadVideo={false}
                isMultiple={true}>
                <View
                  style={{
                    height: Dimensions.get('window').height * 0.09,
                    width: Dimensions.get('window').height * 0.09,
                    borderRadius: 10,
                    backgroundColor: Colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Image
                    style={{ tintColor: Colors.white, height: 40, width: 40 }}
                    source={Icons.plus}
                  />
                </View>
              </ImagePicker>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 13,
                  marginVertical: 4,
                  marginLeft: 15,
                  fontWeight: '600',
                }}>
                {t('Add_Photos')}
              </Text>
            </View>
          </View>
        </ScrollView>
        {/* <TouchableOpacity
        onPress={()=> NavService.navigate('FeatureProduct')}
        activeOpacity={0.9}
        >
        <Text style={styles.feature}>Went to feature this product</Text>
        </TouchableOpacity> */}
        <View
          style={{
            marginTop: 14,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setOwner(!Owner)}
            style={{
              height: 28,
              width: 28,
              backgroundColor: Colors.white,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              ...Shadows.shadow3,
            }}>
            {Owner && (
              <View
                style={{
                  height: 16,
                  width: 16,
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                }}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 14,
              color: Colors.grey,
              fontWeight: '400',
            }}>
            {t('Are_you_the_first_owner?')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <CustomButton
            onPress={() => submitProduct()}
            title={t('Create_Listing')}
            buttonStyle={{
              marginTop: 14,
            }}
          />
        </View>
      </View>
    </CustomBackground>
  );
};

export default CreateList;

const styles = StyleSheet.create({
  feature: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginVertical: 16,
    fontSize: 16,
  },
  featureBtn: {
    backgroundColor: Colors.primary,
    width: '70%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 16,
  },
});
