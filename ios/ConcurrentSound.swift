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
    
    currentActiveKey = key
    loopSound[key] = loop
    let player = AVPlayerPool.playerWithUri(key: key)
    if(loadSoundStatus[key] == true){
      // resolve((player.currentItem?.asset.duration.seconds)!*1000) //miliseconds
      if let currentItem = player.currentItem {
        let duration = currentItem.asset.duration.seconds
        if duration.isFinite {
            resolve(duration * 1000) // Return duration in milliseconds
        } else {
            reject("DURATION_ERROR", "Invalid duration for loaded sound", nil)
        }
      } else {
          reject("PLAYER_ERROR", "Current item is nil for already loaded sound", nil)
      }
      return
    }
    loadSoundStatus[key] = true
    var url: URL?
    if(uri.starts(with: "http") || uri.starts(with: "file://")) {
      url = URL(string: uri)
    }
    
    if(url != nil) {
      let playerItem = AVPlayerItem(url: url!)
      
      player.replaceCurrentItem(with: playerItem)
      
    }
    player.volume = volume
    
    // resolve((player.currentItem?.asset.duration.seconds)!*1000) //miliseconds
    if let currentItem = player.currentItem {
        let duration = currentItem.asset.duration.seconds
        resolve(duration * 1000)  // Convert to milliseconds
    } else {
        reject("PLAYER_ERROR", "Current item is nil", nil)
    }
    NotificationCenter.default.addObserver(forName: AVPlayerItem.didPlayToEndTimeNotification, object: player.currentItem,
                                           queue: .main, using: {notification in
      ConcurrentSoundEmitter.emitter.sendEvent(withName: "OnSoundEnd", body: ["key": key])
      let playerToUse = AVPlayerPool.playerWithUri(key: key)
      if(playerToUse.currentItem == nil){
        return
      }
      playerToUse.pause()
      if(self.loopSound[key] == true){
        playerToUse.currentItem?.seek(to: CMTime.zero, completionHandler: { _ in
          playerToUse.play()
        })
        return
      }
      playerToUse.currentItem?.seek(to: CMTime.zero, completionHandler: nil)
    })
  }
  
  @objc(play:withResolver:withRejecter:)
  func play(key: String, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    let player = AVPlayerPool.playerWithUri(key: key)
    player.play()
    
    // resolve((player.currentItem?.asset.duration.seconds)!*1000) //miliseconds
    if let currentItem = player.currentItem {
        let duration = currentItem.asset.duration.seconds
        resolve(duration * 1000)  // Convert to milliseconds
    } else {
        reject("PLAYER_ERROR", "Current item is nil", nil)
    }
  }
  
  @objc(pause:withResolver:withRejecter:)
  func pause(key: String, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    
    let player = AVPlayerPool.playerWithUri(key: key)
    
    player.pause()
  }
  
  @objc(seek:to:withResolver:withRejecter:)
  func seek(key: String, to: Double, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    let player = AVPlayerPool.playerWithUri(key: key)
    
    player.seek(to: CMTimeMakeWithSeconds(to,preferredTimescale: 1000), completionHandler: { success in
      resolve(success)
    })
  }
  
  @objc(setVolume:to:withResolver:withRejecter:)
  func setVolume(key: String, to: Float, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    let player = AVPlayerPool.playerWithUri(key: key)
    
    player.volume = to
  }
  
  @objc(setPlaybackRate:to:withResolver:withRejecter:)
  func setPlaybackRate(key: String, to: Float, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    let player = AVPlayerPool.playerWithUri(key: key)
    
    player.rate = to
  }
  
  @objc(setLoop:to:withResolver:withRejecter:)
  func setLoop(key: String, to: Bool, resolve: @escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    
    loopSound[key] = to
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
}

