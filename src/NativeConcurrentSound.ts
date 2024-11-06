import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  load(
    key: string,
    uri: string,
    volume: number,
    loop: boolean
  ): Promise<number>;
  play(key: string, uri: string): Promise<number>;
  pause(key: string, uri: string): Promise<void>;
  seek(key: string, uri: string, to: number): Promise<boolean>;
  setVolume(key: string, uri: string, to: number): Promise<void>;
  setPlaybackRate(key: string, uri: string, to: number): Promise<void>;
  setLoop(key: string, uri: string, to: boolean): Promise<void>;
  setCategory(
    to: 'soloAmbient' | 'ambient' | 'playback'
  ): Promise<void> | undefined;
  stopAll(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ConcurrentSound');
