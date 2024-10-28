package com.concurrentsound

import android.media.AudioAttributes
import android.media.MediaPlayer
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
    try {
      latestActiveKey = activeKey

      // Get or create player
      val playerToUse = MediaPlayerPool.playerWithUri(activeKey)

      // If already loaded, just update properties and return
      if (loadSoundStatus[activeKey] == true) {
        try {
          playerToUse.setVolume(volume, volume)
          playerToUse.isLooping = loop
          promise.resolve(playerToUse.duration)
          return
        } catch (e: Exception) {
          // If there's an error with the existing player, continue to reload
          loadSoundStatus[activeKey] = false
        }
      }

      // Reset and clear any previous state
      try {
        playerToUse.reset()
      } catch (e: Exception) {
        // Ignore reset errors
      }

      // Configure player
      playerToUse.setVolume(volume, volume)
      playerToUse.isLooping = loop

      // Set error listener before setting data source
      playerToUse.setOnErrorListener { mp, what, extra ->
        loadSoundStatus[activeKey] = false
        val errorMessage = when (what) {
          MediaPlayer.MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK ->
            "Media Error: Not valid for progressive playback ($what, $extra)"
          MediaPlayer.MEDIA_ERROR_SERVER_DIED ->
            "Media Error: Server died ($what, $extra)"
          MediaPlayer.MEDIA_ERROR_UNKNOWN ->
            "Media Error: Unknown ($what, $extra)"
          else -> "Media Error: ($what, $extra)"
        }
        promise.reject("MEDIA_ERROR", errorMessage)
        true
      }

      // Set prepared listener
      playerToUse.setOnPreparedListener { mp ->
        loadSoundStatus[activeKey] = true
        if (mp.duration == -1) {
          promise.resolve(-1)
        } else {
          promise.resolve(mp.duration)
        }
      }

      // Handle different URI types
      when {
        uri.startsWith("http") || uri.startsWith("https") || uri.startsWith("file://") -> {
          val myUri = Uri.parse(uri)
          playerToUse.setDataSource(reactApplicationContext, myUri)
        }
        uri.startsWith("/") -> {
          // Handle absolute file paths
          playerToUse.setDataSource(uri)
        }
        else -> {
          // Handle relative paths or other formats
          val assetManager = reactApplicationContext.assets
          val fileDescriptor = assetManager.openFd(uri)
          playerToUse.setDataSource(
            fileDescriptor.fileDescriptor,
            fileDescriptor.startOffset,
            fileDescriptor.length
          )
          fileDescriptor.close()
        }
      }

      // Start async preparation
      playerToUse.prepareAsync()

    } catch (e: Exception) {
      loadSoundStatus[activeKey] = false
      promise.reject("LOAD_ERROR", "Error loading sound: ${e.message}")
    }
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

  @ReactMethod
  fun setPlaybackRate(key: String?, uri: String?, to: Float, promise: Promise) {
    try {
      val activeKey = getActiveKey(key, uri)
      val playerToUse = MediaPlayerPool.playerWithUri(activeKey)
        // Create new PlaybackParams
        val params = PlaybackParams()
        params.speed = to
        // Assign the new params to the player
        playerToUse.playbackParams = params
        promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("PLAYBACK_SPEED_ERROR", "Error setting playback rate: ${e.message}")
    }
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
