//
//  NetworkManager.swift
//  ItemStore
//
//  Created by Chandan Adiga on 28/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import Foundation

enum Result<String> {
    case success
    case failure(String)
}

struct FailableDecodable<Base : Decodable> : Decodable {
    
    let base: Base?
    
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        self.base = try? container.decode(Base.self)
    }
}

struct NetworkManager {
    private let router = Router<ItemStoreAPI>()
    
    fileprivate func handleNetworkResponse(_ response: HTTPURLResponse) -> Result<String> {
        switch response.statusCode {
            case 200: return .success
            default: return .failure("Received response code: \(response.statusCode)")
        }
    }
    
    func getAllItems(completion: @escaping (_ items: [Item]?, _ error: String?) -> ()) {
        router.request(.getAllItems()) { data, response, error in
            if(error != nil) {
                completion(nil, "Check your network connection..")
            }
            if let response = response as? HTTPURLResponse {
                let result = self.handleNetworkResponse(response)
                switch result {
                    case .success:
                        guard let responseData = data else {
                            completion(nil, "No data!")
                            return
                        }
                        do {
//                            print(responseData)
//                            let jsonData = try JSONSerialization.jsonObject(with: responseData, options: .mutableContainers)
//                            print(jsonData)
                            
                            let apiResponse = try JSONDecoder()
                                .decode(Items.self, from:responseData)
                            
                            completion(apiResponse.items,nil)
                        } catch {
                            print(error)
                            completion(nil, "Unable to decode response!")
                        }
                    case .failure(let error):
                        completion(nil, error)
                }
            }
        }
    }
    
    func searchItems(searchQuery: String, completion: @escaping (_ items: [Item]?, _ error: String?) -> ()) {
        router.request(.searchItems(searchQuery: searchQuery)) { data, response, error in
            if(error != nil) {
                completion(nil, "Check your network connection..")
            }
            if let response = response as? HTTPURLResponse {
                let result = self.handleNetworkResponse(response)
                switch result {
                case .success:
                    guard let responseData = data else {
                        completion(nil, "No data!")
                        return
                    }
                    do {
//                        print(responseData)
//                        let jsonData = try JSONSerialization.jsonObject(with: responseData, options: .mutableContainers)
//                        print(jsonData)
                        
                        let apiResponse = try JSONDecoder()
                            .decode(Items.self, from:responseData)
                        
                        completion(apiResponse.items,nil)
                    } catch {
                        print(error)
                        completion(nil, "Unable to decode response!")
                    }
                case .failure(let error):
                    completion(nil, error)
                }
            }
        }
    }
    
    
}


