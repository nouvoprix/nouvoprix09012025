import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useRef, useState } from 'react';
import SwipeableRow from './SwipeableRow';
import { Colors, NavService, Shadows } from '../config';
import CustomButton from './CustomButton';
import Icons from '../assets/Icons';
import moment from 'moment/moment';
import URL from '../config/Common';
import { useTranslation } from 'react-i18next';
import CampaignViewItem from './CampaignViewItem';
import { useSelector } from 'react-redux';
import { FeatureCurrentProduct } from '../redux/APIs';
import { getUrl } from '../config/Helpers/getUrl';

const { width, height } = Dimensions.get('screen');

const CustomProduct = ({
  img,
  price,
  title,
  location,
  date,
  type,
  EditePress,
  // featureProduct,
  is_featured,
  id,
  sellerInfo,
  address,
  productsLength,
  index,
  allCampaigns,
  deleteCampaignSelection,
  dataKey,
  product,
  getAllProductsListing = () => { },
}) => {
  const { t } = useTranslation();
  const widthItemLength = width - 25;
  const widthItemOffset = width - 25;
  const swiperRef = useRef(null);
  const currentLoggedInUser = useSelector(state => state.user.userData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productFeatured, setProductFeatured] = useState(is_featured);
  const handleIndexChanged = index => {
    setCurrentIndex(index);
    console.log('Current Index:', index);
  };
  const onVideoEndPress = index => {
    if (swiperRef.current) {
      const nextIndex = currentIndex + 1;
      if (index + 1 < allCampaigns.length) {
        swiperRef.current.scrollToIndex({ index: index + 1, animated: true });
        handleIndexChanged(index + 1);
      }
    }
  };
  const handleScrollForCampaignVideos = event => {
    console.log('handleScrollForCampaignVideos running');

    // Destructure values from the event
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const xOffset = contentOffset?.x ?? 0;
    const contentWidth = contentSize?.width ?? 1; // Prevent division by zero
    const screenWidth = layoutMeasurement?.width ?? width; // Use layout width or fallback to global width

    // Calculate the current index based on xOffset
    const currentIndex = Math.round(xOffset / (screenWidth - 45));
    console.log('Current index:', currentIndex);
    handleIndexChanged(currentIndex);
    // Calculate the expected offset for the current index
    const expectedOffset = currentIndex * (screenWidth - 45);

    // Check if the actual offset is close enough to the expected offset
    if (Math.abs(xOffset - expectedOffset) < 1) {
      console.log('Updating index:', currentIndex);
      // handleIndexChanged(currentIndex);
    }
  };
  const renderItem = ({ item, index }) => (
    <CampaignViewItem
      info={item}
      index={index}
      sliderIndex={currentIndex}
      onEditPress={() => NavService.navigate('EditAd', { currentCampaign: item })}
      onDeletePress={deleteCampaignSelection}
      containerStyles={{
        width: widthItemLength,
        marginHorizontal: 3,
      }}
      wrapperStyles={{
        height: height * 0.25,
      }}
      onVideoEndPress={onVideoEndPress}
    />
  );
  const featureProduct = async id => {
    const featuredProduct = await FeatureCurrentProduct(id);
    if (featuredProduct?.status == 1) {
      setProductFeatured(productFeatured == 0 ? 1 : 0);
    }
  };
  return (
    <>
      {currentLoggedInUser?._id == product?.seller?._id ? (
        <SwipeableRow
          item={product}
          renderVisibleComponent={() => (
            <View
              style={{
                height: 120,
                marginHorizontal: 14,
                marginBottom: 14,
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  NavService.navigate('ProductFeatures', {
                    _id: id,
                    location: location,
                  })
                }
                style={{
                  flex: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  ...Shadows.shadow3,
                  borderRadius: 10,
                }}>
                <Image
                  source={{ uri: getUrl(img) }}
                  style={{
                    resizeMode: 'contain',
                    height: Dimensions.get('window').height * 0.1,
                    width: Dimensions.get('window').width * 0.1,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  NavService.navigate('ProductFeatures', {
                    _id: id,
                    location: location,
                  })
                }
                style={{
                  flex: 7,
                  backgroundColor: Colors.white,
                  marginLeft: 10,
                  ...Shadows.shadow3,
                  borderRadius: 10,
                  padding: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    flex: 2,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: Colors.black,
                      fontWeight: '500',
                      maxWidth: 128,
                      textTransform: 'capitalize',
                    }}
                    numberOfLines={2}>
                    {title}
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.grey }}>
                    {moment(date).format('MMM DD YYYY')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    alignItems: 'center',
                    marginTop: 4,
                    flex: 3,
                  }}>
                  <Text style={{ color: 'black', textTransform: 'capitalize' }}>
                    {type}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      color: Colors.primary,
                    }}>
                    {sellerInfo?.currency} {price}
                  </Text>
                </View>

                {address && (
                  <View
                    style={{
                      flex: 2,
                      flexDirection: 'row',
                      paddingLeft: 10,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={Icons.location}
                      style={{ height: 10, width: 10 }}
                    />
                    <Text
                      style={{ paddingLeft: 4, width: 180, color: 'black' }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {address}
                    </Text>
                  </View>
                )}
                {currentLoggedInUser?._id == sellerInfo?._id ? (
                  <View
                    style={{
                      // width: '100%',
                      // height: '35%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      // backgroundColor: 'red',
                      marginTop: 10,
                      flex: 4,
                    }}>
                    {currentLoggedInUser?._id == sellerInfo?._id && (
                      <CustomButton
                        onPress={EditePress}
                        title={t('Edit')}
                        buttonStyle={{
                          width: '30%',
                          height: '78%',
                          backgroundColor: Colors.white,
                          marginLeft: 10,
                        }}
                        textStyle={{
                          color: Colors.black,
                          fontSize: 14,
                          fontWeight: '600',
                        }}
                      />
                    )}
                    {productFeatured == 0 &&
                      currentLoggedInUser?._id == sellerInfo?._id && (
                        <CustomButton
                          onPress={async () => await featureProduct(id)}
                          title={t('GetFeatured')}
                          buttonStyle={{
                            width: '40%',
                            height: '78%',
                            marginLeft: 12,
                          }}
                          textStyle={{
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: '600',
                          }}
                        />
                      )}
                    {productFeatured == 1 &&
                      currentLoggedInUser?._id == sellerInfo?._id && (
                        <CustomButton
                          disabled={true}
                          title={t('Featured')}
                          buttonStyle={{
                            width: '40%',
                            height: '78%',
                            marginLeft: 12,
                            backgroundColor: Colors.red,
                          }}
                          textStyle={{
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: '600',
                          }}
                        />
                      )}
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          )}
          onDelete={async () => await getAllProductsListing()}
        />
      ) : (
        <View
          style={{
            height: 120,
            marginHorizontal: 14,
            marginTop: 10,
            marginBottom: 14,
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              NavService.navigate('ProductFeatures', {
                _id: id,
                location: location,
              })
            }
            style={{
              flex: 3,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              ...Shadows.shadow3,
              borderRadius: 10,
            }}>
            <Image
              source={{ uri: getUrl(img) }}
              style={{
                resizeMode: 'contain',
                height: Dimensions.get('window').height * 0.1,
                width: Dimensions.get('window').width * 0.1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              NavService.navigate('ProductFeatures', {
                _id: id,
                location: location,
              })
            }
            style={{
              flex: 7,
              backgroundColor: Colors.white,
              marginLeft: 10,
              ...Shadows.shadow3,
              borderRadius: 10,
              padding: 4,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                flex: 2,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.black,
                  fontWeight: '500',
                  maxWidth: 128,
                  textTransform: 'capitalize',
                }}
                numberOfLines={2}>
                {title}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.grey }}>
                {moment(date).format('MMM DD YYYY')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                alignItems: 'center',
                marginTop: 4,
                flex: 3,
              }}>
              <Text style={{ color: 'black', textTransform: 'capitalize' }}>
                {type}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: Colors.primary,
                }}>
                {sellerInfo?.currency} {price}
              </Text>
            </View>

            {address && (
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  paddingLeft: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={Icons.location}
                  style={{ height: 10, width: 10 }}
                />
                <Text
                  style={{ paddingLeft: 4, width: 180, color: 'black' }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {address}
                </Text>
              </View>
            )}
            {/* {currentLoggedInUser?._id == sellerInfo?._id ? ( */}
            <View
              style={{
                // width: '100%',
                // height: '35%',
                flexDirection: 'row',
                alignItems: 'center',
                // backgroundColor: 'red',
                // marginTop: 8,
                flex: 4,
              }}>
              {currentLoggedInUser?._id == sellerInfo?._id && (
                <CustomButton
                  onPress={EditePress}
                  title={t('Edit')}
                  buttonStyle={{
                    width: '30%',
                    height: '78%',
                    backgroundColor: Colors.white,
                    marginLeft: 10,
                  }}
                  textStyle={{
                    color: Colors.black,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                />
              )}
              {productFeatured == 0 &&
                currentLoggedInUser?._id == sellerInfo?._id && (
                  <CustomButton
                    onPress={async () => await featureProduct(id)}
                    title={t('GetFeatured')}
                    buttonStyle={{
                      width: '40%',
                      height: '78%',
                      marginLeft: 12,
                    }}
                    textStyle={{
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  />
                )}
              {productFeatured == 1 && (
                <CustomButton
                  disabled={true}
                  title={t('Featured')}
                  buttonStyle={{
                    width: '40%',
                    height: '78%',
                    marginLeft: 12,
                    backgroundColor: Colors.red,
                  }}
                  textStyle={{
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                />
              )}
            </View>
            {/* // ) : null} */}
          </TouchableOpacity>
        </View>
      )}

      {((productsLength == 1 && index == 0) ||
        (productsLength == 2 && index == 0) ||
        (productsLength >= 3 && index == 2)) &&
        allCampaigns?.length > 0 ? (
        <>
          <View
            style={{
              // height: height * 0.4,
              // marginHorizontal: 10,
              paddingHorizontal: 10,
              // width: width - 30,
              marginTop: 8,
              // flexDirection: 'row',
            }}>
            {/* <Swiper
              ref={swiperRef}
              dotColor={Colors.grey}
              activeDotColor={Colors.primary}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              buttonWrapperStyle={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
                position: 'absolute',
                top: -30,
                left: 0,
                flex: 1,
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              // scrollEnabled={false}
              onIndexChanged={handleIndexChanged}
              // showsButtons
            >
              {allCampaigns?.map((item, index) => {
                return (
                  <CampaignViewItem
                    info={item}
                    index={index}
                    sliderIndex={currentIndex}
                    onEditPress={() =>
                      NavService.navigate('EditAd', {currentCampaign: item})
                    }
                    onDeletePress={deleteCampaignSelection}
                    onVideoEndPress={() => swiperRef.current.scrollBy(1)}
                  />
                );
              })}
            </Swiper> */}

            <FlatList
              ref={swiperRef}
              data={allCampaigns}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              getItemLayout={(data, index) => ({
                length: widthItemLength,
                offset: widthItemOffset * index,
                index,
              })}
              onScroll={handleScrollForCampaignVideos}
            />
          </View>
        </>
      ) : null}
    </>
  );
};

export default CustomProduct;

const styles = StyleSheet.create({});
