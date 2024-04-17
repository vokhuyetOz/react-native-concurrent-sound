//
//  ConcurrentSound.swift
//  react-native-concurrent-sound
//
//  Created by CI-CD on 15/04/2024.
//

import Foundation
 import AVFoundation

@objc(ConcurrentSound)
class ConcurrentSound: NSObject {
    
    var player: AVPlayer?
    var currentActiveUri: String?
    var currentActiveKey: String?

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc(play:uri:withResolver:withRejecter:)
    func play(key: String, uri: String, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let player = AVPlayerPool.playerWithUri(key: key, uri: uri)
        let audioSession = AVAudioSession.sharedInstance()
        
        try! audioSession.setCategory(AVAudioSession.Category.ambient)
        
        currentActiveUri = uri
        currentActiveKey = key
        player?.play()
    }
    @objc(pause:uri:withResolver:withRejecter:)
    func pause(key: String?, uri: String?, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        if(currentActiveUri == nil) {
            reject("404", "Have not init player", nil)
            return
        }
        let activeUri = (uri ?? currentActiveUri)!
        let activeKey = (key ?? currentActiveKey)!
        let player = AVPlayerPool.playerWithUri(key: activeKey, uri: activeUri)
        
        player?.pause()
    }
    
    @objc(seek:uri:to:withResolver:withRejecter:)
    func seek(key: String?, uri: String?, to: Double, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        if(currentActiveUri == nil) {
            reject("404", "Have not init player", nil)
            return
        }
        let activeUri = (uri ?? currentActiveUri)!
        let activeKey = (key ?? currentActiveKey)!
        let player = AVPlayerPool.playerWithUri(key: activeKey, uri: activeUri)
        
        player?.seek(to: CMTimeMakeWithSeconds(to,preferredTimescale: 1000), completionHandler: { success in
            resolve(success)
        })
    }
    
    @objc(setVolume:uri:to:withResolver:withRejecter:)
    func setVolume(key: String?, uri: String?, to: Float, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        if(currentActiveUri == nil) {
            reject("404", "Have not init player", nil)
            return
        }
        let activeUri = (uri ?? currentActiveUri)!
        let activeKey = (key ?? currentActiveKey)!
        let player = AVPlayerPool.playerWithUri(key: activeKey, uri: activeUri)
        
        player?.volume = to
    }
}

