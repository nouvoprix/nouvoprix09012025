import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Images from '../assets/Images';
import {Colors} from '../config';
const CustomCart = props => {
  const {image, price, title, qty, onPress} = props;

  const [quantity, setQuantity] = useState(qty);

  // const [ counter1 , setCounter1] = useState(2)
  // const [ counter2 , setCounter2] = useState(8)
  // const [ counter3 , setCounter3] = useState(4)
  return (
    <View
      style={{
        marginTop: 10,
        borderRadius: 10,
        borderBottomColor: Colors.grey,
        borderBottomWidth: 0.2,
        padding: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Image
          resizeMode="contain"
          source={Images.cup}
          style={{
            height: 76,
            width: 76,
            borderRadius: 18,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            paddingLeft: 10,
          }}>
          <Text
            style={{
              color: Colors.grey,
              fontSize: 16,
              fontWeight: '500',
            }}>
            {title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginLeft: 16,
            }}>
            <TouchableOpacity
              onPress={() => setQuantity(quantity - 1)}
              //  disabled = {quantity <2}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                height: 40,
                width: 40,
                backgroundColor: Colors.darkGray,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: Colors.white,
                }}>
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                margin: 10,
              }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                height: 40,
                width: 40,
                backgroundColor: Colors.darkGray,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: Colors.white,
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            fontSize: 22,
            color: Colors.secondary,
            fontWeight: 'bold',
            flex: 0.8,
            textAlign: 'right',
            // backgroundColor:"red"
          }}>
          ${price}
        </Text>
      </View>
    </View>
  );
};

export default CustomCart;

const styles = StyleSheet.create({});
