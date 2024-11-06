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
  //@ts-ignore
} from '@vokhuyet/react-native-concurrent-sound';
import DocumentPicker from 'react-native-document-picker';

export default function App() {
  useEffect(() => {
    const eventListener = ConcurrentSoundEvent.addListener(
      'OnSoundEnd',
      (event: any) => {
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
        style={styles.button}
        onPress={async () => {
          const duration = await load({
            key: 'local',
            uri: require('./local.mp3'),
            loop: true,
            volume: 1,
          });
          console.log('Load and Play local assets', duration);
          play({ key: 'local', uri: require('./local.mp3') });
        }}
      >
        Load and Play local assets
      </Text>

      <Text
        style={styles.button}
        onPress={async () => {
          const select = await DocumentPicker.pickSingle();
          console.log('select', select);
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
        style={styles.button}
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
        style={styles.button}
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
        style={styles.button}
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
        style={styles.button}
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
        style={styles.button}
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
        style={styles.button}
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/actors.mp3', key: '1' });
        }}
      >
        play actors 1
      </Text>
      <Text
        style={styles.button}
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
        style={styles.button}
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/accidents.mp3' });
        }}
      >
        Play accidents
      </Text>
      <Text
        style={styles.button}
        onPress={() => {
          pause({ uri: 'https://listenaminute.com/a/actors.mp3' });
        }}
      >
        pause actors 1
      </Text>
      <Text
        style={styles.button}
        onPress={() => {
          seek({ uri: 'https://listenaminute.com/a/actors.mp3', to: 0 });
        }}
      >
        seek
      </Text>
      <Text
        style={styles.button}
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
  button: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginBottom: 8,
  },
});
