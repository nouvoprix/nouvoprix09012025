import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Icons from '../assets/Icons';
import {Colors} from '../config';
import Images from '../assets/Images';

const MicroChat = props => {
  const {image, name, msg, onPress} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 360,
        maxHeight: 200,
        flexDirection: 'row',
        marginBottom: 10,
      }}>
      <View
        style={{
          flex: 2,
          paddingTop: 5,
        }}>
        <Image
          resizeMode="cover"
          style={{
            height: 58,
            width: 55,
            alignSelf: 'center',
            backgroundColor: 'blue',
            borderRadius: 20,
          }}
          source={image}
        />
      </View>
      <View
        style={{
          flex: 8,
          padding: 1,
        }}>
        <Text
          style={{
            // flex: 8,
            paddingLeft: 4,
            paddingTop: 2,
            maxWidth: 260,
            color: Colors.grey,
            fontSize: 14,
            fontWeight: '600',
          }}>
          {msg}
        </Text>
        <Text
          style={{
            paddingTop: 6,
            color: Colors.primary,
            fontSize: 12,
          }}>
          02:69 PM
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MicroChat;

const styles = StyleSheet.create({});
