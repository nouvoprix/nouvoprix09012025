import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Icons from '../assets/Icons';
import {Colors} from '../config';
import Images from '../assets/Images';

const ChatComponent = props => {
  const {image, name, msg, onPress} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '100%',
        // height: 70,
        padding: 3,
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        borderBottomColor: Colors.grey,
        marginVertical: 10,
      }}>
      <View
        style={{
          flex: 2,
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
         
        }}>
        <Text
          style={{
            flex: 2.5,
            // paddingBottom: 6,
            fontSize: 16,
            fontWeight: '800',
            color: Colors.white,
            paddingLeft: 4,
            marginBottom: 2
          }}>
          {name}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            flex: 7.5,
            paddingLeft: 4,
            maxWidth: 280,
            color: Colors.grey,
            marginBottom: 10
          }}>
          {msg}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatComponent;

const styles = StyleSheet.create({});
