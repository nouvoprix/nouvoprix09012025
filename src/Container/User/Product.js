import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AppBackground from '../../components/AppBackground';
import ProductDetails from '../../components/ProductDetails';
import { Colors } from '../../config';
import { getAllProducts } from '../../redux/APIs';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ListFooterComponent from '../../components/ListFooterComponent';

const { height } = Dimensions.get('screen');
const PAGE_SIZE = 10;

const Product = ({ navigation, route }) => {
  const { products: initialProducts = { products: [] }, searchParams } = route.params || {};
  const [products, setProducts] = useState(initialProducts.products || []);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState((initialProducts.products || []).length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const fetchProducts = useCallback(async (pageNumber = 1, append = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getAllProducts(
        searchParams?.searchKeyword,
        searchParams?.searchCategory,
        searchParams?.searchPriceL,
        searchParams?.searchPriceG,
        searchParams?.searchCity,
        searchParams?.searchProductStatus,
        false,
        pageNumber,
        PAGE_SIZE,
        false,
        false,
        false,
      );

      const list = Array.isArray(response?.products) ? response.products : [];
      setProducts(prev =>
        append ? [...prev, ...list] : list
      );

      setHasNextPage(list.length === PAGE_SIZE);
      setPage(pageNumber);

    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchParams, loading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts(1, false);
    });
    return unsubscribe;
  }, [navigation, fetchProducts]);

  const handleEndReached = () => {
    if (!loading && hasNextPage) {
      fetchProducts(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, false);
  };

  return (
    <AppBackground back title={t('Product')} notification={false}>
      <FlatList
        data={products}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        keyExtractor={item => item._id?.toString()}
        renderItem={({ item }) => (
          <ProductDetails
            title={item.product_title}
            price={item.product_price}
            img={item.product_picture?.[0]}
            date={item.createdAt}
            location={item.product_location?.coordinates}
            address={item.product_location?.location}
            type={item.product_status}
            is_featured={item.is_featured}
            seller={item.seller}
            id={item._id}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={() =>
          !loading ? (
            <ListEmptyComponent
              viewStyle={styles.listEmpty}
              titleStyle={styles.textListEmpty}
              title={t('No_Product_Added_yet!')}
            />
          ) : null
        }
        ListFooterComponent={() => {
          if (loading && page > 1) {
            return (
              <View style={styles.footer}>
                <ActivityIndicator size="large" color={Colors.primary || 'gray'} />
              </View>
            );
          }

          if (!hasNextPage && products.length > 0) {
            return (
              <ListFooterComponent
                viewStyles={styles.footer}
                textStyles={styles.textListEmpty}
                text={t('str_No_More_Product_Found_At_The_Moment')}
              />
            );
          }

          return null;
        }}

        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </AppBackground>
  );
};

export default Product;

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
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loader: {
    marginVertical: 20,
  },
});
