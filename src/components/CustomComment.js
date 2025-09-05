import { Dimensions,TouchableOpacity,Modal ,StyleSheet, Text, View ,Image} from 'react-native'
import React,{useState} from 'react'
import Images from '../assets/Images';
import { Colors } from '../config';
import CustomCommentSender from './CustomCommentSender';
const {width,height} = Dimensions.get("window");
// import CustomReply from '../components/CustomReply'

const CustomComment = (props) => {

    const {title, time, Comment, image, childe, Reply = false} = props;

    const [reply, setReply] = useState(false);
    const [comments, setComments] = useState(false);
    const [details, setDetails] = useState("More");
    
  return (
    <View style={{
        width: width - 50 ,
        flexDirection:"row",
        // height: reply || comments  ? height / 5.4 : height / 10,
        // maxHeight: comments  ? height / 5 : height / 10,
        // paddingVertical: 20 ,
        borderBottomColor: Colors.grey,
        borderBottomWidth: 0.2,
        marginVertical: 10,
        // padding:5
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
        paddingHorizontal:10,
      }} >
       <View style={{}} >
       <Text style={{
            fontWeight:"600",
            fontSize:16,
            color: Colors.white,
            // paddingTop:10,
            // backgroundColor:"blue"
        }} >{title}</Text>
        <Text style={{
            // backgroundColor: "red" ,
            marginBottom: 30,
            color: Colors.grey,
            // marginTop: 5 ,
        }}  numberOfLines={2} >{Comment}</Text>
       </View>
        {
          reply && (
            <View style={{
              // backgroundColor:"red",
              flexDirection:"row",
              // marginTop: "10%",,
              marginBottom: 30
            }} >
              <Image source={Images.avatar} style={{
                height:42,
                borderRadius:10,
                flex: 1.5,
                resizeMode:"cover",
              }} />
              <View style={{flex:0.5}} ></View>
              <CustomCommentSender onPress={()=>{
                setReply(!reply)
              }} iconContainer={{
                height: 24,
                width: 24,
              }} iconStyle={{
                height: 14,
                alignSelf: "center"
              }} textStyle={{height:20}} containerStyle={{
                flex:8,
                height: "76%",
              }}  />
            </View>
          )
        }

        {
          comments  && (
            <>
            <View style={{
              padding: 4,
              backgroundColor: Colors.darkGray,
              // backgroundColor: "red",
              borderRadius:10,
              marginBottom: 30,
              marginTop: -20,
              maxWidth: Dimensions.get("screen").width / 1.4,
              // marginHorizontal:10


            }}>
            <View style={{
              // backgroundColor:"red", 
              // padding:2,
              justifyContent:"center",
              flexDirection:"row",
              margin:5,
              // marginHorizontal: 10
              // marginVertical: 15
            }}>
              <Image source={Images.avatar} style={{
                height: 40,
                width: 40,
                borderRadius: 10
              }} />
              <View style={{marginLeft:6}} >
                <Text numberOfLines={1} style={{color: Colors.white, fontSize: 16,fontWeight: "600"}} >Jhone Kelvin</Text>
                <Text numberOfLines={2} style={{marginTop:2, color: Colors.grey, fontSize:14, marginBottom:2}} >Loreum Spanm is working on every devices</Text>
              </View> 
            </View>
            <View style={{flexDirection:"row" , position: "absolute", bottom: 2, right:20}}>
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
           
                </View>
              </View>
          </>
          )
        }
        
        <View style={{flexDirection:"row", marginTop: 10 ,position:"absolute",bottom:5,marginLeft: 8}}>
            <Text style={{
                color: Colors.grey,
                fontSize:12
            }} >{time}</Text>
            <TouchableOpacity style={{
                marginLeft:10
            }} >
                <Text style={{
                    color: Colors.grey,
                    fontSize: 12,
                    fontWeight:"500"
                }} >Like</Text>
            </TouchableOpacity>
          {
            Reply && (
              <TouchableOpacity
              onPress={()=>setReply(!reply)}
              style={{
                  marginLeft: 10
              }} >
                  <Text style={{
                  color: Colors.grey,
                  fontSize: 12,
                  fontWeight:"500"  
                  }}  >Reply</Text>
              </TouchableOpacity>
            )
          }
           {
            !childe && (
              <TouchableOpacity onPress={()=>{
                setComments(!comments)
                setDetails(details === "More" ? "Less" : "More")
              }} style={{
                marginLeft: 20
            }} >
                <Text style={{
                color: Colors.primary,
                fontSize: 12
                }}>{details}</Text>
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