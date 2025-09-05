import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import {Colors} from '../config';

const CustomSender = () => {
  return (
    <View
      style={{
        width: Dimensions.get('window').width * 1,
        paddingVertical: 30,
        flexDirection: 'row',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: Colors.backgroundColor,
        // elevation: 12,
        shadowOpacity: 2,
      }}>
      <TextInput
        placeholder="Type Message here"
        placeholderTextColor={Colors.grey}
        style={{
          flex: 8,
          paddingLeft: '6%',
          maxWidth: 360,
          color: Colors.white,
        }}
      />
      <TouchableOpacity
        style={{
          flex: 2,
        }}>
        <Text
          style={{
            color: Colors.secondary,
            fontSize: 16,
            fontWeight: '500',
            paddingLeft: '8%',
          }}>
          SEND
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomSender;

const styles = StyleSheet.create({});
