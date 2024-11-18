package com.concurrentsound

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class ConcurrentSoundSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {
  abstract fun load(key: String, uri: String, volume: Double, loop: Boolean, promise: Promise)
  abstract fun play(key: String, promise: Promise)
  abstract fun pause(key: String,  promise: Promise)
  abstract fun seek(key: String,  to: Double, promise: Promise )
  abstract fun setVolume(key: String, to: Double, promise: Promise )
  abstract fun setLoop(key: String, to: Boolean, promise: Promise )
  abstract fun stopAll(promise: Promise)
  abstract fun setCategory(to: String, promise: Promise)
  abstract fun setPlaybackRate(key: String, to: Double, promise: Promise)
}
