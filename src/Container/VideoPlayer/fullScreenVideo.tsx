import React from 'react';
import {View} from 'react-native';
import VideoPlayer, {VideoPlayerProps} from './videoPlayer';

const FullScreenVideo = (props: VideoPlayerProps) => {
  return (
    <View>
      <VideoPlayer {...props} fullscreen />
    </View>
  );
};

export default FullScreenVideo;
