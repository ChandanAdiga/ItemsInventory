//
//  JSONParameterEncoder.swift
//  ItemStore
//
//  Created by Chandan Adiga on 28/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation

public struct JSONParameterEncoder: ParameterEncoder {
    
    public static func encode(urlRequest: inout URLRequest, with paramerts: Parameters) throws {
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: paramerts, options: .prettyPrinted)
            
            urlRequest.httpBody = jsonData
            
            if urlRequest.value(forHTTPHeaderField: "Content-Type") == nil {
                urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
            }
        } catch {
            throw NetworkError.encodingFailed
        }
    }
    
}
