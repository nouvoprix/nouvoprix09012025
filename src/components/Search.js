import React from 'react';
import {View, TextInput, Image} from 'react-native';
import Icons from '../assets/Icons';
import {Colors, Shadows} from '../config';

const Search = ({onChangeText = () => {}}) => {
  const [search, setSearch] = React.useState('');
  return (
    <View
      style={{
        backgroundColor: Colors.backgroundColor,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        ...Shadows.shadow3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
        marginHorizontal: 20,
      }}>
      <TextInput
        onChangeText={text => {
          setSearch(text);
          onChangeText(text);
        }}
        returnKeyType="search"
        placeholder={'Search'}
        // label={'Search'}
        value={search}
        placeholderTextColor={Colors.grey}
        style={{
          flex: 1,
          color: Colors.grey,
          fontSize: 14,
          paddingHorizontal: 4,
        }}
        maxLength={20}
      />
      <Image
        source={Icons.search}
        style={{
          height: 20,
          width: 20,
          resizeMode: 'contain',
          marginRight: 2,
        }}
      />
    </View>
  );
};

export default Search;
