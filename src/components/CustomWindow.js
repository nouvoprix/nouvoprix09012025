import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Images from '../assets/Images';
import { Colors } from '../config';
const {heigth,width} = Dimensions.get("window");

const CustomWindow = (props) => {
    const {title, image, price} = props;

  return (
    <View style={{
        height: Dimensions.get("window").height / 3.6 ,
        // backgroundColor: "red",
        width: Dimensions.get("window").width / 2.4,
        borderRadius: 20,
        marginHorizontal:10,
        marginBottom:16
    }} >
     <View style={{
        flex:8,
        borderTopLeftRadius:20,
        borderTopRightRadius:20
     }} >
        <Image source={image} style={{
            height:"100%",
            width:"100%",
            borderTopLeftRadius:20,
            borderTopRightRadius:20
        }} />
     </View>
     <View style={{
        flex:2,
        backgroundColor: Colors.darkGray,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row"
     }} >
        <Text numberOfLines={1} style={{
            flex:7,
            // backgroundColor:"blue",
            fontSize: 16,
            color: Colors.grey,
            fontWeight: "500",
            // marginLeft:2,
            paddingLeft:8
        }} >Loreum spam</Text>        
        <Text numberOfLines={1} style={{
            flex:3,
            // backgroundColor:"red",
            fontSize: 19,
            fontWeight: "700",
            color: Colors.secondary,
            marginRight:2,
            // marginLeft:5
        }} >$211</Text>        
     </View>
    </View>
  )
}

export default CustomWindow

const styles = StyleSheet.create({})