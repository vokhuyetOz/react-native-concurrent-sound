# react-native-concurrent-sound

play concurrent sound at same time

compatible with both old and new architecture(not tested)

## Installation

```sh
npm install @vokhuyet/react-native-concurrent-sound
```

```sh
yarn add @vokhuyet/react-native-concurrent-sound
```

## Usage

```js
import { play, pause, seek, setVolume } from '@vokhuyet/react-native-concurrent-sound';

// ...
 play({ uri: 'https://example.file.mp3', key: '1' });
 pause({ uri: 'https://example.file.mp3', key: '2' });
 seek({ uri: 'https://example.file.mp3', key: '1', to: 0 });
 setVolume({ uri: 'https://example.file.mp3', key: '1', to: 0.2 });
```

## Static methods

```javascript
play({ uri: 'https://example.file.mp3', key: '1' });
```

create new player to play sound if it is not exist

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| **uri**        |  **string**  |  | **must provide http or file:// to play sound**                                                                 |
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will be create if not exist, key is useful in case of creating multiple player of same sound    |

```javascript
pause({ uri: 'https://example.file.mp3', key: '1' });
```

pause active player

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
|key              | string  |     uri -> latest active uri      | key is used to get player that playing uri |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided otherwise, will use latest active uri        |

```javascript
seek({ uri: 'https://example.file.mp3', key: '1', to: 0 });
```

create new player to play sound if it is not exist

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will be create if not exist, key is useful in case of creating multiple player of same sound    |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided otherwise, will use latest active uri        |
|**to**        |  **number**  | undefined | **time in second to seek**        |

```javascript
setVolume({ uri: 'https://example.file.mp3', key: '1', to: 0 });
```

create new player to play sound if it is not exist

| Property             |   Type    |    Default    | Description                                                                                                                                    |
|----------------------| :-------: |:-------------:|------------------------------------------------------------------------------------------------------------------------------------------------|
| key              | string  |     uri -> latest active uri      | key is used to get player that playing uri, will be create if not exist, key is useful in case of creating multiple player of same sound    |
|uri        |  string  |  | uri is used to get player that playing uri, if key is not provided otherwise, will use latest active uri        |
|**to**        |  **number**  | undefined | **0.0 -> 1.0**        |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
