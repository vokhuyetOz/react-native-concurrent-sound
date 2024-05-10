import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

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

export function load({
  uri,
  key = uri,
  volume = 1,
  loop = false,
}: TInputLoad): Promise<number> {
  return ConcurrentSound.load(key, uri, volume, loop);
}

export function play({ uri, key = uri }: TInput): Promise<number> {
  return ConcurrentSound.play(key, uri);
}

export function pause({ uri, key = uri }: TInput): Promise<void> {
  return ConcurrentSound.pause(key, uri);
}

export function seek({ uri, key = uri, to }: TInputSeek): Promise<boolean> {
  return ConcurrentSound.seek(key, uri, to);
}

export function setVolume({ uri, key = uri, to }: TInputSeek): Promise<void> {
  return ConcurrentSound.setVolume(key, uri, to);
}
export function setLoop({ uri, key = uri, to }: TInputSeek): Promise<void> {
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
