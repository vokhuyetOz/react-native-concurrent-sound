package com.concurrentsound

import android.content.ContentResolver
import android.media.PlaybackParams
import android.net.Uri
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactMethod
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
  override fun load(
    key: String,
    uri: String,
    volume: Double,
    loop: Boolean,
    promise: Promise
  ) {
    latestActiveKey = key
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    if(loadSoundStatus[key] == true){
      promise.resolve(playerToUse.duration)
      return
    }
    try {
        playerToUse.setVolume(volume.toFloat(), volume.toFloat())
        playerToUse.isLooping = loop
        loadSoundStatus[key] = true
        if (uri.startsWith("http") || uri.startsWith("file://")|| uri.startsWith("content://")) {
            val myUri = Uri.parse(uri)
            playerToUse.setDataSource(this.reactApplicationContext, myUri)
        } else {
            val resourceId: Int =
             this.reactApplicationContext.resources.getIdentifier( uri, "raw", this.reactApplicationContext.packageName)

            val url = Uri.Builder().scheme(ContentResolver.SCHEME_ANDROID_RESOURCE)
                .authority(this.reactApplicationContext.resources.getResourcePackageName(resourceId))
                .appendPath(this.reactApplicationContext.resources.getResourceTypeName(resourceId))
                .appendPath(this.reactApplicationContext.resources.getResourceEntryName(resourceId)).build()
            playerToUse.setDataSource(this.reactApplicationContext, url)
        }


        playerToUse.setOnPreparedListener {
            if (it.duration == -1) {
                promise.resolve(-1)
            } else {
                promise.resolve(it.duration)
            }
        }
        playerToUse.setOnErrorListener { _, what, extra ->
            promise.reject("MediaPlayerError", "Error during preparation: What=$what, Extra=$extra")
            return@setOnErrorListener true
        }
        playerToUse.prepareAsync()
    } catch (e: Exception) {
        promise.reject("LoadError", "Failed to load sound with URI: $uri", e)
    }
  }

  @ReactMethod
  override fun play(
    key: String, promise: Promise
  ) {
    latestActiveKey = key
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    playerToUse.start()
    playerToUse.setOnCompletionListener {
      val params = Arguments.createMap().apply {
        putString("key", key)
      }
      sendEvent(this.reactApplicationContext, "OnSoundEnd", params)
    }
    promise.resolve(playerToUse.duration)
  }

  @ReactMethod
  override fun pause(key: String, promise: Promise) {
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    playerToUse.pause()
  }

  @ReactMethod
  override fun seek(key: String, to: Double, promise: Promise) {
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    playerToUse.seekTo((to * 1000).toInt())
  }

  @ReactMethod
  override fun setVolume(key: String, to: Double, promise: Promise) {
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    playerToUse.setVolume(to.toFloat(), to.toFloat())
  }

  @RequiresApi(Build.VERSION_CODES.M)
  @ReactMethod
  override fun setPlaybackRate(key: String, to: Double, promise: Promise) {
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    playerToUse.playbackParams = PlaybackParams().setSpeed(to.toFloat())
  }

  @ReactMethod
  override fun setLoop(key: String, to: Boolean, promise: Promise) {
    val playerToUse = MediaPlayerPool.playerWithUri(key)
    playerToUse.isLooping = to
  }
  @ReactMethod
  override fun stopAll(promise: Promise) {
    MediaPlayerPool.stopAll()
    loadSoundStatus = HashMap()
    promise.resolve(true)
  }
  @ReactMethod
  override fun setCategory(to: String, promise: Promise) {
    TODO("Not yet implemented")
  }


  companion object {
    const val NAME = "ConcurrentSound"
  }
}
