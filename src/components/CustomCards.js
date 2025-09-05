import {StyleSheet, Text, FlatList, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../config';
import Carousel from 'react-native-snap-carousel';
import {NavService} from '../config';
import AppBackground from './AppBackground';
import CustomBackground from './CustomBackground';

const CustomCards = props => {
  const [state, setState] = useState("");
  
 const Flow = [
  {
    title: "Seller"
  },
  {
    title: "Buyer"
  }
 ]

  return (
     
      <Carousel
        // ref={(c) => { this._carousel = c; }}
        layout={'stack'}
        layoutCardOffset={`40`}
        data={Flow}
        renderItem={({item, index}) => (
          <TouchableOpacity
            // activeOpacity={0.92}
            onPress={() => {
              setState(item.title);
              if(item.title == "Seller"){
                NavService.reset(0, [{name: 'GuardianAppStack'}]);
              } else {
                NavService.reset(0, [{name: 'UserAppStack'}]);
              }
            }}
            style={styles.cardContainer}>
            <Text style={styles.cardContent}>{item.title}</Text>
          </TouchableOpacity>
        )}
        sliderWidth={370}
        itemWidth={200}
      />
     
  );
};

export default CustomCards;

const styles = StyleSheet.create({
  cardContainer: {
    height: 340,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    color: Colors.black,
    fontSize: 34,
    fontWeight: '500',
  },
});
