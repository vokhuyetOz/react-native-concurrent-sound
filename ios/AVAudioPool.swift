//
//  AVAudioPool.swift
//  react-native-concurrent-sound
//
//  Created by CI-CD on 16/04/2024.
//

import Foundation
import AVFoundation
import AVKit

// An array of all players stored in the pool; not accessible
// outside this file
private var players = [String: AVPlayer]()

class AVPlayerPool: NSObject {
    
    // Given the URL of a sound file, either create or reuse an audio player
    @objc
    static func playerWithUri(key: String) -> AVPlayer {
        // Try to find a player that can be reused and is not playing
        if let playerToUse = players[key] {
            return playerToUse
        }
        let newPlayer = AVPlayer()
        players[key] = newPlayer
        return newPlayer
    }
    
    @objc
    static func stopAll() {
        players.forEach { item in
            item.value.pause()
            NotificationCenter.default.removeObserver(
                self,
                name: .AVPlayerItemDidPlayToEndTime,
                object: item.value.currentItem
            )
        }
        players.removeAll()
    }
}
