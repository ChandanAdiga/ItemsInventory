//
//  HTTPTask.swift
//  ItemStore
//
//  Created by Chandan Adiga on 28/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation
public enum HTTPTask {
    case request
    
    case requestParameters(bodyParameters: Parameters?, urlParameters: Parameters?)
    
    case requestParametersAndHeaders(bodyParameters: Parameters?, urlParameters: Parameters?, headers: HTTPHeaders?)
    
    //Other cases like download upload etc..
}
