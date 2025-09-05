import React from 'react';
import {Text, View, Image, Dimensions} from 'react-native';
import Icons from '../assets/Icons';
import {Colors} from '../config';
const {width} = Dimensions.get('window');

export default function CustomTextInput(props) {
  return (
    <View style={{width: '100%', marginTop: 15, alignItems: 'center'}}>
      <View
        style={[
          {
            width: width - 60,
            height: 50,
            backgroundColor: Colors.white,
            paddingHorizontal: 15,
            borderRadius: 7,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          },
          props.containerStyle,
        ]}>
        {props?.icon && (
          <Image
            source={props?.icon}
            style={{
              width: 18,
              height: 18,
              resizeMode: 'contain',
              tintColor: Colors.icon,
            }}
          />
        )}
        <Text
          style={[
            {
              marginLeft: props?.icon ? 10 : 0,
              flex: 1,
              color: Colors.grey,
            },
            props.containerTextStyle,
          ]}>
          {props?.value?.length ? props?.value : props?.placeholder}
        </Text>
        {props?.rightIcon && (
          <Image
            source={Icons.dropdown}
            style={{
              width: 15,
              height: 15,
              resizeMode: 'contain',
              tintColor: Colors.secondary,
            }}
          />
        )}
      </View>
    </View>
  );
}
