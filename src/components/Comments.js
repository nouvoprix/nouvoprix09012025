import React from 'react';
import {View, Image, Text, TouchableOpacity, FlatList} from 'react-native';
import {Colors, NavService} from '../config';
// import Reply from './Reply';
import ProfileImage from './ProfileImage';
// import {likeComment} from '../redux/APIs';

const heart_icon = require('../assets/heart.png');

export default function Comments({item}) {
  const {check_like_count, comment, user_profile, latest_comment, post_id, id} =
    item;

  return (
    <View
      style={{
        paddingBottom: 15,
        flexDirection: 'row',
        flex: 1,
        borderBottomColor: '#777777',
        borderBottomWidth: 1,
        marginTop: 15,
      }}>
      <ProfileImage
        size={35}
        imageUri={user_profile?.profile_image}
        name={user_profile?.name}
        style={{
          // marginTop: -45,
          borderRadius: 4,
        }}
      />
      <View style={{flex: 1, marginLeft: 12}}>
        <View>
          <Text style={{fontSize: 15, color: Colors.white, fontWeight: '600'}}>
            {user_profile.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: '#777777',
              fontWeight: '500',
              marginTop: 3,
            }}>
            {comment}
          </Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity
              onPress={async () => {
                likeComment(post_id, id);
              }}
              style={{flexDirection: 'row'}}>
              <Image
                source={heart_icon}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: Colors.primary,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  color: '#777777',
                  fontWeight: '500',
                  marginLeft: 5,
                }}>
                {check_like_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => NavService.navigate('Reply', {item})}>
              <Text
                style={{
                  fontSize: 11,
                  color: '#777777',
                  fontWeight: '500',
                  marginLeft: 20,
                }}>
                Reply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* {latest_comment !== null && latest_comment !== undefined && (
          <Reply item={latest_comment} />
        )} */}
      </View>
    </View>
  );
}