
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNConcurrentSoundSpec.h"

@interface ConcurrentSound : NSObject <NativeConcurrentSoundSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ConcurrentSound : NSObject <RCTBridgeModule>
#endif

@end
