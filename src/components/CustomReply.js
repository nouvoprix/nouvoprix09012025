import { Dimensions,TouchableOpacity,Modal ,StyleSheet, Text, View ,Image} from 'react-native'
import React,{useState} from 'react'
import Images from '../assets/Images';
import { Colors } from '../config';
import CustomCommentSender from './CustomCommentSender';
const {width,height} = Dimensions.get("window");

const CustomComment = (props) => {

    const {title, time, Comment, image, childe} = props;

    const [reply, setReply] = useState(false);

  return (
    <View style={{
        width: width - 50 ,
        flexDirection:"row",
        height: reply ? height / 4 : height / 8.8,
        borderBottomColor: Colors.grey,
        borderBottomWidth: 0.2,
        marginVertical: 10,
    }} >
      {/* <Modal onRequestClose={ () => setReply(!reply)} animationType="fade" transparent={true} visible={reply} /> */}
      <View style={{
        flex:2,
        // backgroundColor:'blue',
        alignItems:"center"
      }} >
        <Image source={image} style={{
            height:50,
            width:50,
            borderRadius: 10,
            marginTop:4
        }} />
      </View>
      <View style={{
        flex:8,
        // backgroundColor:"green",
        paddingHorizontal:10
      }} >
        <Text style={{
            fontWeight:"600",
            fontSize:16,
            color: Colors.white,
            marginTop:2
        }} >{title}</Text>
        <Text style={{
            color: Colors.grey,
            marginTop:5
        }}  numberOfLines={2} >{Comment}</Text>
        {
          reply && (
            <View style={{
              // backgroundColor:"red",
              flexDirection:"row",
              marginVertical: 15,
              alignItems:"center",
            }} >
              <Image source={Images.avatar} style={{
                height:48,
                width:48,
                borderRadius:10,
                flex: 2
              }} />
              <View style={{flex:0.5}} ></View>
              <CustomCommentSender onPress={()=>{
                setReply(!reply)
              }} iconContainer={{
                height: 24,
                width: 24
              }} iconStyle={{
                height: 14,
                alignSelf: "center"
              }} textStyle={{height:20}} containerStyle={{
                flex:7.5,
                height: "80%",
              }}  />
            </View>
          )
        }

        {/* {
          childe && (
            
              // <CustomCommentSender onPress={()=>{
              //   setReply(!reply)
              // }} iconContainer={{
              //   height: 24,
              //   width: 24
              // }} iconStyle={{
              //   height: 14,
              //   alignSelf: "center"
              // }} textStyle={{height:20}} containerStyle={{
              //   flex:7.5,
              //   height: "80%",
              // }}  />
            
          )
        }
         */}
        <View style={{flexDirection:"row", position:"absolute",bottom:8,marginLeft: 8}}>
            <Text style={{
                color: Colors.grey,
                fontSize:14
            }} >{time}</Text>
            <TouchableOpacity style={{
                marginLeft:10
            }} >
                <Text style={{
                    color: Colors.grey,
                    fontSize: 14
                }} >Like</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>setReply(!reply)}
            style={{
                marginLeft: 10
            }} >
                <Text style={{
                color: Colors.grey,
                fontSize: 14  
                }}  >Replay</Text>
            </TouchableOpacity>
           {
            !childe && (
              <TouchableOpacity style={{
                marginLeft: 20
            }} >
                <Text style={{
                color: Colors.primary,
                fontSize: 13
                
                }}  >More</Text>
            </TouchableOpacity>
            )
           }
        </View>
      </View>
    </View>
  )
}

export default CustomComment

const styles = StyleSheet.create({})