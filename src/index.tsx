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

const ConcurrentSound =
  ConcurrentSoundModule ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export type TInput = {
  key: string;
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
  uri: string;
  volume?: number;
  loop?: boolean;
};

export const ConcurrentSoundEvent = new NativeEventEmitter(
  Platform.select({
    android: ConcurrentSoundModule,
    ios: NativeModules.ConcurrentSoundEmitter,
  })
);

function getAsset(uri?: string | number) {
  if (typeof uri === 'number') {
    const asset = Image.resolveAssetSource(uri).uri;
    return {
      asset,
      type: 'asset',
    };
  }
  return { asset: uri };
}
export function load({ uri, key, volume, loop }: TInputLoad): Promise<number> {
  const { asset } = getAsset(uri);

  return ConcurrentSound.load(key, asset, volume ?? 1, loop ?? false);
}

export function play({ key }: TInput): Promise<number> {
  return ConcurrentSound.play(key);
}

export function pause({ key }: TInput): Promise<void> {
  return ConcurrentSound.pause(key);
}

export function seek({ key, to }: TInputSeek): Promise<boolean> {
  return ConcurrentSound.seek(key, to);
}

export function setVolume({ key, to }: TInputSeek): Promise<void> {
  return ConcurrentSound.setVolume(key, to);
}

export function setPlaybackRate({ key, to }: TInputSeek): Promise<void> {
  return ConcurrentSound.setPlaybackRate(key, to);
}

export function setLoop({ key, to }: TInputLoop): Promise<void> {
  return ConcurrentSound.setLoop(key, to);
}
/**
 * ios only
 */
export function setCategory({ to }: TInputCategory): Promise<void> | undefined {
  if (Platform.OS !== 'ios') {
    return;
  }
  return ConcurrentSound.setCategory(to);
}

export function stopAll(): Promise<boolean> {
  return ConcurrentSound.stopAll();
}
