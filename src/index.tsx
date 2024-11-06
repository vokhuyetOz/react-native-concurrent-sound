import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  Image,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-concurrent-sound' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ConcurrentSoundModule = isTurboModuleEnabled
  ? require('./NativeConcurrentSound').default
  : NativeModules.ConcurrentSound;

const ConcurrentSound = ConcurrentSoundModule
  ? ConcurrentSoundModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export type TInput = {
  uri?: string;
  key?: string;
};

export type TInputSeek = TInput & {
  to: number;
};
export type TInputLoop = TInput & {
  to: boolean;
};
export type TInputCategory = {
  //ios: 'soloAmbient' | 'ambient' | 'playback';
  to: 'soloAmbient' | 'ambient' | 'playback';
};

export type TInputLoad = TInput & {
  volume?: number;
  loop?: boolean;
};

export const ConcurrentSoundEvent = new NativeEventEmitter(
  Platform.select({
    android: ConcurrentSoundModule,
    ios: NativeModules.ConcurrentSoundEmitter,
  })
);

function getAsset(uri?: string) {
  if (typeof uri === 'number') {
    const asset = Image.resolveAssetSource(uri).uri;
    return {
      asset,
      type: 'asset',
    };
  }
  return { asset: uri };
}
export function load({
  uri,
  key = uri,
  volume = 1,
  loop = false,
}: TInputLoad): Promise<number> {
  const { asset, type } = getAsset(uri);
  if (Platform.OS === 'android') {
    return ConcurrentSound.load(key, asset, volume, loop, type);
  }
  return ConcurrentSound.load(key, asset, volume, loop);
}

export function play({ uri, key = uri }: TInput): Promise<number> {
  const { asset } = getAsset(uri);
  return ConcurrentSound.play(key, asset);
}

export function pause({ uri, key = uri }: TInput): Promise<void> {
  const { asset } = getAsset(uri);
  return ConcurrentSound.pause(key, asset);
}

export function seek({ uri, key = uri, to }: TInputSeek): Promise<boolean> {
  const { asset } = getAsset(uri);
  return ConcurrentSound.seek(key, asset, to);
}

export function setVolume({ uri, key = uri, to }: TInputSeek): Promise<void> {
  const { asset } = getAsset(uri);
  return ConcurrentSound.setVolume(key, asset, to);
}

export function setPlaybackRate({
  uri,
  key = uri,
  to,
}: TInputSeek): Promise<void> {
  return ConcurrentSound.setPlaybackRate(key, uri, to);
}

export function setLoop({ uri, key = uri, to }: TInputLoop): Promise<void> {
  return ConcurrentSound.setLoop(key, uri, to);
}
export function setCategory({ to }: TInputCategory): Promise<void> | undefined {
  if (Platform.OS !== 'ios') {
    return;
  }
  return ConcurrentSound.setCategory(to);
}

export function stopAll(): Promise<boolean> {
  return ConcurrentSound.stopAll();
}
