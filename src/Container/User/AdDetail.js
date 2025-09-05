import React, {useEffect, useState} from 'react';
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
  FlatList,
} from 'react-native';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';
import {ImageGallery} from '@georstat/react-native-image-gallery';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import AppBackground from '../../components/AppBackground';
import {Colors, Common, NavService, Shadows} from '../../config';
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
import VideoPlayer from '../VideoPlayer/videoPlayer';
import {openLink} from '../../config/Helpers/BrowserUrl';
import NativeVideoPlayer from '../../components/NativeVideoPlayer';
import { getUrl } from '../../config/Helpers/getUrl';

const {width, height} = Dimensions.get('window');
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS == 'android'
  ? 'ca-app-pub-4034911003466058/2074395732'
  : 'ca-app-pub-4034911003466058/6842942031';

const AdDetail = props => {
  const campaignDetail = props?.route?.params?.info;
  const [itemsData, setItemsData] = useState(null);
  const [campaignWebsiteUrls, setCampaignWebsiteUrls] = useState(
    campaignDetail?.webisite_urls?.length > 0
      ? String(campaignDetail?.webisite_urls[0])?.split(',')
      : [],
  );
  const [productUpdate, setproductUpdate] = useState();
  const [productTitle, setProductTitle] = useState('');
  const [productType, setProductType] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productGalleryImages, setProductGalleryImages] = useState([]);
  const [toggleProductGallery, setToggleProductGallery] = useState(false);
  const {t, i18n} = useTranslation();
  useEffect(() => {
    // getProductDetailFeatured();
  }, []);
  const offered = false;
  //  async function getProductDetails() {
  //     await getProductInfo(_id)
  //   }
  async function getProductDetailFeatured() {
    // const item = await Productfeatured(_id);
    const item = await getProductInfo(campaignDetail?._id);
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
        url: URL.socketURL + item,
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
  console.log('itemsData', itemsData);
  return (
    <AppBackground back title={t('Product_Detail')} notification={false}>
      <View
        style={{
          width: Dimensions.get('screen').width * 0.9,
          height: Dimensions.get('screen').height * 0.35,
          alignSelf: 'center',
          borderRadius: 25,
        }}>
        {/* <VideoPlayer
          style={styles.videoPlayer}
          source={{
            uri: Common.assetURL + campaignDetail?.ad_video,
            // uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          }} // Can be a URL or a local file.
        /> */}
        <NativeVideoPlayer
          videoUrl={campaignDetail?.ad_video}
          style={styles.videoPlayer}
        />
      </View>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}>
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
              maxWidth: Dimensions.get('screen').width * 0.6,
              textTransform: 'capitalize',
            }}
            numberOfLines={2}>
            {campaignDetail?.campaign_headline}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '300',
              maxWidth: Dimensions.get('screen').width * 0.3,
              color: Colors.primary,
              textTransform: 'capitalize',
            }}
            numberOfLines={2}>
            {campaignDetail?.campaign_name}
          </Text>
        </View>

        <View>
          {/* <Text
            numberOfLines={4}
            style={{
              fontSize: 13,
              color: Colors.black,
            }}>
            {t('Description:')}
          </Text> */}
          <Text
            style={{
              color: Colors.grey,
              fontSize: 13,
              // color: Colors.black,
              marginVertical: 8,
            }}>
            {campaignDetail?.campaign_description}
          </Text>
        </View>

        {campaignWebsiteUrls?.length > 0 ? (
          <FlatList
            data={campaignWebsiteUrls}
            renderItem={({item, index}) => {
              return (
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.primary,
                  }}
                  onPress={() => openLink(item)}>
                  {item}{' '}
                </Text>
              );
            }}
            keyExtractor={(item, index) => index?.toString()}
          />
        ) : null}

        {campaignDetail?.user_id?._id != Data?._id && (
          <View style={{marginTop: 10, alignItems: 'center'}}>
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
                activeOpacity={0.9}
                onPress={() =>
                  NavService.navigate(
                    'Profile',
                    (details = {
                      id: campaignDetail?.user_id?._id,
                      name: campaignDetail?.user_id?.name,
                      email: itemsData?.user_id?.email,
                      image: campaignDetail?.user_id?.profilePicture,
                    }),
                  )
                }
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Image
                  source={
                    campaignDetail?.user_id?.profilePicture
                      ? {
                          uri: getUrl(campaignDetail?.user_id?.profilePicture)
                        }
                      : Images.user
                  }
                  style={{height: 50, width: 50, borderRadius: 25}}
                />
                <View style={{marginLeft: 10}}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontWeight: '700',
                      fontSize: 20,
                    }}>
                    {campaignDetail?.user_id?.name}
                  </Text>
                  {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={Icons.star} style={{width: 16, height: 16}} />
                  <Text style={{marginLeft: 3, fontSize: 12}}>4.7</Text>
                </View> */}
                </View>
              </TouchableOpacity>
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
      </ScrollView>
    </AppBackground>
  );
};

export default AdDetail;

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
  videoPlayer: {
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.35,
  },
});
