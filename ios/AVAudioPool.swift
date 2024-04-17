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
private var players =  [String: AVPlayer]()

class AVPlayerPool: NSObject {

    // Given the URL of a sound file, either create or reuse an audio player
    @objc
    static func playerWithUri(key: String, uri: String) -> AVPlayer? {
        // Try to find a player that can be reused and is not playing
        
        let playerToUse = players[key]

        // If we found one, return it
        if (playerToUse != nil){
            return playerToUse
        }
        
        var url: URL?
        if(uri.starts(with: "http") || uri.starts(with: "file://")) {
            url = URL(string: uri)
        }
        if(url != nil) {
            let playerItem = AVPlayerItem(url: url!)
            // Didn't find one? Create a new one
            let newPlayer = AVPlayer(playerItem: playerItem)
            players[key] = newPlayer
            return newPlayer
        }
        return nil
    }
}
