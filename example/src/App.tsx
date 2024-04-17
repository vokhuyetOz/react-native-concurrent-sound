import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  play,
  pause,
  seek,
  setVolume,
} from '@vokhuyet/react-native-concurrent-sound';
import DocumentPicker from 'react-native-document-picker';

export default function App() {
  return (
    <View style={styles.container}>
      <Text
        onPress={async () => {
          const select = await DocumentPicker.pickSingle();
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
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/actors.mp3', key: '2' });
        }}
      >
        Add actors 2
      </Text>
      <Text
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/actors.mp3', key: '1' });
        }}
      >
        actors 1
      </Text>
      <Text
        onPress={() => {
          play({ uri: 'https://listenaminute.com/a/accidents.mp3' });
        }}
      >
        Add accidents
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
