const router = require('../controllers/photo.controller.v1.js');

module.exports = (app) => {
    app.get('/api/v1/', router.getAPIs);

    // app.post('/api/v1/uploadFile', router.uploadFile);

    app.post('/api/v1/uploadPhoto', router.uploadPhoto);

    app.get('/api/v1/downloadPhoto', router.downloadPhoto);

    app.delete('/api/v1/deletePhoto', router.deletePhoto);

    app.get('/api/v1/searchPhotos', router.searchPhotos);

    app.use(function(req, res) {
        res.status(404);
    	res.send({
            message:"Sorry, No such storage end point/API!",
            description:"Fallback to 'http:localhost:3333/api/v1/' to get list of available APIs.."
    	});
    });
}
