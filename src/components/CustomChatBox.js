import {StyleSheet, Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import Icons from '../assets/Icons';
import {Colors} from '../config';
import Images from '../assets/Images';

const MicroChat = props => {
  const {image, name, msg, onPress} = props;

  return (
   <View style={{
    alignSelf: "flex-end"
   }} >
     <TouchableOpacity
      onPress={onPress}
      style={{
        width: 360,
        maxHeight: 200,
        padding: 3,
        flexDirection: 'row',
        marginBottom: '4%',
        paddingLeft: 20
      }}>
      <View
        style={{
          flex: 8,
          padding: 1,
        }}>
        <View
          style={{
            width: '100%',
            backgroundColor: Colors.secondary,
            padding: 10,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            marginTop: 10,
          }}>
          <Text
            style={{
              // flex: 8,
              paddingLeft: 6,
              maxWidth: 260,
              color: Colors.grey,
              fontSize: 14,
              fontWeight: '600',
            }}>
            {msg}
          </Text>
        </View>
        <Text
          style={{
            paddingLeft: '70%',
            paddingTop: 6,
            color: Colors.primary,
            fontSize: 12,
          }}>
          02:69 PM
        </Text>
      </View>
      <View
        style={{
          flex: 2,
        }}>
        <Image
          resizeMode="cover"
          style={{
            height: 50,
            width: 50,
            alignSelf: 'center',
            borderRadius: 20,
          }}
          source={image}
        />
      </View>
    </TouchableOpacity>
   </View>
  );
};

export default MicroChat;

const styles = StyleSheet.create({});
