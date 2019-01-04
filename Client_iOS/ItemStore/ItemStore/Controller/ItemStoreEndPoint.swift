//
//  ItemStoreEndPoint.swift
//  ItemStore
//
//  Created by Chandan Adiga on 28/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation

public enum ItemStoreAPI {
    case getAllItems()
    case addItem(name:String,price:Float,description:String,category:String,tags:String)
    case updateItem(itemId:String,name:String,price:Float,description:String,category:String,tags:String)
    case deleteItem(itemId:String)
    case searchItems(searchQuery:String)
}

extension ItemStoreAPI: EndPointType {
    
    var baseURL: URL {
        guard let url = URL(string: "http://127.0.0.1:3332/") else {
            fatalError("Base URL could not be configured!")
        }
        return url
    }
    
    var path: String {
        switch self {
            case .getAllItems():
                return "getAllItems"
            
            case .deleteItem(_) :
                return "deleteItem"
            
            case .addItem(_):
                return "addItem"
            
            case .searchItems(_):
                return "searchItems"
            
            case .updateItem(_):
                return "updateItem"
        }
    }
    
    var method: HTTPMethod {
        switch self {
            case .getAllItems():
                return .GET
            
            case .deleteItem(_):
                return .DELETE
            
            case .addItem(_):
                return .POST
            
            case .searchItems(_):
                return .GET
            
            case .updateItem(_):
                return .POST
        }
    }
    
    var task: HTTPTask {
        switch self {
            case .deleteItem(let itemId):
                return .requestParameters(bodyParameters: nil, urlParameters: ["itemId":itemId])
            
            case .addItem(let name, let price, let description, let category,let tags):
                return .requestParameters(bodyParameters: ["name":name,"price":price,"description":description,"category":category,"tags":tags], urlParameters:nil)
            
            case .searchItems(let searchQuery):
                return .requestParameters(bodyParameters: nil, urlParameters: ["searchQuery":searchQuery])
            
            case .updateItem(let itemId, let name, let price, let description, let category,let tags):
                return .requestParameters(bodyParameters: ["itemId":itemId,"name":name,"price":price,"description":description,"category":category,"tags":tags], urlParameters:nil)
            default:
                return .request
        }
    }
    
    var headers: HTTPHeaders? {
        return nil
    }
    
    
}
