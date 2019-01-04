//
//  ParameterEncoding.swift
//  ItemStore
//
//  Created by Chandan Adiga on 28/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation

public typealias Parameters = [String:Any]

public protocol ParameterEncoder {
    static func encode(urlRequest: inout URLRequest, with paramerts: Parameters) throws
}
