import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AppBackground from '../../components/AppBackground';
import { NavService, Shadows } from '../../config';
import Colors from '../../config/colors';
import Icons from '../../assets/Icons';
import Images from '../../assets/Images';
import ProductDetails from '../../components/ProductDetails';
import URL from '../../config/Common';
import { getOtherProfile } from '../../redux/APIs';
import { useTranslation } from 'react-i18next';
import { getUrl } from '../../config/Helpers/getUrl';

const Profile = ({ route, navigation }) => {
  const profileData = route?.params;
  const [ProductData, setProductData] = useState();
  const { t } = useTranslation();

  const notOffer = true;
  const name = 'Jhony sincs';
  useEffect(() => {
    const get = async () => {
      const focusListner = navigation.addListener('focus', async () => {
        const data = await getOtherProfile(profileData?.id);
        console.log('data', data);
        setProductData(data);
      });
      return focusListner;
    };
    get();
  }, []);
  console.log('ProductData', ProductData);
  return (
    <AppBackground back title={profileData?.name} notification={false}>
      <View
        style={{
          height: 240,
          backgroundColor: Colors.white,
          marginTop: 10,
          borderRadius: 20,
          ...Shadows.shadow5,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image source={Icons.star} style={{height: 40, width: 40}} />
            <Text
              style={{
                fontSize: 16,
                color: Colors.grey,
                fontWeight: '500',
              }}>
              4.5
            </Text>
          </View> */}
        </View>
        <View
          style={{
            flex: 2,
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.primary,
              height: 100,
              width: 100,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              marginTop: 20,
            }}>
            <Image
              source={
                ProductData?.user?.image !== null
                  ? { uri: getUrl(ProductData?.user?.profilePicture) }
                  : Images.user
              }
              style={{
                height: 99,
                width: 99,
                borderRadius: 100,
              }}
            />
          </View>
          <Text
            style={{
              color: Colors.black,
              fontWeight: '700',
              fontSize: 18,
              marginVertical: 10,
            }}>
            {ProductData?.user?.name}
          </Text>

          <Text
            style={{
              color: Colors.grey,
              fontSize: 14,
              marginBottom: 4,
            }}>
            {ProductData?.user?.email}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={Icons.location}
              style={{
                height: 12,
                width: 12,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                color: Colors.grey,
                fontSize: 14,
              }}>
              {ProductData?.user?.address && ProductData?.user?.address}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {/* <TouchableOpacity
            onPress={() => {
              NavService.navigate('Chat', {
                receiver_id: profileData?.item?.receiver_id,
                product_id: profileData?.item?.product_id,
                notOffer,
                user_title: profileData?.item?.sender_name
                // product_price: ProductData[0]?.product_price,
                // product_title:ProductData[0]?.product_title ,
              });
            }}
            style={{
              alignItems: 'center',
              marginTop: 20,
              backgroundColor: Colors.white,
              borderRadius: 30,
              height: 42,
              width: 42,
              justifyContent: 'center',
              ...Shadows.shadow3,
            }}>
            <Image
              source={Icons.msg}
              style={{
                height: 28,
                width: 28,
                tintColor: Colors.primary,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <Text
        style={{
          marginLeft: 10,
          marginVertical: 16,
          color: Colors.black,
          fontSize: 18,
          textDecorationLine: 'underline',
          textDecorationColor: Colors.black,
        }}>
        {t('Description:')}
      </Text>
      <FlatList
        data={ProductData?.products}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProductDetails
            title={item?.product_title}
            price={item?.product_price}
            img={item?.product_picture[0]}
            date={item?.createdAt}
            location={item.product_location?.coordinates}
            address={item?.product_location?.location}
            type={item?.product_status}
            id={item?._id}
          />
        )}
      />
    </AppBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({});
