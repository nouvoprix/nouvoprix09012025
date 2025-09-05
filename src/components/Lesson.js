import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {Colors, Shadows} from '../config';
import Images from '../assets/Images';

const ChatComponent = ({item, onPress = () => {}}) => {
  const {title, status, image, score} = item;
  const statusColor = status?.includes('Finished') ? Colors.green : Colors.grey;
  const scoreColor = score < 50 ? Colors.icon : Colors.green;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        padding: 15,
        ...Shadows.shadow3,
        // marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.grey,
      }}>
      <Image
        source={Images.avatar}
        style={{
          width: 40,
          height: 40,
          backgroundColor: 'red',
          resizeMode: 'cover',
          borderRadius: 10,
          marginRight: 5,
        }}
      />
      <View style={{flex: 1, marginLeft: 6}}>
        <Text
          numberOfLines={status?.length ? 2 : 3}
          style={{
            color: Colors.white,
            fontSize: 14,
            fontWeight: '700',
          }}>
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: statusColor,
            fontSize: 14,
            marginTop: 5,
          }}>
          Hello world
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatComponent;
