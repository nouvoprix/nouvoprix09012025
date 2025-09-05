import React, {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Text, TouchableOpacity, View, Dimensions, FlatList } from 'react-native';
import { useDebounce } from '@uidotdev/usehooks';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SearchableDropdown from 'react-native-searchable-dropdown';
import CustomBackground from '../../components/CustomBackground';
import CustomTextInputView from '../../components/CustomTextInputView';
import { Colors, NavService, Shadows } from '../../config';
import CustomButton from '../../components/CustomButton';
import {
  getAllProducts,
  getSearchedProducts,
  getCampaigns,
  reportVideo,
} from '../../redux/APIs';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import { Category } from '../../assets/Data/testData';
import { TranslateText } from '../../config/Helpers/googleTranslate';
import Swiper from 'react-native-swiper';
import CampaignViewItem from '../../components/CampaignViewItem';
import cities from '../../assets/Data/cities';

const { width, height } = Dimensions.get('screen');

const Home = ({ navigation }) => {
  const { t } = useTranslation();
  const swiperRef = useRef(null);
  const widthItemLength = width - 47;
  const widthItemOffset = width - 47;
  const actionSheetCategoryRef = useRef(null);
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [oldProduct, setOldProduct] = useState(false);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pricel, setPricel] = useState('');
  const [priceg, setPriceg] = useState('');
  const [newProduct, setNewProduct] = useState(false);
  const [city, setCity] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [selectedCampaignForDeletion, setSelectedCampaignForDeletion] =
    useState(null);
  const [deleteCampaignPopupVisibility, setdeleteCampaignPopupVisibility] =
    useState(false);

  const countryOptions = Object.keys(cities);
  const citySheetUsedRef = React.useRef(null);

  let [key, setKey] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const debouncedSearchProduct = useDebounce(keyword, 300);

  const fetchSearchedProducts = async keyword => {
    const result = await getSearchedProducts(keyword);
    setProductSearchResults(result);
    setKey(!key);
  };
  const SubmitProductFilter = async () => {
    const itemProducts = await getAllProducts(
      keyword,
      category,
      pricel,
      priceg,
      city,
      oldProduct ? 'used' : newProduct ? 'new' : '',
      true,
      1,
    );
    console.log(itemProducts, city, 'itemProducts');
    if (itemProducts !== null) {
      let searchParams = {
        searchKeyword: keyword,
        searchCategory: category,
        searchPriceL: pricel,
        searchPriceG: priceg,
        searchCity: city,
        searchProductStatus: oldProduct ? 'used' : newProduct ? 'new' : '',
        searchProductLoader: true,
      };
      NavService.navigate('Product', { products: itemProducts, searchParams });
    }
    // }
  };
  // I watched the video again and noticed that the country ‘Barbuda’ is showing up in the city field. Instead, the country and state dropdowns should appear below.
  const getAllAdCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    setAllCampaigns(allCampaigns);
  };
  const deleteCampaignSelection = campaign => {
    setSelectedCampaignForDeletion(campaign);
    setdeleteCampaignPopupVisibility(true);
  };
  const handleIndexChanged = index => {
    setCurrentIndex(index);
    console.log('Current Index:', index);
  };
  useFocusEffect(
    useCallback(() => {
      setKeyword('');
    }, []),
  );
  // useLayoutEffect(() => {
  //   setAllCampaigns([]);
  //   fetchSearchedProducts('');
  //   getAllAdCampaigns();
  // }, []);
  useEffect(() => {
    const focusListner = navigation.addListener('focus', async () => {
      // fetchSearchedProducts('');
      // setAllCampaigns([]);
      setTimeout(() => {
        getAllAdCampaigns();
      }, 1200);
    });
    return () => {
      setCurrentIndex(0);
      focusListner();
    };
  }, []);
  useEffect(() => {
    fetchSearchedProducts(keyword);
  }, [debouncedSearchProduct]);
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
  return (
    <CustomBackground
      title={t('search')}
      product={true}
      notification={true}
      Inapp={false}>
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        {allCampaigns?.length > 0 ? (
          <View
            style={{
              // height: height * 0.35,
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
                paddingVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onIndexChanged={handleIndexChanged}
              // scrollEnabled={false}
              // showsButtons
            >
              {allCampaigns?.map((item, index) => {
                if (index == 0) {
                  return (
                    <CampaignViewItem
                      info={item}
                      index={index}
                      sliderIndex={currentIndex}
                      onEditPress={() =>
                        NavService.navigate('EditAd', {currentCampaign: item})
                      }
                      onDeletePress={deleteCampaignSelection}
                      containerStyles={{
                        marginHorizontal: 3,
                      }}
                      wrapperStyles={{
                        height: height * 0.21,
                      }}
                      onVideoEndPress={() => swiperRef.current.scrollBy(1)}
                    />
                  );
                }
              })}
            </Swiper> */}

            <FlatList
              ref={swiperRef}
              data={allCampaigns}
              renderItem={renderItem}
              // keyExtractor={({ item }) => item?._id.toString()}
              keyExtractor={({ item }) => `${Math.random() * 1000}sdbasb${Math.random() * 1000}`}
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
        ) : null}
        <View
          style={{
            marginTop: 14,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontWeight: '500',
              marginBottom: 13,
            }}>
            {t('What')}
          </Text>
          {/* <CustomTextInputView
            placeholder={t('What_are_you_looking_for?')}
            Onchange={text => setKeyword(text)}
          /> */}
          <SearchableDropdown
            selectedItem={selectedItem}
            onTextChange={text => {
              setKeyword(text);
              setSelectedItem({});
            }}
            //On text change listner on the searchable input
            onItemSelect={item => {
              setSelectedItem(item);
              setKeyword(item?.product_title);
            }}
            //onItemSelect called after the selection from the dropdown
            containerStyle={{ padding: 5 }}
            //suggestion container style
            textInputStyle={{
              //inserted text style
              padding: 20,
              borderWidth: 0,
              borderRadius: 32,
              borderColor: '#ccc',
              backgroundColor: Colors.white,
              color: Colors.black,
              ...Shadows.shadow3,
            }}
            itemStyle={{
              //single dropdown item style
              padding: 10,
              marginTop: 2,
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
            }}
            itemTextStyle={{
              //text style of a single dropdown item
              color: '#222',
            }}
            itemsContainerStyle={{
              //items container style you can pass maxHeight
              //to restrict the items dropdown hieght
              maxHeight: '80%',
            }}
            items={productSearchResults}
            //mapping of item array
            defaultIndex={2}
            //default selected item index
            placeholder={t('What_are_you_looking_for?')}
            //place holder for the search input
            placeholderTextColor={Colors.grey}
            // resetValue={false}
            // resPtValue={false}
            listProps={
              (style = {
                height: 100,
              })
            }
            //reset textInput Value with true and false state
            underlineColorAndroid="transparent"
          //To remove the underline from the android input
          />
        </View>
        <View
          style={{
            marginTop: 15,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontWeight: '500',
              marginBottom: 13,
            }}>
            {t('Where?')}
          </Text>
          <CustomTextInputView placeholder={t('City')}
            Onchange={text => setCity(text)}
          />

          {/* <ActionSheetComponent
            ref={citySheetUsedRef}
            title={t('City')}
            dataset={countryOptions}
            onPress={async item => {
              const result = await TranslateText(item, 'en');
              setCity(item);
            }}
          /> */}
          {/* <ActionSheetComponent
            ref={citySheetUsedRef}
            title={t('City')}
            dataset={countryOptions}
            onPress={async item => {
              const result = await TranslateText(item, 'en');
              setCity(result);
            }}
            remove={true}
            Onchanges={() => setCity('')}
          />
          <CustomTextInputView
            placeholder={t('City')}
            down={true}
            value={city}
            editable={false}
            openActionSheet={() => citySheetUsedRef.current.show()}
            containerStyle={{ color: Colors.grey }}
          /> */}
          {/* <CustomTextInputView
            placeholder={t('City')}
            Onchange={text => setCity(text)}
          /> */}
        </View>
        <View
          style={{
            marginTop: 15,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontWeight: '500',
              marginBottom: 13,
            }}>
            {t('Category?')}
          </Text>
          {/* <CustomTextInputView placeholder={'Select Category'} />
           */}

          <ActionSheetComponent
            ref={actionSheetCategoryRef}
            title={t('Select_Category')}
            dataset={Category}
            onPress={async item => {
              const result = await TranslateText(item, 'en');
              setCategory(result);
            }}
            remove={true}
            Onchanges={() => setCategory('')}
          />
          <CustomTextInputView
            placeholder={t('Select_Category')}
            down={true}
            value={category}
            editable={false}
            openActionSheet={() => actionSheetCategoryRef.current.show()}
            containerStyle={{ color: Colors.grey }}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            color: Colors.black,
            fontWeight: '500',
            marginTop: 15,
          }}>
          {t('Price:')}
        </Text>
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <CustomTextInputView
            placeholder={t('Minimal_Price')}
            containerStyle={{ width: '48%' }}
            type={'number-pad'}
            Onchange={text => setPriceg(text)}
          />
          <CustomTextInputView
            placeholder={t('Maximal_Price')}
            containerStyle={{ width: '48%' }}
            type={'number-pad'}
            Onchange={text => setPricel(text)}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            color: Colors.black,
            fontWeight: '500',
            marginTop: 15,
          }}>
          {t('Type:')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 16,
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setNewProduct(!newProduct);
                setOldProduct(false);
              }}
              style={{
                height: 28,
                width: 28,
                backgroundColor: Colors.white,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                ...Shadows.shadow3,
              }}>
              {newProduct && (
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
                paddingLeft: 10,
                fontSize: 16,
                fontWeight: '600',
                color: Colors.grey,
              }}>
              {t('New_Product')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setOldProduct(!oldProduct);
                setNewProduct(false);
              }}
              style={{
                height: 28,
                width: 28,
                backgroundColor: Colors.white,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                ...Shadows.shadow3,
              }}>
              {oldProduct && (
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
                paddingLeft: 10,
                fontSize: 16,
                fontWeight: '600',
                color: Colors.grey,
              }}>
              {t('Used_Product')}
            </Text>
          </View>
        </View>
        <CustomButton
          onPress={() => SubmitProductFilter()}
          buttonStyle={{
            alignSelf: 'center',
            marginTop: '8%',
            marginBottom: 40,
          }}
          title={t('View_Product')}
        />
      </View>
    </CustomBackground>
  );
};

export default Home;
