import React from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import Video from './react-native-af-video-player-reimplemented';

export default function FullScreenPopUpVideo({
  isVisible,
  dismissModalNew,
  cacheVideoUrl,
  themes,
  getVideoDuration,
  videoDuration,
}) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={1}
      onBackButtonPress={dismissModalNew}
      onBackdropPress={dismissModalNew}>
      <View style={{backgroundColor: '#000', borderRadius: 7, flex: 1}}>
        <Video
          url={`${cacheVideoUrl}`}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 7,
            backgroundColor: 'grey',
            resizeMode: 'contain',
          }}
          theme={themes}
          dismissModal={dismissModalNew}
          getVideoDuration={getVideoDuration}
          videoDuration={videoDuration}
          autoPlay={isVisible}
        />
      </View>
    </Modal>
  );
}
