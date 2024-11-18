# You see it helpful

- Give it a star
- [Buy me a coffee](https://buymeacoffee.com/vokhuyetoz)

# @vokhuyet/react-native-concurrent-sound

play concurrent sound at same time

[x] compatible with both old and new architecture

[x] support https://, http://, file://

[x] support require(asset)

IOS use [AVPlayer](https://developer.apple.com/documentation/avfoundation/avplayer/) under the hood

Android use [MediaPlayer](https://developer.android.com/reference/android/media/MediaPlayer) under the hood

## Installation

```sh
npm install @vokhuyet/react-native-concurrent-sound
```

```sh
yarn add @vokhuyet/react-native-concurrent-sound
```

## Usage

```js
import {
  play,
  pause,
  seek,
  setVolume,
  ConcurrentSoundEvent,
} from '@vokhuyet/react-native-concurrent-sound';

// ...
// key is required
load({ , key: '1', volume: 1, loop: false });
load({ uri: require('./file.mp3'), key: 'local', volume: 1, loop: false }); 
pause({ key: '2' });
play({ key: '1' });
pause({ key: '2' });
seek({ key: '1', to: 0 });
setVolume({ key: '1', to: 0.2 });
const success = await stopAll();

useEffect(() => {
  const eventListener = ConcurrentSoundEvent.addListener(
    'OnSoundEnd',
    (event) => {
      //event: { , key: '1' }
      console.log('OnSoundEnd', event);
    }
  );

  // Removes the listener once unmounted
  return () => {
    eventListener.remove();
  };
}, []);
```

## Static methods

```javascript
const duration = await load({
  ,
  key: '1',
  volume: 1,
  loop: false,
});
```

create new player and pre load sound if it is not exist, return duration of Sound
function must be call before play

| Property |    Type    |         Default          | Description                                                                                                                            |
| -------- | :--------: | :----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| **uri**  | **string, require(assets)** |                          | **must provide http or file:// or require(asset) to load sound**                                                                                         |
| key      |   string   | required | key is used to get player that playing uri,  |
| volume   |   number   |            1             | volume of Sound 0 -> 1                                                                                                                 |
| loop     |  boolean   |          false           | true/false                                                                                                                             |

<br/>

```javascript
const duration = await play({ key: '1' });
```

create new player to play sound if it is not exist, return duration of Sound

| Property |    Type    |         Default          | Description                                                                                                                            |
| -------- | :--------: | :----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| key      |   string   | require | key is used to get player that playing uri,  |

<br/>

```javascript
pause({ key: '1' });
```

pause active player

| Property |  Type  |         Default          | Description                                                                                               |
| -------- | :----: | :----------------------: | --------------------------------------------------------------------------------------------------------- |
| key      | string | required | key is used to get player that playing uri                                                                |

<br/>

```javascript
seek({ key: '1', to: 0 });
```

seek to time (seconds)

| Property |    Type    |         Default          | Description                                                                                                                              |
| -------- | :--------: | :----------------------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| key      |   string   | required | key is used to get player that playing uri,  |
| **to**   | **number** |        undefined         | **time in second to seek**                                                                                                               |

<br/>

```javascript
setVolume({ key: '1', to: 0 });
```

set volume of one player (0->1)

| Property |    Type    |         Default          | Description                                                                                                                              |
| -------- | :--------: | :----------------------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| key      |   string   | required | key is used to get player that playing uri,  |
| **to**   | **number** |        undefined         | **0.0 -> 1.0**                                                                                                                           |

<br />

```javascript
setPlaybackRate({ key: '1', to: 2 });
```

set playback speed of one player

| Property |    Type    |         Default          | Description                                                                                                                              |
| -------- | :--------: | :----------------------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| key      |   string   | required | key is used to get player that playing uri,  |
| **to**   | **number** |            1             | playback speed of the audio, 2 will play the audio at 2x                                                                                 |

<br />

```javascript
setLoop({ key: '1', to: false });
```

set loop of one player

| Property |    Type     |         Default          | Description                                                                                                                              |
| -------- | :---------: | :----------------------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| key      |   string    | required | key is used to get player that playing uri,  |
| **to**   | **boolean** |        undefined         | **true/false**                                                                                                                           |

<br />

```javascript
setCategory({ to: 'playback' });
```

### [**iOS only**]

set category of audio session

| Property |   Type   | Default  | Description                                 |
| -------- | :------: | :------: | ------------------------------------------- |
| **to**   | **enum** | playback | **ios: soloAmbient \| ambient \| playback** |

<br />

```javascript
const success = await stopAll();
```

stop, release all player

<br />

## Event

| Name       |            Data            | Description         |
| ---------- | :------------------------: | ------------------- |
| OnSoundEnd | {key: string} | call when sound end |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
