import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import { Colors } from '../config'
import Images from '../assets/Images'
import Icons from '../assets/Icons'
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';


const CustomCommentSender = (props) => {
const [imageType, setImageType] = useState('');
const actionSheetRef = React.useRef(null);
const [imageUri, setImageuri] = useState('');


const imageChange = (method = 'gallery') => {
    if (method === 'camera') {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
      }).then(image => {
        setImageuri(image.path);
        setImageType(image.mime);
        actionSheetRef.current.hide();
      });
    } else {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
      }).then(image => {
        setImageuri(image.path);
        setImageType(image.mime);
        actionSheetRef.current.hide();
      });
    }
  };

    const {containerStyle, textStyle, iconStyle,iconContainer, onPress} = props
  return (
    <View style={[{
        backgroundColor:Colors.white,
        width: Dimensions.get("window").width - 45,
        height: Dimensions.get("window").height / 15,
        borderRadius:12,
        marginBottom: 10,
        flexDirection:"row",
        alignItems:"center"
    }, containerStyle]} >
        <ActionSheet
          ref={actionSheetRef}
          containerStyle={{backgroundColor: 'transparent'}}>
          <View style={{padding: 10}}>
            <View
              style={{
                backgroundColor: 'rgba(241,241,241,0.8)',
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <View
                style={{
                  borderBottomWidth: 1.5,
                  borderBottomColor: '#ccc',
                  paddingVertical: 10,
                }}>
                <Text style={{color: 'grey', textAlign: 'center'}}>
                  Choose an option to pick an Image
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  actionSheetRef.current.hide();
                  imageChange('camera');
                }}
                style={{
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderBottomWidth: 1.5,
                  borderBottomColor: '#ccc',
                }}>
                <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  imageChange('gallery');
                }}
                style={{paddingVertical: 12, alignItems: 'center'}}>
                <Text style={{color: 'rgb(0,88,200)', fontSize: 18}}>
                  Choose from Library
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => actionSheetRef.current.hide()}
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'rgb(0,88,200)',
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
        {/* <Image source={Ima} /> */}
      <TouchableOpacity onPress={()=>{
        actionSheetRef.current.show()
      }} style={{
        flex: 2,
        height:40,
            width:40,
            // backgroundColor:"red",
            alignItems:"center",
            justifyContent:"center"
      }} >
      <Image source={Icons.camera} style={[{
            height:35,
            width:35,
            
            resizeMode: "contain",
        }, textStyle]} />
      </TouchableOpacity>
        <TextInput placeholderTextColor={Colors.lightGrey} placeholder='Write your comment' style={{
            flex:5
        }} />
        {/* <Image source={Icons.attachment1} style={{
            height:20,
            width:20,
            flex:1,
            resizeMode:"contain"
        }} /> */}
       <View style={{
        flex:2,
        // backgroundColor:"blue",
        alignItems:"center",
        justifyContent:"center"
       }} >
         <TouchableOpacity 
         onPress={onPress}
         style={[{
            backgroundColor:Colors.secondary,
            alignItems:"center",
            justifyContent:"center",
            height: 30,
            width: 30,
            borderRadius:16
        }, iconContainer]} >
            <Image source={Icons.send} style={[{
                height:16,
                width:16,
                alignSelf:"center"
            }, iconStyle]} />
        </TouchableOpacity>
       </View>
    </View>
  )
}

export default CustomCommentSender

const styles = StyleSheet.create({})