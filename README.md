# react-native-concurrent-sound

play concurrent sound at same time

compatible with both old and new architecture(not tested)

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
import { play, pause, seek, setVolume, ConcurrentSoundEvent } from '@vokhuyet/react-native-concurrent-sound';

// ...
 load({ uri: 'https://example.file.mp3', key: '1', volume: 1, loop: false });
 pause({ uri: 'https://example.file.mp3', key: '2' });
 play({ uri: 'https://example.file.mp3', key: '1' });
 pause({ uri: 'https://example.file.mp3', key: '2' });
 seek({ uri: 'https://example.file.mp3', key: '1', to: 0 });
 setVolume({ uri: 'https://example.file.mp3', key: '1', to: 0.2 });
 const success = await stopAll();

 useEffect(() => {
    const eventListener = ConcurrentSoundEvent.addListener(
      'OnSoundEnd',
      (event) => {
        //event: { uri: 'https://example.file.mp3', key: '1' }
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
const duration = await load({ uri: 'https://example.file.mp3', key: '1', volume: 1, loop: false  });
```

create new player and pre load sound if it is not exist, return duration of Sound
function must be call before play

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| **uri**        |  **string**  |  | **must provide http or file:// to load sound**                                                                 |
|key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will use uri if not exist, key is useful in case of creating multiple player of same sound|
|volume              | number  |     1      | volume of Sound 0 -> 1|
|loop              | boolean  |     false      | true/false|
<br/>

```javascript
const duration = await play({ uri: 'https://example.file.mp3', key: '1' });
```

create new player to play sound if it is not exist, return duration of Sound

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| **uri**        |  **string**  |  | **must provide http or file:// to play sound**                                                                 |
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will use uri if not exist, key is useful in case of creating multiple player of same sound|
<br/>

```javascript
pause({ uri: 'https://example.file.mp3', key: '1' });
```

pause active player

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
|key              | string  |     uri -> latest active uri      | key is used to get player that playing uri |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided. Otherwise, will use latest active uri        |

<br/>

```javascript
seek({ uri: 'https://example.file.mp3', key: '1', to: 0 });
```

seek to time (seconds)

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will be create if not exist, key is useful in case of creating multiple player of same sound    |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided otherwise, will use latest active uri        |
|**to**        |  **number**  | undefined | **time in second to seek**        |

<br/>

```javascript
setVolume({ uri: 'https://example.file.mp3', key: '1', to: 0 });
```

set volume  of one player (0->1)

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will be create if not exist, key is useful in case of creating multiple player of same sound    |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided otherwise, will use latest active uri        |
|**to**        |  **number**  | undefined | **0.0 -> 1.0**        |
 
<br />

```javascript
setLoop({ uri: 'https://example.file.mp3', key: '1', to: false });
```

set loop  of one player

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will be create if not exist, key is useful in case of creating multiple player of same sound    |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided otherwise, will use latest active uri        |
|**to**        |  **boolean**  | undefined | **true/false**        |
 
<br />

```javascript
setCategory({  to: 'playback' });
```

### [**iOS only**] 

set category  of audio session

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
|**to**        |  **enum**  | playback | **ios: soloAmbient \| ambient \| playback**        |
 
<br />

```javascript
const success = await stopAll();
```

stop, release all player

<br />

## Event

| Name             |     Data    | Description                                                                                                                                    |
|----------------------| :-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| OnSoundEnd              | {uri: string, key: string}  |     call when sound end |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
