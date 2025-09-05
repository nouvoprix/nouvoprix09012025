import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Theme, useTheme} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';
// yarn add @types/react-native-video --save-dev
import Video, {VideoProperties} from "react-native-video";
// import {height, width} from '../../constants/slides';
import MI from 'react-native-vector-icons/MaterialIcons';
const {width} = Dimensions.get('screen');
const VIDEO_DEFAULT_HEIGHT = width * (10 / 16);

export type VideoPlayerProps = {
  source: VideoProperties['source'];
  volumeLvl?: number;
  seek?: number;
  playing?: boolean;
  fullScreen?: boolean;
  onPlaybackStatusUpdate?: (status: PlaybackStatus) => void;
  onFullScreenChange?: () => void;
};

interface PlaybackStatus {
  isPlaying: boolean;
  isBuffering: boolean;
  durationMillis: number;
  currentPositionMillis: number;
  shouldPlay: boolean;
}

const VideoPlayer = ({
  source,
  onPlaybackStatusUpdate,
  onFullScreenChange,
  volumeLvl = 1.0,
  seek = 0,
  playing = true,
  fullScreen = false,
}: VideoPlayerProps & VideoProperties) => {
  const {colors}: Theme = useTheme();

  const videoRef: any = useRef<VideoPlayerProps & VideoProperties>(null);
  const [isPlaying, setIsPlaying] = useState(playing);
  const [volume, setVolume] = useState(volumeLvl);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState(fullScreen);
  const [isShowControls, setIsShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const videoScale = useSharedValue(1);
  const videoTransY = useSharedValue(0);
  const videoHeight = useSharedValue(VIDEO_DEFAULT_HEIGHT);

  useEffect(() => {
    setTimeout(() => {
      setIsShowControls(false);
    }, 5000);
  }, []);

  const defaultVideoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: videoScale.value,
        },
        {
          translateY: videoTransY.value,
        },
      ],
      height: videoHeight.value,
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        setVolume(1.0);
        setIsMuted(false);
      } else {
        setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    setCurrentTime(currentTime);
    videoRef.current.seek(currentTime);
    setIsLoading(false);
  };

  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
  };

  const onSliderValueChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.seek(value);
    }
  };

  const enterFullScreen = () => {
    if (Platform.OS != 'ios') {
      setModalVisible(true);
    }
    setIsFullScreen(true);
    StatusBar.setHidden(true, 'fade');
    Orientation.lockToLandscape();
    // isFullScreen.value = true;
    videoHeight.value = width;
  };

  const exitFullScreen = () => {
    if (Platform.OS != 'ios') {
      setModalVisible(false);
    }
    setIsFullScreen(false);
    StatusBar.setHidden(false, 'fade');
    Orientation.lockToPortrait();
    // isFullScreen.value = false;
    videoHeight.value = VIDEO_DEFAULT_HEIGHT;
  };

  const renderContent = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (!isShowControls) {
            setIsShowControls(true);
            setTimeout(() => {
              setIsShowControls(false);
            }, 10000);
          } else {
            setIsShowControls(false);
          }
        }}>
        <>
          <Animated.View style={[styles.container, defaultVideoStyle]}>
            <Video
              source={source}
              ref={videoRef}
              onProgress={onProgress}
              onLoad={onLoad}
              onLoadStart={handleLoadStart}
              onEnd={() => {
                setCurrentTime(0);
                setIsPlaying(false);
                // videoRef.current.seek(0);
              }}
              onError={err => {
                console.log('err', err);
              }}
              resizeMode="contain"
              style={styles.videoPlayer}
              volume={volume}
              paused={!isPlaying}
              // fullscreen={isFullScreen}
              // fullscreenAutorotate={true}
              controls={Platform.OS == 'ios'}
            />
          </Animated.View>
          {isLoading && (
            <ActivityIndicator
              size={50}
              color={colors.primary}
              style={{
                ...styles.loader,
              }}
            />
          )}
          {console.log(
            isShowControls,
            isPlaying,
            isFullScreen,
            'isPlayingisPlaying',
          )}
          {(isShowControls || !isPlaying) && Platform.OS != 'ios' && (
            <>
              {isFullScreen ? (
                <View
                  style={{
                    ...styles.container,
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <View
                    style={{
                      ...styles.controls,
                      bottom: undefined,
                      justifyContent: 'space-between',
                    }}>
                    <MI
                      size={30}
                      color="red"
                      name="fullscreen-exit"
                      onPress={exitFullScreen}
                    />
                    <View style={styles.flexRow}>
                      <Text style={styles.controlText}>Volume:</Text>
                      <Slider
                        maximumTrackTintColor="#bdbdbd"
                        minimumTrackTintColor={colors.primary}
                        style={{width: 200}}
                        minimumValue={0}
                        maximumValue={1}
                        value={volume}
                        onValueChange={value => setVolume(value)}
                      />
                    </View>
                  </View>
                  <View style={styles.controls}>
                    <MI
                      size={30}
                      onPress={togglePlay}
                      style={styles.controlText}
                      name={
                        !isPlaying ? 'play-circle-fill' : 'pause-circle-filled'
                      }
                    />
                    <Slider
                      maximumTrackTintColor="#bdbdbd"
                      minimumTrackTintColor={colors.primary}
                      style={{width: '80%', marginHorizontal: 10}}
                      minimumValue={0}
                      maximumValue={duration}
                      value={currentTime}
                      onValueChange={onSliderValueChange}
                    />
                    <Text style={styles.controlText}>
                      {moment.utc(currentTime * 1000).format('HH:mm:ss')} /{' '}
                      {moment.utc(duration * 1000).format('HH:mm:ss')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    ...styles.container,
                    position: 'relative',
                  }}>
                  <View
                    style={{
                      ...styles.controls,
                      bottom: undefined,
                      justifyContent: 'space-between',
                    }}>
                    {/* <View /> */}
                    {/* <MI
                      size={30}
                      color="#fff"
                      name="fullscreen"
                      onPress={enterFullScreen}
                    /> */}
                    <View />
                    <View style={styles.flexRow}>
                      <MI
                        name={volume > 0 ? 'volume-up' : 'volume-off'}
                        size={30}
                        color="#fff"
                      />
                      <Slider
                        maximumTrackTintColor="#bdbdbd"
                        minimumTrackTintColor={colors.primary}
                        style={{width: 130}}
                        minimumValue={0}
                        maximumValue={1}
                        value={volume}
                        onValueChange={value => setVolume(value)}
                      />
                    </View>
                  </View>
                  <View style={[styles.controls]}>
                    <TouchableOpacity onPress={togglePlay}>
                      <MI
                        size={30}
                        style={styles.controlText}
                        name={
                          !isPlaying
                            ? 'play-circle-fill'
                            : 'pause-circle-filled'
                        }
                      />
                    </TouchableOpacity>

                    <Slider
                      maximumTrackTintColor="#bdbdbd"
                      minimumTrackTintColor={colors.primary}
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={duration}
                      value={currentTime}
                      onValueChange={onSliderValueChange}
                    />
                    <Text style={styles.controlText}>
                      {moment.utc(currentTime * 1000).format('HH:mm:ss')} /{' '}
                      {moment.utc(duration * 1000).format('HH:mm:ss')}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </>
      </TouchableOpacity>
    );
  };

  if (!modalVisible) {
    return renderContent();
  } else {
    return (
      <Modal
        presentationStyle="overFullScreen"
        visible={true}
        transparent
        animationType="fade"
        onRequestClose={exitFullScreen}
        statusBarTranslucent>
        {renderContent()}
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    backgroundColor: '#000',
    height: '100%',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  controlIcon: {
    fontSize: 30,
    color: '#fff',
    marginHorizontal: 10,
  },
  progressSlider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeLabel: {
    fontSize: 12,
    color: '#fff',
  },
  volumeSlider: {
    width: 100,
    marginHorizontal: 10,
  },

  slider: {
    marginHorizontal: 10,
    width: '60%',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  controlText: {
    color: '#fff',
    marginHorizontal: 20,
  },
  loader: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 250,
    // justifyContent: 'space-around',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // top: 0,
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default VideoPlayer;
