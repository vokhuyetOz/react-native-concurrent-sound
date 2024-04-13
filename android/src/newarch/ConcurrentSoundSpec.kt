package com.concurrentsound

import com.facebook.react.bridge.ReactApplicationContext

abstract class ConcurrentSoundSpec internal constructor(context: ReactApplicationContext) :
  NativeConcurrentSoundSpec(context) {
}
