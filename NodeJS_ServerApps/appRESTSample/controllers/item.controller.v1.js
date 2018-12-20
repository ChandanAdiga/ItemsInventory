const Item = require('../models/item.model.js');

exports.getAPIs = (req, res) => {
    res.status(200).end(
        "<html>"
            +"<head>"
                +"<title>Sample REST API</title>"
            +"</head>"
            +"<body>"
                +"<h4>Hello there!</h4>"
                +"<br><br><pre>You can use below end points: \n\t1) POST: /addItem \n\tOR \n\t2) DELETE: /deleteItem \n\tOR \n\t3) GET: /getAllItems \n\tOR \n\t4) GET: /getItem \n\tOR \n\t5) GET: /searchItems</pre>"
            +"</body>"
        +"</html>"
    );
};

exports.addItem = (req, res) => {
    // console.log(req.query);
    // console.log(req.body);
    if(!req.body) {
        return res.status(400).send({
            message:"Item details can not be empty!"
        });
    }

    //Auto generated id will be available: itemObj._id

    const item = new Item({
        name: req.body.name || "No name",
        price: req.body.price || 0.0,
        description: req.body.description || "General Item",
        category: req.body.category || "General",
        tags: req.body.tags || "General Item"
    });

    item.save().then(data => {
        res.status(200)
            .send(data);
            // .send({
            //     message: "success"
            // });
    }).catch(error => {
        res.status(500).send({
            message: error.message || "Some error occured while adding the item!"
        });
    });
};

exports.getItem = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    // console.log(req.query);
    if(!req.query) {
        return res.status(400).send({
            message:"'itemId' param should be passed with a valid item id!"
        });
    }

    Item.findById(req.query.itemId).then( item => {
        if(!item) {
            return res.status(404).send({
                message: "No item found for ID: " + req.query.itemId
            });
        }
        res.status(200).send(item);
    }).catch(err => {
        if(err.kind == 'ObjectId') {
            return res.status(404).send({
                message: "Item not found for ID: " + req.query.itemId
            });
        }
        return res.status(500).send({
            message: "Error while retrieving item with ID: " + req.query.itemId
        });
    });
};

exports.getAllItems = (req, res) => {
    Item.find().then(items => {
        // console.log({items});
        res.status(200).send({items});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while fetching all items!"
        });
    });
};

exports.updateItem = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    // console.log(req.body);
    if(!req.body) {
        return res.status(400).send({
            message:"Body should be passed with a valid item id!"
        });
    }
    if(!req.body.itemId) {
        return res.status(400).send({
            message:"'itemId' param should be passed with along with other attributes to update !"
        });
    }

    Item.findByIdAndUpdate(req.body.itemId, {
        name: req.body.name || "No name",
        price: req.body.price || 0.0,
        description: req.body.description || "General Item",
        category: req.body.category || "General",
        tags: req.body.tags || "General Item"
    },
    {new: true}) //returns the modified document to the then function instead of the original
    .then(item =>{
        if(!item) {
            return res.status(404).send({
                message: "No item found to update with ID: " + req.body.itemId
            });
        }
        res.status(200).send(item);
    }).catch(err => {
        if(err.kind == 'ObjectId') {
            return res.status(404).send({
                message: "Item not found for ID: " + req.body.itemId
            });
        }
        return res.status(500).send({
            message: "Error while updating item with ID: " + req.body.itemId
        });
    });
};

exports.deleteItem = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    // console.log(req.query);
    if(!req.query) {
        return res.status(400).send({
            message:"'itemId' param should be passed with a valid item id!"
        });
    }

    Item.findByIdAndRemove(req.query.itemId).then( item => {
        if(!item) {
            return res.status(404).send({
                message: "No item found for ID: " + req.query.itemId
            });
        }
        res.status(200).send({message:"Item deleted successfully"});
    }).catch(err => {
        if(err.kind == 'ObjectId' || err.name == 'NotFound') {
            return res.status(404).send({
                message: "Item not found for ID: " + req.query.itemId
            });
        }
        return res.status(500).send({
            message: "Error while deleting item with ID: " + req.query.itemId
        });
    });
};

exports.searchItems = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    if(!req.query || !req.query.searchQuery) {
        return res.status(400).send({
            message:"'searchQuery' param should be passed with valid query!"
        });
    }
    Item.find().then(itemsList => {
        if(!itemsList) {
            return res.status(404).send({
                message: "No Items found for search query: " + req.query.searchQuery
            });
        }
        var items = [];
        const queryVal = req.query.searchQuery.toLowerCase();
        itemsList.forEach(function(item){
            if(item) {
                if(JSON.stringify(item).toLowerCase().indexOf(queryVal)>-1){
                    items.push(item);
                }
            }
        });
        res.status(200).send({items});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while fetching all items!"
        });
    });
};
