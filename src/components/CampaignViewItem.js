import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Colors, NavService, Shadows, Common } from '../config';
import VideoPlayer from '../Container/VideoPlayer/videoPlayer';
import CustomButton from '../components/CustomButton';
import NativeVideoPlayer from './NativeVideoPlayer';
import Icons from 'react-native-vector-icons/Entypo'
import { reportVideo } from '../redux/APIs';

const CampaignViewItem = ({
  info,
  index,
  sliderIndex,
  onEditPress,
  onDeletePress,
  containerStyles,
  wrapperStyles,
  onVideoEndPress,
}) => {
  const { t } = useTranslation();
  const userInfo = useSelector(state => state.user.userData);
  const [display, setDispaly] = useState(false);
  const reportAd = async (payload) => {
    console.log("pressed", info._id)
    const res = await reportVideo({ campaignId: info._id })
    res && setDispaly(false)
  };
  // const BASE_URL = "https://webservices.nouvoprix.com:3009/";
  // const videoUrl = info?.ad_video ? `${BASE_URL}/${info.ad_video}` : null;

  return (
    <View
      style={[
        {
          marginHorizontal: 30,
          backgroundColor: Colors.white,
          paddingVertical: 20,
          paddingHorizontal: 25,
          borderRadius: 25,
          ...Shadows.shadow5,
        },
        containerStyles,
      ]}>
      <View
        style={[
          {
            width: Dimensions.get('screen').width * 0.8,
            height: Dimensions.get('screen').height * 0.2,
            alignSelf: 'center',
            borderRadius: 25,
          },
          wrapperStyles,
        ]}>
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
          onVideoEnded={() => onVideoEndPress(index)}
          autoPlay={true}
          loopIndex={index}
          sliderIndex={sliderIndex}
        />
      </View>
      <TouchableOpacity
        onPress={() => NavService.navigate('AdDetail', { info })}
        activeOpacity={0.8}
        style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
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
            style={{ marginTop: 5, fontSize: 14, color: Colors.grey }}>
            {info?.campaign_description}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={{ width: 40 }} onPress={() => setDispaly(!display)}>
            <Icons name='dots-three-vertical' color="#000" size={20} />
          </TouchableOpacity>
          {
            display &&
            <View style={{ position: 'absolute', width: 100, right: 0, top: 25, backgroundColor: '#fff', paddingVertical: 10, borderRadius: 20, alignItems: 'center' }}>
              <TouchableOpacity onPress={reportAd}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: Colors.black,
                  textTransform: 'capitalize',
                }}>Report Video</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CampaignViewItem;

const styles = StyleSheet.create({
  videoPlayer: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.21,
  },
});
