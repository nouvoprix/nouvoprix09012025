import React, {useState} from 'react';
import {Text, View, Image, TextInput, Dimensions} from 'react-native';
import {Colors} from '../config';
const {width} = Dimensions.get('window');

export default function CustomQuizInput(props) {
  return (
    <View style={{width: '100%', marginTop: 15, alignItems: 'center'}}>
      <View
        style={{
          width: '100%',
          height: 50,
          paddingHorizontal: 15,
          borderRadius: 7,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.grey,
        }}>
        <TextInput
          style={{
            flex: 1,
            height: 50,
            color: Colors.secondary,
          }}
          placeholderTextColor={Colors.secondary}
          {...props}
        />
      </View>
    </View>
  );
}
