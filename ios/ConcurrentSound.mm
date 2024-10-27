//
//  ConcurrentSound.cpp
//  react-native-concurrent-sound
//
//  Created by CI-CD on 15/04/2024.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNConcurrentSoundSpec.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#endif


@interface RCT_EXTERN_MODULE(ConcurrentSound, NSObject)

RCT_EXTERN_METHOD(load:(NSString)key uri: (NSString)uri volume: (float)volume loop: (BOOL)loop
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(play:(NSString)key uri: (NSString)uri
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(pause:(NSString)key uri:(NSString)uri
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(seek:(NSString)key uri:(NSString)uri to:(double) to
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(setVolume:(NSString)key uri:(NSString)uri to:(float) to
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(setPlaybackRate:(NSString)key uri:(NSString)uri to:(float) to
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(setLoop:(NSString)key uri:(NSString)uri to:(BOOL) to
                  withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(setCategory:(NSString)to withResolver:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(stopAll:(RCTPromiseResolveBlock) resolve
                  withRejecter:(RCTPromiseRejectBlock) reject)

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeConcurrentSoundSpecJSI>(params);
}
#endif

@end
