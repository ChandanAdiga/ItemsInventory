
module.exports = (app) => {

    const items = require('../controllers/item.controller.js');

    app.get('/', items.getAPIs);

    app.post('/addItem', items.addItem);

    app.get('/getItem', items.getItem);

    app.post('/updateItem', items.updateItem);

    app.get('/getAllItems', items.getAllItems);

    app.delete('/deleteItem', items.deleteItem);

    app.get('/searchItems', items.searchItems);

    app.use(function(req, res) {
        res.status(404);
    	res.send({
            message:"Sorry, No such end point/API!",
            description:"Fallback to 'http:localhost:3332' to get list of available APIs.."
    	});
    });
}
