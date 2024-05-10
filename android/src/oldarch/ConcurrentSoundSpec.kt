package com.concurrentsound

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class ConcurrentSoundSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {
  abstract fun load(key: String?, uri: String, volume: Float, loop: Boolean, promise: Promise)
  abstract fun play(key: String?, uri: String, promise: Promise)
  abstract fun pause(key: String?, uri: String?, promise: Promise)
  abstract fun seek(key: String?, uri: String?, to: Double, promise: Promise )
  abstract fun setVolume(key: String?, uri: String?, to: Float, promise: Promise )
  abstract fun setLoop(key: String?, uri: String?, to: Boolean, promise: Promise )
  abstract fun stopAll(promise: Promise)
}
