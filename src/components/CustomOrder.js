import {Dimensions, Image, StyleSheet,TouchableOpacity ,Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../config';
import Images from '../assets/Images';
const {width} = Dimensions.get('window');

const CustomOrder = props => {
  const {title, date, qty, image, onPress} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 10,
        height: 220,
        width: width / 2 - 30,
        borderRadius: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flex: 7.5,
          backgroundColor: 'blue',
          width: '100%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <Image
          source={image}
          style={{
            width: '100%',
            height: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
      </View>
      <View
        style={{
          flex: 2.5,
          backgroundColor: Colors.darkGray,
          width: '100%',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 7,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomLeftRadius: 20,
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: '500',
            }}>
            {title}
          </Text>
          <Text
            style={{
              color: Colors.white,
              fontSize: 14,
            }}>
            02 May,2022
          </Text>
        </View>
        <View
          style={{
            flex: 3,
            borderBottomRightRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              color: Colors.white,
            }}>
            Qty
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: Colors.primary,
            }}>
            {qty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomOrder;

const styles = StyleSheet.create({});
