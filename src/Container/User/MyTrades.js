import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import SwipeableRow from '../../components/SwipeableRow';
import AppBackground from '../../components/AppBackground';
import ProductDetails from '../../components/ProductDetails';
import {Colors, NavService, Shadows} from '../../config';
import {FeatureCurrentProduct, myTrades} from '../../redux/APIs';
import Icons from '../../assets/Icons';

const MyTrades = ({navigation}) => {
  const [selected, setSelected] = useState('Active');
  const [productData, setProductData] = useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    const focusListner = navigation.addListener('focus', async () => {
      await getTradesProducts();
    });
    return focusListner;
  }, []);

  useEffect(() => {
    getTradesProducts();
  }, [selected]);

  // Function to sort products by date (newest first)
  const sortProductsByDate = (products) => {
    if (!products || !Array.isArray(products)) return [];
    
    return products.sort((a, b) => {
      // Using updatedAt for sorting, but you can use createdAt if you prefer
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      
      // Sort in descending order (newest first)
      return dateB - dateA;
    });
  };

  async function getTradesProducts() {
    try {
      const data = await myTrades(selected);
      
      // Sort the data before setting it to state
      const sortedData = sortProductsByDate(data);
      setProductData(sortedData);
      
      console.log(sortedData, "sorted product data");
    } catch (error) {
      console.error('Error fetching trades:', error);
      setProductData([]);
    }
  }

  const featureProduct = async id => {
    try {
      await FeatureCurrentProduct(id);
      await getTradesProducts();
    } catch (error) {
      console.error('Error featuring product:', error);
    }
  };

  console.log('productData', productData, 'productData');

  return (
    <AppBackground product notification title={t('My_Trades')}>
      <View
        style={{
          height: Dimensions.get('window').height * 0.1,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => setSelected('Active')}
          style={{
            backgroundColor:
              selected == 'Active' ? Colors.primary : Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            height: Dimensions.get('window').height * 0.06,
            width: Dimensions.get('window').width * 0.42,
            borderRadius: 30,
            ...Shadows.shadow3,
          }}>
          <Text
            style={{
              color: selected == 'Active' ? Colors.white : Colors.grey,
              fontSize: 16,
              fontWeight: '600',
            }}>
            {t('Active')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected(`${t('Inactive')}`)}
          style={{
            backgroundColor:
              selected == `${t('Inactive')}` ? Colors.primary : Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            height: Dimensions.get('window').height * 0.06,
            width: Dimensions.get('window').width * 0.42,
            borderRadius: 30,
            ...Shadows.shadow3,
          }}>
          <Text
            style={{
              color:
                selected == `${t('Inactive')}` ? Colors.white : Colors.grey,
              fontSize: 16,
              fontWeight: '600',
            }}>
            {t('Inactive')}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={productData}
        contentContainerStyle={{
          marginTop: 14,
          paddingHorizontal: 3,
        }}
        renderItem={({item, index}) => (
          <SwipeableRow
            item={item}
            renderVisibleComponent={() => (
              <ProductDetails
                title={item?.product_title}
                price={item?.product_price}
                img={item?.product_picture[0]}
                date={item?.createdAt}
                location={item?.product_location?.coordinates}
                seller={item?.seller}
                address={item?.product_location?.location}
                type={item?.product_status}
                id={item?._id}
                is_featured={item?.is_featured}
                sellerInfo={item?.seller}
                featureProduct={id => {
                  featureProduct(id);
                }}
                EditePress={() => {
                  NavService.navigate('EditList', item);
                }}
                isFromMyTrades
              />
            )}
            onDelete={async () => await getTradesProducts()}
          />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              marginVertical: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            <Text style={{color: 'black'}}>{t('str_No_Data_Found')}</Text>
          </View>
        )}
        keyExtractor={(item, index) => item?._id || index.toString()}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 6,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            NavService.navigate('CreateList');
          }}
          activeOpacity={0.9}
          style={{
            backgroundColor: 'white',
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
        <Text style={{marginVertical: 4, color: Colors.black}}>{t('Add')}</Text>
      </View>
    </AppBackground>
  );
};

export default MyTrades;

const styles = StyleSheet.create({});