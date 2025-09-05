import React, {useEffect, useState} from 'react';
import {Text, Image, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AirbnbRating} from 'react-native-ratings';
import {
  TranslateText,
  GetSelectedLanguage,
} from '../config/Helpers/googleTranslate';
import {Colors, Shadows} from '../config';
import URL from '../config/Common';
import {getUrl} from '../config/Helpers/getUrl';

const CustomRatingList = ({rating, index}) => {
  const {t, i18n} = useTranslation();
  const [review, setReview] = useState('');

  const getTranslatedText = async (text, type) => {
    const result = await TranslateText(text, GetSelectedLanguage(i18n));
    if (type == 'review') {
      setReview(result);
    }
  };
  useEffect(() => {
    getTranslatedText(rating?.review, 'review');
  }, []);
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 30,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingVertical: 8,
        ...Shadows.shadow3,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <Image
          source={{uri: getUrl(rating?.reviewBy?.profilePicture)}}
          style={{
            borderRadius: 25,
            height: 45,
            width: 45,
          }}
        />
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              color: Colors.black,
              fontSize: 16,
              fontWeight: '700',
              textTransform: 'capitalize',
              paddingLeft: 8,
            }}>
            {rating?.reviewBy?.name}
          </Text>
          <Text
            style={{
              color: Colors.black,
              fontSize: 12,
              fontStyle: 'italic',
              paddingLeft: 8,
            }}>
            {review}
          </Text>
          <AirbnbRating
            showRating={false}
            defaultRating={rating?.rating}
            ratingCount={5}
            size={15}
            isDisabled
            ratingContainerStyle={{
              marginVertical: 0,
              paddingVertical: 0,
              marginHorizontal: 4,
            }}
            style={{marginVertical: 0, paddingVertical: 0}}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomRatingList;
