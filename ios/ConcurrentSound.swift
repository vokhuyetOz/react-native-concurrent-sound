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
    
    var currentActiveKey: String?
    private var loadSoundStatus = [String: Bool]()
    private var loopSound = [String: Bool]()
    
    override init() {
        let audioSession = AVAudioSession.sharedInstance()
        try! audioSession.setCategory(AVAudioSession.Category.playback)
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc(load:uri:volume:loop:withResolver:withRejecter:)
    func load(key: String, uri: String, volume: Float, loop: Bool, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let activeKey = getActiveKey(key: key, uri: uri)
        currentActiveKey = activeKey
        loopSound[activeKey] = loop
        let player = AVPlayerPool.playerWithUri(key: activeKey)
        if(loadSoundStatus[activeKey] == true){
            resolve((player.currentItem?.asset.duration.seconds)!*1000) //miliseconds
            return
        }
        loadSoundStatus[activeKey] = true
        var url: URL?
        if(uri.starts(with: "http") || uri.starts(with: "file://")) {
            url = URL(string: uri)
        }
        
        if(url != nil) {
            let playerItem = AVPlayerItem(url: url!)
            
            player.replaceCurrentItem(with: playerItem)
            
        }
        player.volume = volume
        
        resolve((player.currentItem?.asset.duration.seconds)!*1000) //miliseconds
    }
    
    @objc(play:uri:withResolver:withRejecter:)
    func play(key: String, uri: String, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        
        let activeKey = getActiveKey(key: key, uri: uri)
        
        let player = AVPlayerPool.playerWithUri(key: activeKey)
       
        NotificationCenter.default.addObserver(forName: AVPlayerItem.didPlayToEndTimeNotification, object: player.currentItem,
                                               queue: .main, using: {notification in
            ConcurrentSoundEmitter.emitter.sendEvent(withName: "OnSoundEnd", body: ["key": activeKey, "uri": uri])
            if(self.loopSound[activeKey] == true){
                let playerToUse = AVPlayerPool.playerWithUri(key: activeKey)
                if(playerToUse.currentItem == nil){
                    return
                }
                playerToUse.pause()
                playerToUse.currentItem?.seek(to: CMTime.zero, completionHandler: { _ in
                    playerToUse.play()
                })
            }
        })
        
        player.play()
        
        resolve((player.currentItem?.asset.duration.seconds)!*1000) //miliseconds
    }
    
    @objc(pause:uri:withResolver:withRejecter:)
    func pause(key: String?, uri: String?, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let activeKey = getActiveKey(key: key, uri: uri)
        
        let player = AVPlayerPool.playerWithUri(key: activeKey)
        
        player.pause()
    }
    
    @objc(seek:uri:to:withResolver:withRejecter:)
    func seek(key: String?, uri: String?, to: Double, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let activeKey = getActiveKey(key: key, uri: uri)
        let player = AVPlayerPool.playerWithUri(key: activeKey)
        
        player.seek(to: CMTimeMakeWithSeconds(to,preferredTimescale: 1000), completionHandler: { success in
            resolve(success)
        })
    }
    
    @objc(setVolume:uri:to:withResolver:withRejecter:)
    func setVolume(key: String?, uri: String?, to: Float, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let activeKey = getActiveKey(key: key, uri: uri)
        let player = AVPlayerPool.playerWithUri(key: activeKey)
        
        player.volume = to
    }
    @objc(setLoop:uri:to:withResolver:withRejecter:)
    func setLoop(key: String?, uri: String?, to: Bool, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let activeKey = getActiveKey(key: key, uri: uri)
        
        loopSound[activeKey] = to
    }
    @objc(setCategory:withResolver:withRejecter:)
    func setCategory(to: String, resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        let audioSession = AVAudioSession.sharedInstance()
        var category = AVAudioSession.Category.playback
        if(to == "soloAmbient") {
            category = AVAudioSession.Category.soloAmbient
        } else if (to == "ambient"){
            category = AVAudioSession.Category.ambient
        }
        try! audioSession.setCategory(category)
    }
    @objc(stopAll:withRejecter:)
    func stopAll( resolve: RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        AVPlayerPool.stopAll()
        loadSoundStatus = [String: Bool]()
        loopSound = [String: Bool]()
        resolve(true)
    }
    
    @objc
    private func getActiveKey(key: String?, uri: String?) -> String {
        if(key != nil){
            return key!
        }
        if(uri != nil){
            return uri!
        }
        return currentActiveKey!
    }
}

