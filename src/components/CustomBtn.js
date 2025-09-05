import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../config';

const CustomBtn = () => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        borderRadius: 30,
        position: 'absolute',
        top: 565,
        zIndex: 99,
        left: 290,
      }}>
      <Text
        style={{
          fontSize: 55,
          fontWeight: 'bold',
          color: Colors.white,
        }}>
        +
      </Text>
    </TouchableOpacity>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({});
