import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {Colors} from '../config';

const ListFooterComponent = ({
  viewStyles,
  textStyles,
  text,
  paginationInfo,
}) => {
  return (
    <View style={viewStyles}>
      {paginationInfo?.moreLoading && (
        <ActivityIndicator color={Colors.black} />
      )}
      {paginationInfo?.isListEnded && <Text style={textStyles}>{text}</Text>}
    </View>
  );
};

export default ListFooterComponent;
