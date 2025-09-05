import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../config';
import Images from '../assets/Images';
const {width} = Dimensions.get('window');
import NavService from '../config';

const Categories = props => {
  const {title, image, price, onPress} = props;
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
          flex: 8,
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
          flex: 2,
          backgroundColor: Colors.darkGray,
          width: '100%',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            // flex: 6.8,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomLeftRadius: 20,
            maxWidth: '60%',
          }}>
          {/* <Text
              style={{
                color: Colors.white,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {title}
            </Text> */}
          <Text
            numberOfLines={2}
            style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: '600',
            }}>
            {title}
          </Text>
        </View>
        <View
          style={{
            // flex: 3.2,
            borderBottomRightRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            // maxWidth: '40%',
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: Colors.secondary,
              //   marginRight: 5,
            }}>
            {price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Categories;

const styles = StyleSheet.create({});
