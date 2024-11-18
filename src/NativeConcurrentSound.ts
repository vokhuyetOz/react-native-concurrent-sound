import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  load(
    key: string,
    uri: string,
    volume: number,
    loop: boolean
  ): Promise<number>;
  play(key: string): Promise<number>;
  pause(key: string): Promise<void>;
  seek(key: string, to: number): Promise<boolean>;
  setVolume(key: string, to: number): Promise<void>;
  setPlaybackRate(key: string, to: number): Promise<void>;
  setLoop(key: string, to: boolean): Promise<void>;
  setCategory(to: string): Promise<void>;
  stopAll(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ConcurrentSound');
