import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AppBackground from '../../components/AppBackground';
import CustomProduct from '../../components/CustomProducts';
import Icons from '../../assets/Icons';
import { Colors, NavService, Shadows } from '../../config';
import {
  getProducts,
  getAllProducts,
  getCampaigns,
  FeatureCurrentProduct,
} from '../../redux/APIs';
import ListFooterComponent from '../../components/ListFooterComponent';

const { height } = Dimensions.get('screen');

const MyProduct = ({ navigation }) => {
  const data = useSelector(state => state.user.userData);
  const [products, setProducts] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [dataKey, setDataKey] = useState(false);
  const [selectedCampaignForDeletion, setSelectedCampaignForDeletion] =
    useState(null);
  const [deleteCampaignPopupVisibility, setdeleteCampaignPopupVisibility] =
    useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    moreLoading: false,
    isListEnded: false,
  });
  const { t } = useTranslation();

  useEffect(() => {
    const focusListner = navigation.addListener('focus', async () => {
      await initializeData();
    });
    return () => {
      focusListner();
    };
  }, []);

  // Initialize data - reset everything and load fresh
  const initializeData = async () => {
    setProducts([]);
    setPage(1);
    setPaginationInfo({
      moreLoading: false,
      isListEnded: false,
    });

    await getAllAdCampaigns();
    await fetchProducts(1, true); // true means replace, not append
  };

  const getAllAdCampaigns = async () => {
    try {
      const allCampaigns = await getCampaigns();
      setAllCampaigns(allCampaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setAllCampaigns([]);
    }
  };

  const toggleDeleteCampaignPopupVisibilityPopup = () => {
    setdeleteCampaignPopupVisibility(!deleteCampaignPopupVisibility);
  };

  const deleteCampaignSelection = campaign => {
    setSelectedCampaignForDeletion(campaign);
    setdeleteCampaignPopupVisibility(true);
  };

  const featureProduct = async id => {
    try {
      await FeatureCurrentProduct(id);
      // Refresh the entire list after featuring a product
      await initializeData();
    } catch (error) {
      console.error('Error featuring product:', error);
    }
  };
  const fetchProducts = async (pageNum, shouldReplace = false) => {
    try {
      // Don't fetch if already loading or no more pages (unless it's a replace operation)
      if (!shouldReplace && (paginationInfo.moreLoading || paginationInfo.isListEnded)) {
        return null;
      }

      setPaginationInfo(prev => ({ ...prev, moreLoading: true }));

      const response = await getAllProducts(
        '',        // keyword
        '',        // product_category
        '',        // product_pricel
        '',        // product_priceg
        '',        // city
        '',        // product_status
        false,     // successToast
        pageNum,   // page
        10,        // limit
        false,     // apiLoader
        false,     // errorToast
        false      // defaultErrorToast
      );

      // Handle the new response structure
      if (!response || !response.products || response.products.length === 0) {
        setPaginationInfo({
          moreLoading: false,
          isListEnded: true,
        });
        return null;
      }

      const { products: itemProducts, pagination } = response;

      if (shouldReplace) {
        // Replace the entire products array (for refresh or initial load)
        setProducts(itemProducts);
        setPage(pageNum);
      } else {
        // Append to existing products (for pagination)
        setProducts(previousAllProducts => [
          ...previousAllProducts,
          ...itemProducts,
        ]);
        setPage(pageNum);
      }

      // Use backend pagination info
      setPaginationInfo({
        moreLoading: false,
        isListEnded: !pagination.hasNextPage,
      });

      console.log(`Page ${pageNum} loaded. Total items: ${pagination.totalProducts}, Has next: ${pagination.hasNextPage}`);
      return itemProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      setPaginationInfo({
        moreLoading: false,
        isListEnded: true,
      });
      return null;
    }
  };

  const loadMorePagination = async () => {
    if (paginationInfo?.isListEnded || paginationInfo?.moreLoading) return;

    const nextPage = page + 1;
    const result = await fetchProducts(nextPage, false);

    if (result) {
      setPage(nextPage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setPaginationInfo({
      moreLoading: false,
      isListEnded: false,
    });

    try {
      await getAllAdCampaigns();
      await fetchProducts(1, true); // Replace existing products
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getAllProductsListing = async () => {
    // This function is called from CustomProduct component
    // Refresh the entire list
    await initializeData();
  };

  return (
    <AppBackground
      marginHorizontal
      product={true}
      title={t('Home')}
      notification>
      {products?.length > 0 ? (
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                alignContent: 'center',
              }}>
              <Text style={{ color: 'black' }}>{t('No_Product_Added_yet!')}</Text>
            </View>
          )}
          renderItem={({ item, index }) => {
            return (
              <CustomProduct
                EditePress={() => {
                  NavService.navigate('EditList', item);
                }}
                title={item?.product_title}
                location={item?.product_location?.coordinates}
                address={item?.product_location?.location}
                price={item?.product_price}
                img={item?.product_picture[0]}
                date={item?.updatedAt}
                type={item?.product_status}
                is_featured={item?.is_featured}
                id={item?._id}
                sellerInfo={item?.seller}
                productsLength={products?.length}
                index={index}
                allCampaigns={allCampaigns}
                deleteCampaignSelection={deleteCampaignSelection}
                dataKey={dataKey}
                product={item}
                getAllProductsListing={getAllProductsListing}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => {
            return (
              <ListFooterComponent
                viewStyles={styles.listEmpty}
                textStyles={styles.textListEmpty}
                paginationInfo={paginationInfo}
                text={t('str_No_More_Product_Found_At_The_Moment')}
              />
            );
          }}
          onEndReached={loadMorePagination}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}>
          <Text style={{ color: 'black' }}>{t('No_Product_Added_yet!')}</Text>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 22,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            NavService.navigate('CreateList');
          }}
          style={{
            backgroundColor: Colors.white,
            height: Dimensions.get('window').height * 0.07,
            width: Dimensions.get('window').width * 0.15,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.shadow5,
          }}>
          <Image
            style={{
              height: Dimensions.get('window').height * 0.04,
              width: Dimensions.get('window').width * 0.07,
              resizeMode: 'contain',
            }}
            source={Icons.plus}
          />
        </TouchableOpacity>
        <Text style={{ marginVertical: 4, color: Colors.black }}>{t('Add')}</Text>
      </View>
    </AppBackground>
  );
};

export default MyProduct;

const styles = StyleSheet.create({
  listEmpty: {
    flex: 1,
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  textListEmpty: {
    color: Colors.black,
    fontSize: 14,
  },
});