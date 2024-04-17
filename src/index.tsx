import { NativeModules, Platform } from 'react-native';

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

export function play({ uri, key }: TInput): Promise<void> {
  return ConcurrentSound.play(key ?? uri, uri);
}

export function pause({ uri, key }: TInput): Promise<void> {
  return ConcurrentSound.pause(key ?? uri, uri);
}

export function seek({ uri, key, to }: TInputSeek): Promise<boolean> {
  return ConcurrentSound.seek(key ?? uri, uri, to);
}

export function setVolume({ uri, key, to }: TInputSeek): Promise<void> {
  return ConcurrentSound.setVolume(key ?? uri, uri, to);
}
