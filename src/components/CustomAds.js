import React from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Colors, Shadows} from '../config';
const {width} = Dimensions.get('window');

export default CustomAds = ({
  title,
  venderImage,
  image,
  onPress = () => {},
  left,
  last,
  description,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: width / 2,
        height: (width - 30) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.grey,
        // backgroundColor: 'blue',
        marginLeft: left ? 3 : 0,
        marginRight: last ? 3 : 20,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 5,
        ...Shadows.shadow3,
      }}>
      <View
        style={{
          width: '100%',
          height: '63%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={image}
          style={{
            height: '100%',
            width: '100%',
            resizeMode: 'cover',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: '37%',
          alignItems: 'center',
          backgroundColor: Colors.darkGray,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          flexDirection: 'row',
          paddingHorizontal: 5,
        }}>
        <Image
          style={{
            height: 45,
            width: 42,
            // backgroundColor: 'blue',
            borderRadius: 10,
          }}
          source={venderImage}
        />
        <View
          style={{
            marginLeft: '3%',
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 14,
              fontWeight: '700',
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontSize: 10,
              maxWidth: 130,
              marginTop: 3,
              color: Colors.white,
            }}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
