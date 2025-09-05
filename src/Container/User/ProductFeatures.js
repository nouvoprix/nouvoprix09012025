import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { BannerAd, TestIds, BannerAdSize } from 'react-native-google-mobile-ads';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import AppBackground from '../../components/AppBackground';
import { Colors, NavService, Shadows } from '../../config';
import URL from '../../config/Common';
import {
  ActiveProducts,
  getProductInfo,
  inActiveProducts,
} from '../../redux/APIs';
import CustomButton from '../../components/CustomButton';
import {
  TranslateText,
  GetSelectedLanguage,
} from '../../config/Helpers/googleTranslate';
import Images from '../../assets/Images';
import Icons from '../../assets/Icons';
import { getUrl } from '../../config/Helpers/getUrl';

const { width, height } = Dimensions.get('window');
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS == 'android'
    ? 'ca-app-pub-4034911003466058/2074395732'
    : 'ca-app-pub-4034911003466058/6842942031';

const ProductFeatures = props => {
  const { _id, location } = props.route.params;
  const [itemsData, setItemsData] = useState(null);
  const [featuredProductDays, setFeaturedProductDays] = useState(0);
  const [productUpdate, setproductUpdate] = useState();
  const [productTitle, setProductTitle] = useState('');
  const [productType, setProductType] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productGalleryImages, setProductGalleryImages] = useState([]);
  const [toggleProductGallery, setToggleProductGallery] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    getProductDetailFeatured();
  }, []);
  useEffect(() => {
    console.log('itemsData', itemsData);
    getTranslatedText(itemsData?.product_title, 'title');
    getTranslatedText(itemsData?.product_status, 'type');
    getTranslatedText(itemsData?.product_category, 'category');
    getTranslatedText(itemsData?.product_description, 'description');
    saturateProductImges();
    if (itemsData !== null && itemsData?.is_featured == 1) {
      var given = moment(itemsData?.feature_end, 'YYYY-MM-DD');
      var current = moment().startOf('day');
      //Difference in number of days
      moment.duration(given.diff(current)).asDays();
      console.log('result', moment.duration(given.diff(current)).asDays());
      setFeaturedProductDays(moment.duration(given.diff(current)).asDays());
    }
  }, [itemsData]);
  const offered = false;
  //  async function getProductDetails() {
  //     await getProductInfo(_id)
  //   }
  async function getProductDetailFeatured() {
    // const item = await Productfeatured(_id);
    const item = await getProductInfo(_id);
    setItemsData(item);
  }
  const Data = useSelector(state => state.user.userData);
  const Info = Data?.data;

  const toggleGallery = () => {
    setToggleProductGallery(!toggleProductGallery);
  };
  const saturateProductImges = async () => {
    let images = [];
    const result = itemsData?.product_picture?.map((item, index) => {
      images.push({
        id: index,
        url: getUrl(item),
      });
    });
    await Promise.all(result);
    setProductGalleryImages(images);
  };
  const SubmitChoice = async () => {
    const data = await inActiveProducts(_id);
    setproductUpdate(data?.data);
    getProductDetailFeatured();
  };
  const SubmitChoices = async () => {
    const data = await ActiveProducts(_id);
    setproductUpdate(data?.data);
    getProductDetailFeatured();
  };
  const getTranslatedText = async (text, type) => {
    const result = await TranslateText(text, GetSelectedLanguage(i18n));
    if (type == 'title') {
      setProductTitle(result);
    }
    if (type == 'type') {
      setProductType(result);
    }
    if (type == 'category') {
      setProductCategory(result);
    }
    if (type == 'description') {
      setProductDescription(result);
    }
  };
  const renderHeaderComponent = () => {
    return (
      <TouchableOpacity
        onPress={toggleGallery}
        activeOpacity={0.9}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginTop: 40,
        }}>
        <Image
          source={Icons?.crossIcon}
          style={{
            width: width * 0.08,
            height: 30,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <AppBackground back title={t('Product_Detail')} notification={false}>
      <ImageGallery
        close={toggleGallery}
        isOpen={toggleProductGallery}
        images={productGalleryImages}
        renderHeaderComponent={renderHeaderComponent}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 19,
              color: Colors.black,
              fontWeight: '700',
            }}>
            {productTitle}
          </Text>
          <Text
            style={{ fontSize: 20, fontWeight: '700', color: Colors.primary }}>
            {itemsData?.seller?.currency} {`${itemsData?.product_price}`}
          </Text>
        </View>

        <View
          style={{
            ...Shadows.shadow3,
            height: height * 0.25,
            marginTop: 8,
            borderRadius: 10,
            flexDirection: 'row',
          }}>
          {itemsData?.product_picture?.length > 0 ? (
            <Swiper
              dotColor={Colors.grey}
              activeDotColor={Colors.primary}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              buttonWrapperStyle={{ marginBottom: 10 }}
              showsButtons>
              {itemsData?.product_picture?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      if (productGalleryImages?.length > 0) {
                        toggleGallery();
                      }
                    }}>
                    <Image
                      key={index + 1}
                      source={{ uri: getUrl(item) }}
                      resizeMode="cover"
                      style={{
                        width: width - 40,
                        height: 220,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </Swiper>
          ) : null}
        </View>

        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              marginBottom: 8,
              fontWeight: '600',
              textDecorationLine: 'underline',
              textDecorationColor: Colors.black,
            }}>
            {t('Description:')}
          </Text>
          <Text
            numberOfLines={4}
            style={{ color: Colors.grey, marginVertical: 8 }}>
            {productDescription}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {t('Category')}
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {productCategory}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {t('Status')}
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
              textTransform: 'capitalize',
            }}>
            {productType}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {t('First_Owner')}
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {itemsData?.first_owner == 0 ? t('str_no') : t('str_yes')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {t('City')}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ flex: 1, color: Colors.black, fontSize: 14 }}>
            {itemsData?.product_city}
          </Text>
        </View>
        {itemsData?.product_location &&
          itemsData?.product_location?.location && (
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Text
                style={{
                  flex: 1,
                  color: Colors.black,
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                {t('Address')}
              </Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ flex: 1, color: Colors.black, fontSize: 14 }}>
                {itemsData?.product_location?.location}
              </Text>
            </View>
          )}
        {/* <View style={{flexDirection: 'row', marginTop: 4}}>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            Material
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            Wood,Leather
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 4}}>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            Color
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontSize: 14,
              fontWeight: '500',
            }}>
            White,Grey
          </Text>
        </View> */}
        {itemsData?.is_featured == 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                marginBottom: 8,
                fontWeight: '600',
                textDecorationLine: 'underline',
                textDecorationColor: Colors.black,
              }}>
              {t('Featured')}
            </Text>
            <Text>Product is been featured for {featuredProductDays} days</Text>
          </View>
        )}
        {itemsData?.product_location &&
          itemsData?.product_location?.location && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    marginBottom: 8,
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                    textDecorationColor: Colors.black,
                  }}>
                  {t('Location')}
                </Text>
                <Text>{t('Pickup')}</Text>
              </View>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={{
                    latitude: location[0],
                    longitude: location[1],
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  <Marker
                    draggable={false}
                    coordinate={{
                      latitude: location[0],
                      longitude: location[1],
                    }}></Marker>
                </MapView>
              </View>
            </>
          )}
        {itemsData?.seller?._id != Data?._id && (
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                marginVertical: 12,
                fontWeight: '600',
                textDecorationLine: 'underline',
                textDecorationColor: Colors.black,
                alignSelf: 'flex-start',
              }}>
              {t('Seller:')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  NavService.navigate(
                    'Profile',
                    (details = {
                      id: itemsData?.seller?._id,
                      name: itemsData?.seller?.email,
                      email: itemsData?.seller?.email,
                      image: itemsData?.seller?.profilePicture,
                    }),
                  )
                }
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image
                  source={
                    itemsData?.seller?.profilePicture
                      ? {
                        uri: getUrl(itemsData?.seller?.profilePicture),
                      }
                      : Images.user
                  }
                  style={{ height: 50, width: 50, borderRadius: 25 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontWeight: '700',
                      fontSize: 20,
                    }}>
                    {itemsData?.seller?.name}
                  </Text>
                  {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={Icons.star} style={{width: 16, height: 16}} />
                  <Text style={{marginLeft: 3, fontSize: 12}}>4.7</Text>
                </View> */}
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      NavService.navigate('Chat', {
                        details: {
                          receiver_id: itemsData?.seller?._id,
                          product_id: itemsData?._id,
                          product_price: itemsData?.product_price,
                          product_title: itemsData?.product_title,
                          product_picture: itemsData?.product_picture,
                          user_title: itemsData?.seller?.name,
                        },
                        offered,
                      })
                    }
                    style={{
                      height: 40,
                      width: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 20,
                      backgroundColor: Colors.white,
                      ...Shadows.shadow3,
                    }}>
                    <Image
                      source={Icons.msg}
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: Colors.primary,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      textAlign: 'right',
                      marginVertical: 6,
                      fontSize: 9,
                      color: 'black',
                    }}>
                    {t('Make_an_offer')}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      NavService.navigate('ProductRatingReviews', {
                        productDetail: itemsData,
                      })
                    }
                    style={{
                      height: 40,
                      width: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 20,
                      backgroundColor: Colors.white,
                      ...Shadows.shadow3,
                    }}>
                    <Image
                      source={Icons.star}
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: Colors.primary,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      textAlign: 'right',
                      marginVertical: 6,
                      fontSize: 9,
                      color: 'black',
                    }}>
                    {t('str_avg_rating')}: {itemsData?.seller?.avg_rating}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        <View
          style={{
            marginVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
          }}>
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
        {itemsData?.seller?._id == Data?._id && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomButton
              title={
                itemsData?.is_inactive == 0
                  ? `${t('In_Active')}`
                  : `${t('Active')}`
              }
              onPress={() =>
                itemsData?.is_inactive == 0 ? SubmitChoice() : SubmitChoices()
              }
              buttonStyle={{
                marginBottom: 20,
                marginTop: 30,
              }}
            />
          </View>
        )}
      </ScrollView>
    </AppBackground>
  );
};

export default ProductFeatures;

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
  mapContainer: {
    width: width,
    height: height * 0.25,
    overflow: 'hidden',
    marginTop: 20,
    alignSelf: 'center',
  },
});
