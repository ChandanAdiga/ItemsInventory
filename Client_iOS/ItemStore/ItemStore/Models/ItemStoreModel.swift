//
//  Item.swift
//  ItemStore
//
//  Created by Chandan Adiga on 27/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation

struct Item {
    let _id:String
    let name:String
    let price:Float
    let description:String
    let category:String
    let tags:String
}

extension Item: Decodable {
    
    enum ItemCodingKeys: String, CodingKey {
        case _id = "_id"
        case name = "name"
        case price = "price"
        case description = "description"
        case category = "category"
        case tags = "tags"
    }
    
    init(from decoder: Decoder) throws {
        
        let itemContainer = try decoder.container(keyedBy: ItemCodingKeys.self)
        
        _id = try itemContainer.decode(String.self, forKey: ._id)
        name = try itemContainer.decode(String.self, forKey: .name)
        price = try itemContainer.decode(Float.self, forKey: .price)
        description = try itemContainer.decode(String.self, forKey: .description)
        category = try itemContainer.decode(String.self, forKey: .category)
        tags = try itemContainer.decode(String.self, forKey: .tags)
    }
}

struct Items {
    let items:[Item]
}

extension Items: Decodable {
    
    enum ItemsCodingKeys: String, CodingKey {
        case items = "items"
    }
    
    init(from decoder: Decoder) throws {
        
        let itemContainer = try decoder.container(keyedBy: ItemsCodingKeys.self)
        
        items = try itemContainer.decode(Array.self, forKey: .items)
    }
}
