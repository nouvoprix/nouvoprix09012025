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
} from 'react-native';
import React, { useState } from 'react';
import CustomBackground from '../../components/CustomBackground';
import CustomTextInputView from '../../components/CustomTextInputView';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import { Category, Location, Offer, Used } from '../../assets/Data/testData';
import { Shadows, Colors, NavService } from '../../config';
import ActionSheet from 'react-native-actions-sheet';
import Icons from '../../assets/Icons';
import CustomButton from '../../components/CustomButton';
import Images from '../../assets/Images';
import { updateProduct } from '../../redux/APIs';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  Image as ImageCompressor,
  Video as VideoCompressor,
} from 'react-native-compressor';
import ImagePicker from '../../components/ImagePicker';
import { TranslateText } from '../../config/Helpers/googleTranslate';
import URL from '../../config/Common';
import { useTranslation } from 'react-i18next';
import { getUrl } from '../../config/Helpers/getUrl';

const EditeList = ({ route }) => {
  const { t } = useTranslation();

  const productsAvailable = route?.params;
  const [imageUri1, setImageuri1] = useState(
    productsAvailable?.product_picture,
  );
  const [Owner, setOwner] = useState(
    productsAvailable?.first_owner == 0 ? false : true,
  );
  const [imageType, setImageType] = useState('');
  const [des, setDes] = useState(productsAvailable?.product_description);
  const [title, setTitle] = useState(productsAvailable?.product_title);
  const [price, setPrice] = useState(String(productsAvailable?.product_price));

  const [lat, setlat] = useState(
    productsAvailable?.product_location?.coordinates[0],
  );
  const [venue, setVenue] = useState(
    productsAvailable?.product_location?.location,
  );
  const [productCity, setProductCity] = useState(
    productsAvailable?.product_city,
  );
  const [afterImagePath, setafterImagePath] = useState(
    productsAvailable?.product_picture,
  );

  const [multipleAssetsPost, setMultipleAssetsPost] = useState(
    productsAvailable?.product_picture,
  );

  const [long, setlong] = useState(
    productsAvailable?.product_location?.coordinates[1],
  );
  const [category, setCategory] = useState(productsAvailable?.product_category);
  const [location, setLocation] = useState('');
  const [offer, setOffer] = useState('');
  const [used, setUsed] = useState(productsAvailable?.product_status);
  const actionSheetRef1 = React.useRef(null);
  const actionSheetCategoryRef = React.useRef(null);
  const actionSheetLocationRef = React.useRef(null);
  const actionSheetOfferRef = React.useRef(null);
  const actionSheetUsedRef = React.useRef(null);

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
    // const currentImageWithPath = currentProduct?.uri;
    // const currentImageWithoutPath = currentProduct;
    // const currentImage = currentImageWithPath
    //   ? currentImageWithPath
    //   : currentImageWithoutPath;
    // const isCustomUrl = currentImageWithPath ? true : false;
    const cloneMultipleAssetBackend = [...multipleAssetsPost];
    const removeTheSelectAsset = cloneMultipleAssetBackend.filter(
      item =>
        // isCustomUrl ? item?.uri !== currentImage : item !== currentImage,
        item != currentProduct,
    );
    // // setMultipleAssetsPost(removeTheSelectedAsset);
    // setafterImagePath(removeTheSelectedAsset)

    const cloneafterGettingAssets = [...afterImagePath];
    const removeTheSelectedAsset = cloneafterGettingAssets.filter(
      item =>
        // isCustomUrl ? item?.uri !== currentImage : item !== currentImage,
        item !== currentProduct,
    );

    setafterImagePath(removeTheSelectedAsset);
    setMultipleAssetsPost(removeTheSelectAsset);
  };
  return (
    <CustomBackground
      back
      title={t('Edit_Product')}
      notification={false}
      Inapp={false}>
      <View
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginHorizontal: 20 }}>
        <ActionSheetComponent
          ref={actionSheetCategoryRef}
          title={t('Select_a_Category')}
          dataset={Category}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
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
        {/* <ActionSheetComponent
          ref={actionSheetOfferRef}
          title="Select a Offer"
          dataset={Offer}
          onPress={item => {
            setOffer(item);
          }}
        /> */}
        <ActionSheetComponent
          ref={actionSheetUsedRef}
          title={t('Select_Used')}
          dataset={Used}
          onPress={async item => {
            const result = await TranslateText(item, 'en');
            setUsed(result);
          }}
        />
        <CustomTextInputView
          placeholder={t('Title')}
          value={title}
          containerStyle={{ color: Colors.grey }}
          Onchange={text => setTitle(text)}
          maxLength={50}
        />
        <CustomTextInputView
          placeholder={t('Price')}
          defaultValue={price}
          // value={price}
          containerStyle={{ color: Colors.grey }}
          type={'number-pad'}
          Onchange={text => setPrice(text)}
        />
        <CustomTextInputView
          placeholder={t('Category')}
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
              color: 'black',
            }}
            numberOfLines={20}
            textAlignVertical="top"
            value={des}
            onChangeText={text => setDes(text)}
            // style={{padding:20}}
            multiline
            maxLength={276}
            // editable
            // numberOfLines={7}
            // maxLength={40}
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
            activeOpacity={0.9}>
            {/* <Image
              style={{width: 28, height: 28}}
              source={Images.Pictures.picture}
            /> */}
          </TouchableOpacity>
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
            placeholder={
              productsAvailable?.product_location &&
                productsAvailable?.product_location?.location
                ? productsAvailable?.product_location?.location
                : t('Enter_Location')
            }
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
                flex: 1,
                height: 50,
                color: Colors?.grey,
                marginHorizontal: 10,
              },
              description: { color: Colors?.grey },
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
        {/* <CustomTextInputView
          placeholder={'Phoneix'}
          location={true}
          value={location}
          editable={false}
          openActionSheet={() => actionSheetLocationRef.current.show()}
          containerStyle={{color: Colors.grey}}
        /> */}
        <CustomTextInputView
          value={productCity}
          Onchange={value => setProductCity(value)}
          containerStyle={{ color: Colors.grey }}
          placeholder={t('City')}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* <CustomTextInputView
            placeholder={'$200'}
            containerStyle={{
              width: '45%',
              color: Colors.black,
            }}
            down={true}
            value={offer}
            editable={false}
            openActionSheet={() => actionSheetOfferRef.current.show()}
          /> */}
          <CustomTextInputView
            containerStyle={{
              width: '100%',
              color: Colors.black,
            }}
            placeholder={t('Used')}
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
              multipleAssetsPost?.map((item, index) => {
                const imagePath = item?.uri ? item?.uri : item;
                const isCustomUrl = item?.uri ? true : false;
                return (
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
                      source={{
                        uri: isCustomUrl
                          ? getUrl(imagePath)
                          : imagePath,
                      }}
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
                );
              })}

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
          </View>
        </ScrollView>
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
                }}></View>
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
            onPress={() =>
              updateProduct(
                Owner ? 1 : 0,
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
                productsAvailable?._id,
                afterImagePath,
              )
            }
            title={t('Update_Listing')}
            buttonStyle={{
              marginTop: 14,
            }}
          />
        </View>
      </View>
    </CustomBackground>
  );
};

export default EditeList;

const styles = StyleSheet.create({});
