import React, { useEffect } from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  play,
  pause,
  seek,
  setVolume,
  load,
  stopAll,
  setPlaybackRate,
  ConcurrentSoundEvent,
} from '@vokhuyet/react-native-concurrent-sound';
import DocumentPicker from 'react-native-document-picker';

export default function App() {
  useEffect(() => {
    const eventListener = ConcurrentSoundEvent.addListener(
      'OnSoundEnd',
      (event) => {
        console.log('OnSoundEnd', event);
      }
    );

    // Removes the listener once unmounted
    return () => {
      eventListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text
        onPress={async () => {
          const select = await DocumentPicker.pickSingle();
          const duration = await load({
            uri: select.uri,
            loop: true,
            volume: 1,
          });
          console.log('pick', duration);
          play({ uri: select.uri });
        }}
      >
        Pick
      </Text>
      <Text
        onPress={() => {
          setVolume({
            uri: 'https://listenaminute.com/a/actors.mp3',
            key: '2',
            to: 1,
          });
        }}
      >
        set volume actor 2 to 1
      </Text>

      <Text
        onPress={() => {
          setPlaybackRate({
            uri: 'https://listenaminute.com/a/actors.mp3',
            key: '2',
            to: 2,
          });
        }}
      >
        set playback speed actor 2 to 2x
      </Text>
      <Text
        onPress={() => {
          setVolume({
            uri: 'https://listenaminute.com/a/actors.mp3',
            key: '2',
            to: 0.3,
          });
        }}
      >
        set volume actor 2 to 0.3
      </Text>
      <Text
        onPress={async () => {
          const duration = await play({
            uri: 'https://listenaminute.com/a/actors.mp3',
            key: '2',
          });
          console.log('duration', duration);
        }}
      >
        Play actors 2
      </Text>
      <Text
        onPress={async () => {
          const duration = await load({
            uri: 'https://listenaminute.com/a/actors.mp3',
            key: '2',
          });
          console.log('duration', duration);
        }}
      >
        Load actors 2
      </Text>
      <Text
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/actors.mp3', key: '1' });
        }}
      >
        play actors 1
      </Text>
      <Text
        onPress={async () => {
          const duration = await load({
            uri: 'https://listenaminute.com/a/actors.mp3',
            key: '1',
          });
          console.log('duration', duration);
        }}
      >
        load actors 1
      </Text>
      <Text
        onPress={() => {
          load({ uri: 'https://listenaminute.com/a/accidents.mp3' });
        }}
      >
        Load accidents
      </Text>
      <Text
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/accidents.mp3' });
        }}
      >
        Play accidents
      </Text>
      <Text
        onPress={() => {
          pause({ uri: 'https://listenaminute.com/a/actors.mp3' });
        }}
      >
        pause actors 1
      </Text>
      <Text
        onPress={() => {
          seek({ uri: 'https://listenaminute.com/a/actors.mp3', to: 0 });
        }}
      >
        seek
      </Text>
      <Text
        onPress={() => {
          stopAll();
        }}
      >
        stopAll
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
