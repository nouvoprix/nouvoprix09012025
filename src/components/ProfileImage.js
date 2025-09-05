import React from 'react';
import {Image, Text, View} from 'react-native';
import {Colors} from '../config';

const ProfileImage = ({
  size = 140,
  imageUri,
  innerAsset = false,
  name = ' ',
  style,
}) => {
  if (imageUri)
    return (
      <View
        style={{
          marginTop: -20,
          backgroundColor: Colors.primary,
          height: size,
          width: size,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 72.5,
        }}>
        <Image
          source={innerAsset ? imageUri : {uri: imageUri}}
          style={[
            {
              width: size,
              height: size,
              resizeMode: 'cover',
              borderRadius: 70,
            },
            style,
          ]}
        />
      </View>
    );
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 50,
          borderColor: Colors.primary,
          backgroundColor: Colors.secondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Text
        numberOfLines={1}
        style={{
          color: Colors.primary,
          fontSize: size * 0.75,
          fontWeight: '800',
          width: '100%',
          textAlign: 'center',
        }}>
        {name[0]?.toUpperCase()}
      </Text>
    </View>
  );
};

export default ProfileImage;
