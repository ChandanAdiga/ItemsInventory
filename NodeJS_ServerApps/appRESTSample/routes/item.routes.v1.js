
module.exports = (app) => {

    const router = require('../controllers/item.controller.v1.js');

    app.get('/api/v1/', router.getAPIs);

    app.post('/api/v1/addItem', router.addItem);

    app.get('/api/v1/getItem', router.getItem);

    app.post('/api/v1/updateItem', router.updateItem);

    app.get('/api/v1/getAllItems', router.getAllItems);

    app.delete('/api/v1/deleteItem', router.deleteItem);

    app.get('/api/v1/searchItems', router.searchItems);

    app.use(function(req, res) {
        res.status(404);
    	res.send({
            message:"Sorry, No such REST end point/API!",
            description:"Fallback to 'http:localhost:3332/api/v1/' to get list of available APIs.."
    	});
    });
}
