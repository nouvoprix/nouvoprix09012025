import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Shadows} from '../config';
import Icons from '../assets/Icons';

const FastInput = ({label, placeholder, password, value, Onchange}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        height: Dimensions.get('window').height * 0.08,
        width: Dimensions.get('window').width * 0.9,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        ...Shadows.shadow3,
        marginVertical: 10,
        alignSelf: 'center',
      }}>
      <View
        style={{
          width: '80%',
          marginLeft: 20,
          height: Dimensions.get('window').height * 0.08,
          //   alignItems: 'center',
          bottom: label ? 0 : null,
          paddingTop: 4,
          justifyContent: 'center',
          //   backgroundColor: 'blue',
        }}>
        {label && (
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: Colors.primary,
              height: 16,
            }}>
            {label}
          </Text>
        )}
        <TextInput
          secureTextEntry={password ? !visible : false}
          // secureTextEntry={true}
          placeholder={placeholder}
          value={value}
          onChangeText={Onchange}
          placeholderTextColor={Colors.grey}
          style={{
            fontSize: 16,
            color: Colors.grey,
            top: !label ? 2 : null,
            fontWeight: '500',
          }}
        />
      </View>
      {password && (
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={{
            // backgroundColor: 'yellow',
            width: '10%',
            marginRight: 13,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {visible && (
            <Image
              style={{
                height: Dimensions.get('window').height * 0.023,
                resizeMode: 'contain',
                tintColor: Colors.grey,
              }}
              source={Icons.visible}
            />
          )}
          {!visible && (
            <Image
              style={{
                height: Dimensions.get('window').height * 0.019,
                resizeMode: 'contain',
                tintColor: Colors.grey,
              }}
              source={Icons.Unvisible}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FastInput;

const styles = StyleSheet.create({});
