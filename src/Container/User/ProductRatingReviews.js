import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AirbnbRating} from 'react-native-ratings';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import AppBackground from '../../components/AppBackground';
import CustomButton from '../../components/CustomButton';
import CustomRatingList from '../../components/CustomRatingList';
import Icons from '../../assets/Icons';
import {Colors, Shadows} from '../../config';
import {createRating, getRatingAndReviews} from '../../redux/APIs';

const ProductRatingReviews = ({route}) => {
  const productInfo = route?.params?.productDetail;
  const {t} = useTranslation();
  const user = useSelector(({user}) => user?.userData);
  const [ratingPopUp, setRatingPopUp] = useState(false);
  const [ratingAndReviews, setRatingAndReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isMineRated, setIsMineRated] = useState(false);
  const togglePopUp = () => {
    setRatingPopUp(!ratingPopUp);
  };
  const ratingCompleted = rating => {
    setRating(rating);
  };
  const getProductRatingAndReviews = async () => {
    const getRatingsAndReviews = await getRatingAndReviews(productInfo?._id);
    setRatingAndReviews(getRatingsAndReviews);
  };
  const checkMineRatingAndReviews = async () => {
    let checkGivenRatingMine = ratingAndReviews?.filter(
      rate => rate?.reviewBy?._id == user?._id,
    );
    if (checkGivenRatingMine?.length > 0) {
      setIsMineRated(true);
    } else {
      setIsMineRated(false);
    }
  };
  const submitRatingHandler = async () => {
    if (rating == 0)
      return Toast.show({
        text1: 'Error',
        text2: 'Please give rating',
        type: 'error',
        visibilityTime: 3500,
      });
    else if (review == '')
      return Toast.show({
        text1: 'Error',
        text2: 'Please give review',
        type: 'error',
        visibilityTime: 3500,
      });
    else {
      Keyboard.dismiss();
      togglePopUp();
      await createRating(rating, review, productInfo?._id);
      await getProductRatingAndReviews();
    }
  };
  useFocusEffect(
    useCallback(() => {
      getProductRatingAndReviews();
    }, []),
  );
  useEffect(() => {
    if (ratingAndReviews?.length > 0) {
      checkMineRatingAndReviews();
    }
  }, [ratingAndReviews]);
  return (
    <AppBackground back title={t('str_rating_reviews')} notification={false}>
      <FlatList
        data={ratingAndReviews}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View
            style={{
              marginVertical: '50%',
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            <Text style={{color: 'black'}}>
              {t('str_no_rating_reviews_found')}
            </Text>
          </View>
        )}
        renderItem={({item, index}) => (
          <CustomRatingList rating={item} index={index} />
        )}
      />
      {!isMineRated ? (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 22,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => togglePopUp()}
            style={{
              backgroundColor: 'white',
              height: Dimensions.get('window').height * 0.07,
              width: Dimensions.get('window').width * 0.14,
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
          <Text style={{marginVertical: 4}}>{t('Add')}</Text>
        </View>
      ) : null}
      <Modal
        isVisible={ratingPopUp}
        backdropOpacity={0.8}
        onBackButtonPress={togglePopUp}
        onBackdropPress={togglePopUp}>
        <Toast />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: '100%',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: Colors.border,
              backgroundColor: Colors.white,
            }}>
            <View
              style={{
                // backgroundColor: Colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                height: 65,
                width: '101%',
                marginLeft: -1,
                marginTop: -1,
              }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 20,
                  fontWeight: '700',
                }}>
                {t('str_Rating')}
              </Text>
            </View>
            <View style={{paddingHorizontal: 20, paddingVertical: 5}}>
              <AirbnbRating
                showRating={false}
                startingValue={rating}
                defaultRating={0}
                ratingCount={5}
                size={35}
                onFinishRating={ratingCompleted}
                ratingContainerStyle={{marginVertical: 0, paddingVertical: 0}}
                style={{marginVertical: 0, paddingVertical: 0}}
              />
              <View
                style={{
                  width: '98%',
                  height: Dimensions.get('window').height * 0.18,
                  alignSelf: 'center',
                  borderRadius: 10,
                  backgroundColor: Colors.white,
                  paddingHorizontal: 10,
                  padding: 8,
                  marginVertical: 14,
                  ...Shadows.shadow5,
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
                  blurOnSubmit={true}
                  value={review}
                  onChangeText={value => setReview(value)}
                  placeholder={t('str_Review')}
                  placeholderTextColor={'#8B8888'}
                />
              </View>
              <CustomButton
                title={t('SEND')}
                onPress={() => submitRatingHandler()}
                buttonStyle={{
                  width: Dimensions.get('window').width * 0.8,
                  marginBottom: 15,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppBackground>
  );
};
export default ProductRatingReviews;
