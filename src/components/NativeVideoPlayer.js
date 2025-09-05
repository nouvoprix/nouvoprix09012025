import React, {useState, useEffect, useRef} from 'react';
import Orientation from 'react-native-orientation-locker';
import {useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
// import Video from './react-native-af-video-player-reimplemented';
import FullScreenPopUpVideo from './FullScreenPopUpVideo';
import {Colors, Common} from '../config';
import {getUrl} from '../config/Helpers/getUrl';

let getVideoDuration = 0;

const theme = {
  title: 'transparent',
  more: 'transparent',
  center: Colors.white,
  fullscreen: Colors.white,
  volume: Colors.white,
  scrubberThumb: Colors.white,
  scrubberBar: Colors.primary,
  seconds: Colors.white,
  duration: Colors.white,
  progress: Colors.primary,
  loading: Colors.primary,
};

const NativeVideoPlayer = React.memo(
  ({
    videoUrl,
    style,
    onVideoEnded = () => {},
    autoPlay = false,
    loopIndex = 0,
    sliderIndex = 0,
  }) => {
    const isFocused = useIsFocused();
    const videoRef = useRef(null);
    const [cacheVideoUrl, setCacheVideoUrl] = useState('');
    const [isFullScreen, setFullScreen] = useState(false);
    const [paused, setPaused] = useState(false);

    const handleLoad = () => {
      // if (autoPlay) {
      //   setPaused(false);
      // }
    };
    const getVideoDurations = duration => {
      getVideoDuration = Number(duration);
    };
    const dismissModal = videoUrl => {
      Orientation.unlockAllOrientations();
      setCacheVideoUrl(videoUrl);
      setFullScreen(!isFullScreen);
    };
    const dismissModalNew = () => {
      Orientation.lockToPortrait();
      setFullScreen(!isFullScreen);
    };
    useEffect(() => {
      if (isFocused && sliderIndex === loopIndex) {
        setPaused(false); // Play video when screen is focused
      } else {
        setPaused(true); // Pause video when screen is not focused
      }
    }, [isFocused, sliderIndex, loopIndex]);
    useEffect(() => {
      return () => {
        Orientation.lockToPortrait();
        setFullScreen(false);
      };
    }, []);
    return (
      <>
        {/* 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' */}
        {/* <Video
          url={`${Common?.assetURL}${videoUrl}`}
          style={style}
          dismissModal={dismissModal}
          getVideoDuration={getVideoDurations}
          videoDuration={getVideoDuration}
          theme={theme}
          onVideoEnded={onVideoEnded}
          autoPlay={autoPlay}
        /> */}
        <Video
          ref={videoRef}
          source={{uri: convertToProxyURL(getUrl(videoUrl))}}
          paused={
            sliderIndex == loopIndex
              ? paused
              : !paused && sliderIndex == loopIndex
              ? false
              : true
          }
          shouldPlay={sliderIndex == loopIndex}
          // autoplay={false}
          onLoad={handleLoad}
          style={style}
          onEnd={() => {
            if (videoRef.current) {
              videoRef.current.seek(0);
            }
            onVideoEnded();
          }}
          playInBackground={false}
          playWhenInactive={false}
          // muted
          controls
          resizeMode="contain"
        />
        <FullScreenPopUpVideo
          isVisible={isFullScreen}
          dismissModalNew={dismissModalNew}
          cacheVideoUrl={cacheVideoUrl}
          themes={theme}
          getVideoDuration={getVideoDurations}
          videoDuration={getVideoDuration}
        />
      </>
    );
  },
);

export default NativeVideoPlayer;
