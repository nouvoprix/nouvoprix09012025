import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Colors, NavService, Shadows, Common} from '../config';
import {
  TranslateText,
  GetSelectedLanguage,
} from '../config/Helpers/googleTranslate';
import CustomButton from './CustomButton';
import Icons from '../assets/Icons';
import moment from 'moment';

const ProductDetails = ({
  img,
  price,
  title,
  location,
  address,
  date,
  type,
  seller,
  id,
  is_featured,
  sellerInfo,
  featureProduct = () => {},
  EditePress = () => {},
  isFromMyTrades = false,
}) => {
  const {t, i18n} = useTranslation();
  const currentLoggedInUser = useSelector(state => state.user.userData);
  const [productTitle, setProductTitle] = useState('');
  const [productType, setProductType] = useState('');

  const getTranslatedText = async (text, type) => {
    const result = await TranslateText(text, GetSelectedLanguage(i18n));
    if (type == 'title') {
      setProductTitle(result);
    }
    if (type == 'type') {
      setProductType(result);
    }
  };
  useEffect(() => {
    getTranslatedText(title, 'title');
    getTranslatedText(type, 'type');
  }, []);
  return (
    <View
      style={{
        // height: Dimensions.get("window").height * 0.12,
        marginBottom: 14,
        flexDirection: 'row',
        // height: 120,
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
          borderRadius: 10,
          paddingVertical: 25,
          paddingHorizontal: 5,
          ...Shadows.shadow3,
        }}>
        <Image
          source={{ uri: `${img}` }}
          style={{
            resizeMode: 'contain',
            height: 65,
            width: 100,
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
          borderRadius: 10,
          paddingVertical: 15,
          paddingHorizontal: 5,
          ...Shadows.shadow3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            flexWrap: 'wrap',
            flex: 3,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontWeight: '500',
              textTransform: 'capitalize',
            }}>
            {productTitle}
          </Text>
          <Text style={{fontSize: 12, color: Colors.grey}}>
            {moment(date).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            alignItems: 'center',
            flex: 2,
          }}>
          <Text style={{color: Colors.black, textTransform: 'capitalize'}}>
            {productType}
          </Text>
          <Text
            style={{fontSize: 20, fontWeight: '700', color: Colors.primary}}>
            {seller?.currency} {price}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 10,
            alignItems: 'center',
            flex: 2,
          }}>
          {address ? (
            <>
              <Image source={Icons.location} style={{height: 10, width: 10}} />
              <Text
                style={{paddingLeft: 4, width: 180, color: Colors.black}}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {address}
              </Text>
            </>
          ) : null}
        </View>
        {/* {currentLoggedInUser?._id == sellerInfo?._id && isFromMyTrades ? ( */}
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
          {currentLoggedInUser?._id == sellerInfo?._id && isFromMyTrades && (
            <CustomButton
              onPress={EditePress}
              title={t('Edit')}
              buttonStyle={{
                width: '30%',
                height: '65%',
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
          {is_featured == 0 &&
            currentLoggedInUser?._id == sellerInfo?._id &&
            isFromMyTrades && (
              <CustomButton
                onPress={() => featureProduct(id)}
                title={t('GetFeatured')}
                buttonStyle={{width: '40%', height: '65%', marginLeft: 12}}
                textStyle={{
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              />
            )}
          {is_featured == 1 && (
            <>
              <CustomButton
                title={t('Featured')}
                buttonStyle={{
                  width: '40%',
                  height: '65%', //100%
                  marginLeft: 12,
                  backgroundColor: Colors.red,
                }}
                textStyle={{
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: '600',
                }}
                disabled={true}
              />
              {/* <Text
                    style={{
                      paddingLeft: 8,
                      color: Colors.red,
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {t('Featured')}
                  </Text> */}
            </>
          )}
        </View>
        {/* ) : null} */}
        {/* {is_featured == 1 ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              paddingLeft: 8,
              marginTop: 6.2,
              flex: 3,
            }}>
            <CustomButton
              onPress={() =>
                NavService.navigate('ProductFeatures', {
                  _id: id,
                  location: location,
                })
              }
              title={t('Featured')}
              buttonStyle={{width: '40%', height: '85%'}}
              textStyle={{color: Colors.white, fontSize: 12}}
            />
          </View>
        ) : null} */}
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({});
