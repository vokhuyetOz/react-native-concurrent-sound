package com.concurrentsound

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri

private var players = HashMap<String, MediaPlayer>()

class MediaPlayerPool {
   companion object {
     fun playerWithUri(key: String): MediaPlayer {
       // Try to find a player that can be reused and is not playing

       var playerToUse = players[key]

       // If we found one, return it
       if (playerToUse != null) {
         return playerToUse
       }
       playerToUse = MediaPlayer()
       players[key] = playerToUse
       return playerToUse
     }
     fun stopAll(){
       players.forEach {
         val player = it.value
         player.stop()
         player.release()
       }
       players = HashMap()
     }
   }
}
