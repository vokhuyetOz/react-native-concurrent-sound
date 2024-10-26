package com.concurrentsound

import android.media.AudioAttributes
import android.media.PlaybackParams
import android.net.Uri
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
  reactContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    .emit(eventName, params)
}
class ConcurrentSoundModule internal constructor(context: ReactApplicationContext) :
  ConcurrentSoundSpec(context) {
  private var listenerCount = 0

  private var latestActiveKey: String? = null
  private var loadSoundStatus: HashMap<String, Boolean> = HashMap()
  override fun initialize() {
    super.initialize()

  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun addListener(eventName: String) {
//    if (listenerCount == 0) {
//      // Set up any upstream listeners or background tasks as necessary
//    }
    listenerCount += 1
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    listenerCount -= count
//    if (listenerCount == 0) {
//      // Remove upstream listeners, stop unnecessary background tasks
//    }
  }
  // See https://reactnative.dev/docs/native-modules-android

  @ReactMethod
  override fun load(key: String?, uri: String, volume: Float, loop: Boolean, promise: Promise) {
    val activeKey = getActiveKey(key, uri)
    latestActiveKey = activeKey
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    if(loadSoundStatus[activeKey] == true){
      promise.resolve(playerToUse.duration)
      return
    }
    playerToUse.setVolume(volume, volume)
    playerToUse.isLooping = loop
    loadSoundStatus[activeKey] = true
    if (uri.startsWith("http") || uri.startsWith("file://")) {
      val myUri = Uri.parse(uri)
      playerToUse.setDataSource(this.reactApplicationContext, myUri)
    }
    playerToUse.setOnPreparedListener {
      if (it.duration == -1) {
        promise.resolve(-1)
      } else {
        promise.resolve(it.duration)
      }
    }
    playerToUse.prepareAsync()
  }

  @ReactMethod
  override fun play(
    key: String?, uri: String, promise: Promise
  ) {
    val activeKey = getActiveKey(key, uri)
    latestActiveKey = activeKey
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    playerToUse.start()
    playerToUse.setOnCompletionListener {
      val params = Arguments.createMap().apply {
        putString("key", activeKey)
        putString("uri", uri)
      }
      sendEvent(this.reactApplicationContext, "OnSoundEnd", params)
    }
    promise.resolve(playerToUse.duration)
  }

  @ReactMethod
  override fun pause(key: String?, uri: String?, promise: Promise) {
    val activeKey = getActiveKey(key, uri)
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    playerToUse.pause()
  }

  @ReactMethod
  override fun seek(key: String?, uri: String?, to: Double, promise: Promise) {
    val activeKey = getActiveKey(key, uri)
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    playerToUse.seekTo((to * 1000).toInt())
  }

  @ReactMethod
  override fun setVolume(key: String?, uri: String?, to: Float, promise: Promise) {
    val activeKey = getActiveKey(key, uri)
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    playerToUse.setVolume(to, to)
  }

  @RequiresApi(Build.VERSION_CODES.M)
  @ReactMethod
  fun setPlaybackRate(key: String?, uri: String?, to: Float, promise: Promise) {
    val activeKey = getActiveKey(key, uri)
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    playerToUse.playbackParams = PlaybackParams().setSpeed(to)
  }

  @ReactMethod
  override fun setLoop(key: String?, uri: String?, to: Boolean, promise: Promise) {
    val activeKey = getActiveKey(key, uri)
    val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
    playerToUse.isLooping = to
  }
  @ReactMethod
  override fun stopAll(promise: Promise) {
    MediaPlayerPool.stopAll()
    loadSoundStatus = HashMap()
    promise.resolve(true)
  }

  private fun getActiveKey(key: String?, uri: String?): String {
    if (key != null) {
      return key
    }
    if (uri != null) {
      return uri
    }
    return latestActiveKey!!
  }

  companion object {
    const val NAME = "ConcurrentSound"
  }
}
