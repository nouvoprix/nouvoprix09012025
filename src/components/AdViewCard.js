import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {Colors, NavService, Shadows, Common} from '../config';
import VideoPlayer from '../Container/VideoPlayer/videoPlayer';
import CustomButton from '../components/CustomButton';
import NativeVideoPlayer from './NativeVideoPlayer';

const AdViewCard = ({info, onEditPress, onDeletePress}) => {
  const {t} = useTranslation();
  const userInfo = useSelector(state => state.user.userData);
  return (
    <View
      style={{
        marginBottom: 14,
        backgroundColor: Colors.white,
        padding: 25,
        borderRadius: 25,
        ...Shadows.shadow5,
      }}>
      <View
        style={{
          width: Dimensions.get('screen').width * 0.85,
          height: Dimensions.get('screen').height * 0.35,
          alignSelf: 'center',
          borderRadius: 25,
        }}>
        {/* <VideoPlayer
          style={styles.videoPlayer}
          source={{
            // uri: ASSETS_URL + video,
            uri: Common.assetURL + info?.ad_video,
          }} // Can be a URL or a local file.
        /> */}
        <NativeVideoPlayer
          videoUrl={info?.ad_video}
          style={styles.videoPlayer}
        />
      </View>
      <TouchableOpacity
        onPress={() => NavService.navigate('AdDetail', {info})}
        activeOpacity={0.8}
        style={{marginVertical: 10}}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            fontWeight: '300',
            color: Colors.grey,
            textTransform: 'capitalize',
          }}>
          {info?.campaign_name}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 19,
            fontWeight: '900',
            color: Colors.primary,
            textTransform: 'capitalize',
          }}>
          {info?.campaign_headline}
        </Text>
        <Text
          numberOfLines={3}
          style={{marginTop: 5, fontSize: 14, color: Colors.grey}}>
          {info?.campaign_description}
        </Text>
      </TouchableOpacity>
      {info?.user_id?._id == userInfo?._id ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton
            onPress={() => onEditPress()}
            title={t('Edit')}
            buttonStyle={{
              width: '35%',
              height: 35,
              backgroundColor: Colors.white,
            }}
            textStyle={{color: Colors.black, fontSize: 14, fontWeight: '600'}}
          />
          <CustomButton
            title={t('Delete')}
            buttonStyle={{
              width: '40%',
              height: 35,
              marginLeft: 12,
              backgroundColor: Colors.icon,
            }}
            textStyle={{color: Colors.white, fontSize: 13, fontWeight: '600'}}
            onPress={() => onDeletePress(info)}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AdViewCard;

const styles = StyleSheet.create({
  videoPlayer: {
    width: Dimensions.get('screen').width * 0.85,
    height: Dimensions.get('screen').height * 0.33,
  },
});
