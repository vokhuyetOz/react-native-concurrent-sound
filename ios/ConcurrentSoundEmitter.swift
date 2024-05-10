//
//  File.swift
//  react-native-concurrent-sound
//
//  Created by CI-CD on 22/04/2024.
//

import Foundation

@objc(ConcurrentSoundEmitter)
open class ConcurrentSoundEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
      ConcurrentSoundEmitter.emitter = self
  }

  open override func supportedEvents() -> [String] {
    ["OnSoundEnd"]      // etc.
  }
    @objc public override static func requiresMainQueueSetup() -> Bool {
    return true
    }
}
