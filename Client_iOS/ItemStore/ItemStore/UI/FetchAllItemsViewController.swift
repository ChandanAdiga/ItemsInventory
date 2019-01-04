//
//  FetchAllItemsViewController.swift
//  ItemStore
//
//  Created by Chandan Adiga on 27/11/18.
//  Copyright © 2018 Adiga. All rights reserved.
//

import UIKit

protocol ItemMenuDelegate {
    func onMenuClick(sender: UIButton, row:Int)
}

// https://www.appcoda.com/presentation-controllers-tutorial/
// https://stackoverflow.com/questions/28521583/uipopoverpresentationcontroller-on-iphone-doesnt-produce-popover
class FetchAllItemsViewController: UIViewController {
    
    private var networkManager:NetworkManager!
    @IBOutlet weak var itemsTableView: UITableView!
    
    private var result:[Item]!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        itemsTableView.delegate = self
        itemsTableView.dataSource = self
        
        networkManager = NetworkManager()
        
        fetchAllItems()
        
        itemsTableView.setEditing(false, animated: true)
    }
    
    func fetchAllItems() {
//        print("fetchAllItems()")
        networkManager.getAllItems() { items, error in
            if(error != nil) {
                print(error!)
                return
            }
//            for item in items! {
//                print("\(item.name)")
//            }
            self.result = items!
            self.reloadTableViewItems()
        }
    }
    
    func reloadTableViewItems() {
        DispatchQueue.main.async {
            self.itemsTableView.reloadData()
        }
    }
    
    func getAvailableItemsCount() -> Int {
        if(self.result != nil) {
            return self.result.count
        } else {
            return 0
        }
    }
    
    func onClickUpdateItem(row: Int) {
        let itemToUpdate: Item = self.result[row]
        print("Handle update item: \(itemToUpdate.name)")
    }
    
    func onClickDeleteItem(row: Int) {
        let itemToDelete: Item = self.result[row]
        print("Handle delete item: \(itemToDelete.name)")
    }
}


class ItemTableViewCell:UITableViewCell {
    
    var menuDelegate:ItemMenuDelegate!
    
    @IBOutlet weak var titleLabel: UILabel!
    
    @IBOutlet weak var priceLabel: UILabel!
    
    @IBOutlet weak var descriptionLabel: UILabel!
    
    @IBOutlet weak var categoryLabel: UILabel!
    
    @IBOutlet weak var tagsLabel: UILabel!
    
    @IBOutlet weak var optionsButton: UIButton!
    
    @IBAction func menuClicked(_ sender: UIButton) {
        menuDelegate.onMenuClick(sender: sender, row: sender.tag)
    }
    
    
}

extension FetchAllItemsViewController:UITableViewDelegate,UITableViewDataSource, ItemMenuDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return getAvailableItemsCount()
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let itemCell: ItemTableViewCell = self.itemsTableView.dequeueReusableCell(withIdentifier: "templateItemCell") as! ItemTableViewCell
        itemCell.titleLabel.text = "\(self.result[indexPath.row].name)"
        itemCell.priceLabel.text = "Price\t\t:  \(self.result[indexPath.row].price)"
        itemCell.descriptionLabel.text = "Description\t:  \(self.result[indexPath.row].description)"
        itemCell.categoryLabel.text = "Category\t\t:  \(self.result[indexPath.row].category)"
        itemCell.tagsLabel.text = "Tags\t\t:  \(self.result[indexPath.row].tags)"
        
        itemCell.optionsButton.tag = indexPath.row
        itemCell.menuDelegate = self
        
        return itemCell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: false)
    }
    
    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return 150
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 150
    }
    
    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        let updateAction = UITableViewRowAction(style: .normal, title: "Update") { (rowAction, indexPath) in self.onClickUpdateItem(row: indexPath.row)
        }
        let deleteAction = UITableViewRowAction(style: .normal, title: "Delete") { (rowAction, indexPath) in self.onClickDeleteItem(row: indexPath.row)
        }
        updateAction.backgroundColor  = UIColor.gray
        deleteAction.backgroundColor = UIColor.red
        return [updateAction,deleteAction]
    }
    
    func onMenuClick(sender: UIButton, row: Int) {
        print("Clicked on menu of item:\(self.result[row].name)")
        let alertController = UIAlertController(title: self.result[row].name, message: "Would you like to", preferredStyle: .actionSheet)
        
        let updateAction = UIAlertAction(title: "Update", style: .default, handler: {(action) in self.onClickUpdateItem(row: row)})
        let deleteAction = UIAlertAction(title: "Delete", style: .destructive, handler: {(action) in self.onClickDeleteItem(row: row)})
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        
        alertController.addAction(updateAction)
        alertController.addAction(deleteAction)
        alertController.addAction(cancelAction)
        
        self.navigationController!.present(alertController, animated: true, completion: nil)
    }
    
    
}
