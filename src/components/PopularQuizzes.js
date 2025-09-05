import React from 'react';
import {Text, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import {Colors, Shadows} from '../config';
const {width} = Dimensions.get('window');

export default PopularLessons = ({
  title,
  image,
  onPress = () => {},
  left,
  last,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: (width - 62) / 2,
        height: (width - 62) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
        marginLeft: left ? 3 : 0,
        marginRight: last ? 3 : 20,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 5,
        ...Shadows.shadow3,
      }}>
      <View
        style={{
          width: '100%',
          height: '63%',
          padding: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={image}
          style={{
            height: '70%',
            width: '70%',
            marginTop: 15,
            resizeMode: 'contain',
          }}
        />
      </View>
      <View
        style={{
          width: '70%',
          height: '37%',
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '500',
            color: Colors.secondary,
          }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
