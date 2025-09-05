import React from 'react';
import {Dimensions, Text, Image, TouchableOpacity} from 'react-native';
import {Colors, Shadows} from '../config';
const {width} = Dimensions.get('screen');
import Icons from '../assets/Icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function CustomButton(props) {
  const {color, title, onPress, buttonStyle, textStyle, disabled, nextBtn} =
    props;
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          width: width - 60,
          height: 55,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color ? color : Colors.primary,
          marginTop: '1%',
          borderRadius: 18,
          ...Shadows.shadow5,
          flexDirection: 'row',
          borderRadius: 30,
          marginBottom: 15 + insets.bottom,
        },
        buttonStyle,
      ]}>
      <Text
        style={[
          {fontSize: 18, color: Colors.white, fontWeight: 'bold'},
          textStyle,
        ]}>
        {title}
      </Text>
      {nextBtn && (
        <Image
          resizeMode="contain"
          source={Icons.next}
          style={{
            height: 22,
            width: 22,
            marginLeft: '4%',
          }}
        />
      )}
    </TouchableOpacity>
  );
}
