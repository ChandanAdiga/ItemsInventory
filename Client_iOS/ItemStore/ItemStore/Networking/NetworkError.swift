//
//  NetworkError.swift
//  ItemStore
//
//  Created by Chandan Adiga on 28/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation

public enum NetworkError: String, Error {
    case parametersNil = "Parameters were nil."
    case encodingFailed = "Parameters encoding failed"
    case missingURL = "URL is nil."
}
