import React, {useState, useEffect} from 'react';
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
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import {
  Image as ImageCompressor,
  Video as VideoCompressor,
} from 'react-native-compressor';
import CustomBackground from '../../components/CustomBackground';
import CustomTextInputView from '../../components/CustomTextInputView';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import {Shadows, Colors, NavService} from '../../config';
import Icons from '../../assets/Icons';
import CustomButton from '../../components/CustomButton';
import {ToastError} from '../../config/Helpers/Toast';
import {
  editCampaign,
  getCampaignGoals,
  getAllCountries,
  getCampaignAdType,
  addCampaignGoals,
} from '../../redux/APIs';
import ImagePicker from '../../components/ImagePicker';
import languages from '../../assets/Data/languages';
import Images from '../../assets/Images';
import SwipeableRow from '../../components/SwipeableRow';

const EditAd = ({route}) => {
  // PRODUCT ASSETS STATES //
  const {t, i18n} = useTranslation();
  const currentCampaign = route?.params?.currentCampaign;
  console.log(
    'String(currentCampaign?.webisite_urls[0])?.split(',
    ')',
    String(currentCampaign?.webisite_urls[0])?.split(','),
    currentCampaign,
  );
  const actionSheetCampaignAdTypeRef = React.useRef(null);
  const actionSheetCampaignRegionRef = React.useRef(null);
  const actionSheetCampaignGoalRef = React.useRef(null);
  const actionSheetCampaignLanguageRef = React.useRef(null);

  // PRODUCT FEILDS STATES //
  const [campaignName, setCampaignName] = useState(
    currentCampaign?.campaign_name ? currentCampaign?.campaign_name : '',
  );
  const [campaignHeading, setCampaignHeading] = useState(
    currentCampaign?.campaign_headline
      ? currentCampaign?.campaign_headline
      : '',
  );
  const [campaignDescription, setCampaignDescription] = useState(
    currentCampaign?.campaign_description
      ? currentCampaign?.campaign_description
      : '',
  );
  const [selectedCampaignAdType, setSelectedCampaignAdType] = useState('');
  const [selectedCampaignAdTypeId, setSelectedCampaignAdTypeId] = useState(
    currentCampaign?.ad_type ? currentCampaign?.ad_type : '',
  );
  const [selectedCampaignRegion, setSelectedCampaignRegion] = useState(
    currentCampaign?.target_location?.region
      ? currentCampaign?.target_location?.region
      : '',
  );
  const [selectedCampaignGoal, setSelectedCampaignGoal] = useState(
    currentCampaign?.goal ? currentCampaign?.goal?.name : '',
  );
  const [selectedCampaignGoalId, setSelectedCampaignGoalId] = useState(
    currentCampaign?.goal ? currentCampaign?.goal?._id : '',
  );
  const [customCampaignGoal, setCustomCampaignGoal] = useState('');
  const [selectedCampaignLanguage, setSelectedCampaignLanguage] = useState(
    currentCampaign?.campaign_language
      ? currentCampaign?.campaign_language
      : '',
  );
  const [campaignUrls, setCampaignUrls] = useState(
    currentCampaign?.webisite_urls?.length > 0
      ? String(currentCampaign?.webisite_urls[0])?.split(',')
      : [''],
  );
  const [campaignVideoAsset, setCampaignVideoAsset] = useState(
    currentCampaign?.ad_video ? [currentCampaign?.ad_video] : [],
  );
  const [allCampaignRegions, setAllCampaignRegions] = useState([]);
  const [campaignRegions, setCampaignRegions] = useState([]);
  const [allCampaignGoals, setAllCampaignGoals] = useState([]);
  const [campaignGoals, setCampaignGoals] = useState([]);
  const [allCampaignAdTypes, setAllCampaignAdTypes] = useState([]);
  const [campaignAdTypes, setCampaignAdTypes] = useState([]);

  const submitCampagin = async () => {
    if (campaignName == '') {
      Toast.show(ToastError(`${t('str_Please_Enter_Campaign_Name')}`));
    } else if (campaignHeading == '') {
      Toast.show(ToastError(`${t('str_Please_Enter_Campaign_Heading')}`));
    } else if (campaignDescription == '') {
      Toast.show(ToastError(`${t('str_Please_Enter_Campaign_Description')}`));
    } else if (selectedCampaignAdType == '') {
      Toast.show(ToastError(`${t('str_Please_Select_Campaign_Ad_Type')}`));
    } else if (selectedCampaignRegion == '') {
      Toast.show(ToastError(`${t('str_Please_Select_Campaign_Region')}`));
    } else if (selectedCampaignGoal == '') {
      Toast.show(ToastError(`${t('str_Please_Select_Campaign_Goal')}`));
    } else if (
      String(selectedCampaignGoal).toLowerCase() == 'other goal' &&
      customCampaignGoal == ''
    ) {
      Toast.show(ToastError(`${t('str_Please_Enter_Custom_Campaign_Goal')}`));
    } else if (selectedCampaignLanguage == '') {
      Toast.show(ToastError(`${t('str_Please_Select_Campaign_Language')}`));
    } else if (campaignVideoAsset?.length == 0) {
      Toast.show(ToastError(`${t('str_Please_Select_Campaign_Video')}`));
    } else {
      let payload = {
        campaign_id: currentCampaign?._id,
        campaign_name: campaignName,
        campaign_headline: campaignHeading,
        campaign_description: campaignDescription,
        ad_type: selectedCampaignAdTypeId,
        region: selectedCampaignRegion,
        campaign_language: selectedCampaignLanguage,
        ad_video: campaignVideoAsset[0],
        goal_id: selectedCampaignGoalId,
      };
      if (campaignUrls?.length > 0 && campaignUrls[0] !== '') {
        payload['webisite_urls'] = campaignUrls;
      }
      if (
        String(selectedCampaignGoal).toLowerCase() == 'other goal' &&
        customCampaignGoal !== ''
      ) {
        const addGoalPayload = {name: customCampaignGoal};
        const newGoalId = await addCampaignGoals(addGoalPayload);
        payload['goal_id'] = newGoalId;
      }
      console.log('payload', payload);
      await editCampaign(payload);
    }
  };
  const updateImageInGallery = async (path, mime, type) => {
    let multipleImages = [];
    if (Array.isArray(path)) {
      const arr = path?.map(async item => {
        const result = await VideoCompressor.compress(item.path, {
          compressionMethod: 'auto',
        });
        let videoObject = {
          uri: result,
          name: `video${Date.now()}${item?.filename}.${item?.mime.slice(
            item?.mime.lastIndexOf('/') + 1,
          )}`,
          type: item?.mime,
        };
        multipleImages.push(videoObject);
      });
      await Promise.all(arr);
      const mergeImagesWithExistingGalleryAssets = [
        ...campaignVideoAsset,
        ...multipleImages,
      ];
      setCampaignVideoAsset(mergeImagesWithExistingGalleryAssets);
    } else {
      const getExistingGalleryAssets = [];
      console.log('path', path, 'mime', mime);
      const videoObject = {
        uri: path,
        name: `video${Date.now()}.${mime?.slice(mime.lastIndexOf('/') + 1)}`,
        type: mime,
      };
      getExistingGalleryAssets.push(videoObject);
      setCampaignVideoAsset(getExistingGalleryAssets);
    }
  };
  const remmoveAsset = currentProduct => {
    const cloneMultipleAssets = [...campaignVideoAsset];
    const removeTheSelectedAsset = cloneMultipleAssets.filter(
      item => item !== currentProduct,
    );
    setCampaignVideoAsset(removeTheSelectedAsset);
  };
  const fetchRegions = async () => {
    const countries = await getAllCountries();
    if (countries?.length > 0) {
      const allCountries = [];
      const result = await countries?.map(country => {
        allCountries?.push(country?.name);
      });
      await Promise.all(result);
      setAllCampaignRegions(countries);
      setCampaignRegions(allCountries);
    } else {
      setAllCampaignRegions([]);
      setCampaignRegions([]);
    }
  };
  const fetchGoals = async () => {
    const goals = await getCampaignGoals();
    if (goals?.length > 0) {
      const allGoals = [];
      const result = await goals?.map(goal => {
        allGoals?.push(goal?.name);
        // if (currentCampaign?.goal == goal?._id) {
        //   setSelectedCampaignGoal(goal?.name);
        // }
      });
      await Promise.all(result);
      allGoals?.push('Other Goal');
      setAllCampaignGoals(goals);
      setCampaignGoals(allGoals);
    } else {
      setAllCampaignGoals([]);
      setCampaignGoals([]);
    }
  };
  const fetchAdType = async () => {
    const adTypes = await getCampaignAdType();
    if (adTypes?.length > 0) {
      const allAdTypes = [];
      const result = await adTypes?.map(adType => {
        allAdTypes?.push(adType?.name);
        if (currentCampaign?.ad_type == adType?._id) {
          setSelectedCampaignAdType(adType?.name);
        }
      });
      await Promise.all(result);
      setAllCampaignAdTypes(adTypes);
      setCampaignAdTypes(allAdTypes);
    } else {
      setAllCampaignAdTypes([]);
      setCampaignAdTypes([]);
    }
  };
  useEffect(() => {
    fetchRegions();
    fetchGoals();
    fetchAdType();
  }, []);
  return (
    <CustomBackground
      back
      title={t('str_Edit_Ad')}
      notification={false}
      Inapp={false}>
      <View style={{flex: 1, marginHorizontal: 20}}>
        <ActionSheetComponent
          ref={actionSheetCampaignAdTypeRef}
          title={t('Select_a_Category')}
          dataset={campaignAdTypes}
          onPress={item => {
            const existingCampaignAdTypes = [...allCampaignAdTypes];
            const currentCampaignAdTypes = existingCampaignAdTypes?.filter(
              adType => adType?.name == item,
            );
            if (currentCampaignAdTypes?.length > 0) {
              setSelectedCampaignAdTypeId(currentCampaignAdTypes[0]?._id);
            }
            setSelectedCampaignAdType(item);
          }}
        />
        <ActionSheetComponent
          ref={actionSheetCampaignRegionRef}
          title={t('Select_a_Location')}
          dataset={campaignRegions}
          onPress={item => {
            setSelectedCampaignRegion(item);
          }}
        />
        <ActionSheetComponent
          ref={actionSheetCampaignGoalRef}
          title={t('Select_Used')}
          dataset={campaignGoals}
          onPress={item => {
            const existingCampaignGoals = [...allCampaignGoals];
            const currentCampaignGoal = existingCampaignGoals?.filter(
              goal => goal?.name == item,
            );
            if (currentCampaignGoal?.length > 0) {
              setSelectedCampaignGoalId(currentCampaignGoal[0]?._id);
            }
            setSelectedCampaignGoal(item);
          }}
        />
        <ActionSheetComponent
          ref={actionSheetCampaignLanguageRef}
          title={t('Select_a_Language')}
          dataset={languages}
          onPress={item => {
            setSelectedCampaignLanguage(item);
          }}
        />
        <CustomTextInputView
          value={campaignName}
          Onchange={value => setCampaignName(value)}
          containerStyle={{color: Colors.grey}}
          placeholder={t('str_Campaign_Name')}
          maxLength={30}
        />
        <CustomTextInputView
          value={campaignHeading}
          Onchange={value => setCampaignHeading(value)}
          containerStyle={{color: Colors.grey}}
          placeholder={t('str_Campaign_Heading')}
          maxLength={30}
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
            multiline={true}
            value={campaignDescription}
            onChangeText={value => setCampaignDescription(value)}
            placeholder={t('Decription')}
            placeholderTextColor={'#8B8888'}
            maxLength={256}
          />
        </View>
        <CustomTextInputView
          placeholder={t('str_Select_Campaign_Ad_Type')}
          down={true}
          value={selectedCampaignAdType}
          editable={false}
          openActionSheet={() => actionSheetCampaignAdTypeRef.current.show()}
          containerStyle={{color: Colors.grey}}
        />
        <CustomTextInputView
          placeholder={t('str_Select_Campaign_Region')}
          down={true}
          value={selectedCampaignRegion}
          editable={false}
          openActionSheet={() => actionSheetCampaignRegionRef.current.show()}
          containerStyle={{color: Colors.grey}}
        />
        <CustomTextInputView
          placeholder={t('str_Select_Campaign_Goal')}
          down={true}
          value={selectedCampaignGoal}
          editable={false}
          openActionSheet={() => actionSheetCampaignGoalRef.current.show()}
          containerStyle={{color: Colors.grey}}
        />
        {String(selectedCampaignGoal).toLowerCase() == 'other goal' ? (
          <CustomTextInputView
            value={customCampaignGoal}
            Onchange={value => setCustomCampaignGoal(value)}
            containerStyle={{color: Colors.grey}}
            placeholder={t('str_Other_Campaign_Goal')}
          />
        ) : null}
        <CustomTextInputView
          placeholder={t('str_Select_Campaign_Language')}
          down={true}
          value={selectedCampaignLanguage}
          editable={false}
          openActionSheet={() => actionSheetCampaignLanguageRef.current.show()}
          containerStyle={{color: Colors.grey}}
        />
        {campaignUrls?.map((url, index) => {
          return (
            <React.Fragment key={index + 1}>
              {index == 0 ? (
                <CustomTextInputView
                  value={url}
                  Onchange={value => {
                    const currentCampaignUrl = [...campaignUrls];
                    currentCampaignUrl[index] = value;
                    setCampaignUrls(currentCampaignUrl);
                  }}
                  containerStyle={{color: Colors.grey}}
                  placeholder={t('str_Campaign_Website_Url_Optional')}
                />
              ) : (
                <SwipeableRow
                  item={url}
                  renderVisibleComponent={() => (
                    <CustomTextInputView
                      value={url}
                      Onchange={value => {
                        const currentCampaignUrl = [...campaignUrls];
                        currentCampaignUrl[index] = value;
                        setCampaignUrls(currentCampaignUrl);
                      }}
                      containerStyle={{color: Colors.grey}}
                      placeholder={t('str_Campaign_Website_Url_Optional')}
                    />
                  )}
                  onDelete={() => {
                    const currentCampaignUrl = [...campaignUrls];
                    setCampaignUrls(
                      currentCampaignUrl?.filter((URL, i) => URL !== url),
                    );
                  }}
                  deleteProduct={false}
                  height={110}
                />
              )}
            </React.Fragment>
          );
        })}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            const currentCampaignUrl = [...campaignUrls];
            currentCampaignUrl.push('');
            setCampaignUrls(currentCampaignUrl);
          }}
          style={{
            height: Dimensions.get('window').height * 0.04,
            width: Dimensions.get('window').height * 0.04,
            borderRadius: 10,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
            marginLeft: 10,
          }}>
          <Image
            style={{tintColor: Colors.white, height: 20, width: 20}}
            source={Icons.plus}
          />
        </TouchableOpacity>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {campaignVideoAsset?.length > 0 &&
              campaignVideoAsset?.map((item, index) => (
                <View
                  style={{
                    position: 'relative',
                    marginHorizontal: 5,
                    top: -15,
                  }}
                  key={index + 1}>
                  <Image
                    style={{
                      height: Dimensions.get('window').height * 0.09,
                      width: Dimensions.get('window').height * 0.09,
                      borderRadius: 10,
                      resizeMode: 'contain',
                    }}
                    source={Images.videoIcon}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      remmoveAsset(item);
                    }}
                    activeOpacity={0.8}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: Colors.white,
                      borderRadius: 50,
                    }}>
                    <Image
                      style={{
                        height: Dimensions.get('window').height * 0.025,
                        width: Dimensions.get('window').height * 0.025,
                        borderRadius: 10,
                        resizeMode: 'contain',
                      }}
                      source={Icons.crossIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            <View>
              <ImagePicker
                uploadImage={false}
                onImageChange={(path, mime, type) => {
                  updateImageInGallery(path, mime, type);
                }}
                uploadVideo
                isMultiple={false}>
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
                    style={{tintColor: Colors.white, height: 40, width: 40}}
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
                {t('str_Add_Video')}
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
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <CustomButton
            onPress={() => submitCampagin()}
            title={t('str_Edit_Ad')}
            buttonStyle={{
              marginTop: 14,
            }}
          />
        </View>
      </View>
    </CustomBackground>
  );
};

export default EditAd;

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
