import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../config'

const CustomSummary = (props) => {
    const {title, price, qty} = props;
  return (
    <View style={{
        // backgroundColor:"red",
        height: Dimensions.get("window").height / 15,
        // padding: 6,
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.grey,
        // height: 45
    }} >
      <Text style={{
        fontSize:14,
        color: Colors.grey
      }} >{qty}X {title}</Text>
      <Text style={{
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: "bold"
      }} >${price}</Text>
    </View>
  )
}

export default CustomSummary

const styles = StyleSheet.create({})