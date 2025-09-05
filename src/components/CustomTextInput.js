import React, {useState} from 'react';
import {TouchableOpacity, View, Image, TextInput, Text} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {Colors, Icons, Shadows} from '../config';

export default function CustomTextInput(props) {
  const [hidden, setHidden] = useState(props?.isPassword);
  const {containerStyle, types, placeholder} = props;
  return (
    <View style={{width: '100%', marginTop: 20}}>
      {/* <Text style={{color: 'black', fontWeight: '600', fontSize: 14}}>
        {placeholder}
      </Text> */}
      <View
        style={[
          {
            alignSelf: 'center',
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
          },
          containerStyle,
        ]}>
        {props?.icon ? (
          <Image
            source={props?.icon}
            style={{
              width: 25,
              height: 25,
              resizeMode: 'contain',
              tintColor: Colors.text,
              marginTop: 5,
            }}
          />
        ) : null}
        <View
          style={{
            flex: 1,
            paddingBottom: 6,
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'red',
            // ...Shadows.shadow5,
          }}>
          <TextInput
            types={types}
            label={props.label}
            inputPadding={10}
            style={{
              flex: 1,
              ...Shadows.shadow3,
              // borderRadius: 12,
            }}
            inputStyle={{color: Colors.white, fontSize: 16}}
            labelStyle={{color: Colors.grey}}
            secureTextEntry={hidden}
            {...props}
          />
          {props.isPassword && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setHidden(!hidden)}></TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
export function ProfileTextInput(props) {
  const {icon} = props;
  return (
    <View
      style={{
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        marginTop: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
      }}>
      <Image
        source={icon}
        style={{width: 15, height: 15, resizeMode: 'contain'}}
      />
      <TextInput
        style={{
          width: '100%',
          height: 50,
          color: Colors.primary,
          marginLeft: 10,
          fontWeight: '600',
        }}
        placeholderTextColor={'#7E7E7E'}
        {...props}
      />
    </View>
  );
}
export function CustomPhoneInput(props) {
  const [hidden, setHidden] = useState(props?.isPassword);
  const {containerStyle, types, placeholder, color, placeholderColor, verify} =
    props;
  return (
    <View style={{width: '100%', marginTop: 18}}>
      {/* <Text style={{color: 'black', fontWeight: '600', fontSize: 14}}>
        {placeholder}
      </Text> */}
      <View
        style={[
          {
            alignSelf: 'center',
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 25,
            paddingHorizontal: 7,
            paddingVertical: 5,
            height: 55,
            marginVertical: 0,
            ...Shadows.shadow3,
          },
          containerStyle,
        ]}>
        {props?.leftIcon ? (
          <Image
            source={props?.leftIcon}
            style={{
              width: 18,
              height: 18,
              resizeMode: 'contain',
              tintColor: Colors.primary,
              marginHorizontal: 10,
              // marginTop: 5,
            }}
          />
        ) : null}
        <View
          style={{
            flex: 1,

            flexDirection: 'row',
            alignItems: 'center',
            // borderLeftWidth: 1,
            // borderLeftColor: Colors.border,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TextInputMask
              type={'cel-phone'}
              style={{
                flex: 1,
                color: Colors.black,
                paddingLeft: 10,
                fontSize: 15,
              }}
              onChangeText={phoneNumberFormat => {
                let phoneNumber = phoneNumberFormat
                  .toString()
                  .replace(/\D+/g, '');
                props?.onChangePhoneInput(phoneNumberFormat, phoneNumber);
              }}
              maxLength={
                props?.formattedPhoneNumber.toString().startsWith('1') ? 18 : 19
              }
              options={
                props?.phoneNumber.startsWith('1')
                  ? {
                      dddMask: '9 (999) 999 - ',
                    }
                  : {
                      dddMask: '(999) 999 - ',
                    }
              }
              {...props}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
