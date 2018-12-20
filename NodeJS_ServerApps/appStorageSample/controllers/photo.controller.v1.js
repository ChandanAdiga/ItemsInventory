const model = require('../models/file.model.js');
const multer = require('multer');
const fs = require('fs');

const RawFile = model.rawFile;
// const Thumbnail = model.thumbnail;
const MetaFile = model.metaFile;

exports.getAPIs = (req, res) => {
    res.status(200).end(
        "<html>"
            +"<head>"
                +"<title>Sample Storage API</title>"
            +"</head>"
            +"<body>"
                +"<h4>Hello there!</h4>"
                +"<br><br><pre>You can use below end points: \n\t1) POST: /addPhoto \n\tOR \n\t2) DELETE: /deletePhoto \n\tOR \n\t3) GET: /getPhoto \n\tOR \n\t4) GET: /searchPhotos</pre>"
            +"</body>"
        +"</html>"
    );
};

//https://medium.com/@parthkamaria/storing-and-retrieving-files-from-mongodb-using-mean-stack-and-gridfs-aebd8b91cf38
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'storage/photos/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '_' + Date.now())
//   }
// });
// var upload = multer({ storage: storage });
//
// exports.uploadSingle = upload.single('photo');
// exports.uploadMultiple = upload.array('photos', 10);

// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//     res.send(file)
//
// })

exports.uploadFile = (req, res) => {
    console.log("uploadFile > name: " + req.body.name);
    console.log("uploadFile > contentType: " + req.body.contentType);
    console.log("uploadFile > data: " + req.body.data);
    if(!req.body) {
        return res.status(400).send({
            message:"File details can not be empty!"
        });
    }
    return res.status(200).send({"message": "Successfully added photo: " + req.body.name});
};

exports.addPhoto = (req, res) => {
    console.log("addPhoto > name: " + req.body.name);
    console.log("addPhoto > itemId: " + req.body.itemId);
    console.log("addPhoto > description: " + req.body.description);
    console.log("addPhoto > category: " + req.body.category);
    console.log("addPhoto > tags: " + req.body.tags);
    console.log("addPhoto > rawFile: " + req.body.rawFile);
    console.log("addPhoto > thumbnail: " + req.body.thumbnail);
    if(!req.body) {
        return res.status(400).send({
            message:"Photo details can not be empty!"
        });
    }
    return res.status(200).send({"message": "Successfully added photo: " + req.body.name});
    // val photo = fs.readFileSync(req.file.path);

    // //Auto generated id will be available: MetaFileObj._id
    // const photo = new RawFile({
    //     name: req.body.name || "NoName_" + Date.now(),
    //     contentType: "image/png",
    //     data: req.body.data
    // });
    //
    // photo.save().then(data => {
    //     const photoMetaData = new MetaFile({
    //         name: req.body.name || "NoName_" + Date.now(),
    //         photoId: req.body.photoId || "NophotoId_" + Date.now(),
    //         description: req.body.description || "General photo",
    //         category: req.body.category || "General",
    //         tags: req.body.tags || "General photo"
    //         rawFile : photo._id
    //     });
    //     photoMetaData.save().then(data => {
    //         res.status(200)
    //             .send(data);
    //             // .send({
    //             //     message: "success"
    //             // });
    //     }).catch(error => {
    //         res.status(500).send({
    //             message: error.message || "Some error occured while adding the photo!"
    //         });
    //     });
    // }).catch(error => {
    //     res.status(500).send({
    //         message: error.message || "Some error occured while adding the photo!"
    //     });
    // });
};

exports.getPhoto = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    // console.log(req.query);
    if(!req.query) {
        return res.status(400).send({
            message:"'photoId' param should be passed with a valid photo id!"
        });
    }

    MetaFile.findById(req.query.photoId).then( metaFile => {
        if(!metaFile) {
            return res.status(404).send({
                message: "No photo found for ID: " + req.query.photoId
            });
        }
        res.status(200).send(metaFile);
    }).catch(err => {
        if(err.kind == 'ObjectId') {
            return res.status(404).send({
                message: "Photo not found for ID: " + req.query.photoId
            });
        }
        return res.status(500).send({
            message: "Error while retrieving photo with ID: " + req.query.photoId
        });
    });
};

exports.downloadPhoto = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    // console.log(req.query);
    if(!req.query) {
        return res.status(400).send({
            message:"'photoId' param should be passed with a valid photo id!"
        });
    }

    MetaFile.findById(req.query.photoId).then( metaFile => {
        if(!metaFile) {
            return res.status(404).send({
                message: "No photo found for ID: " + req.query.photoId
            });
        }
        res.status(200).send(metaFile);
    }).catch(err => {
        if(err.kind == 'ObjectId') {
            return res.status(404).send({
                message: "Photo not found for ID: " + req.query.photoId
            });
        }
        return res.status(500).send({
            message: "Error while retrieving photo with ID: " + req.query.photoId
        });
    });
};

exports.deletePhoto = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    // console.log(req.query);
    if(!req.query) {
        return res.status(400).send({
            message:"'photoId' param should be passed with a valid photo id!"
        });
    }

    MetaFile.findByIdAndRemove(req.query.photoId).then( metaFile => {
        if(!metaFile) {
            return res.status(404).send({
                message: "No photo found for ID: " + req.query.photoId
            });
        }
        res.status(200).send({message:"Photo deleted successfully"});
    }).catch(err => {
        if(err.kind == 'ObjectId' || err.name == 'NotFound') {
            return res.status(404).send({
                message: "Photo not found for ID: " + req.query.photoId
            });
        }
        return res.status(500).send({
            message: "Error while deleting photo with ID: " + req.query.photoId
        });
    });
};

exports.searchPhotos = (req, res) => {
    // res.status(400).send({message: "API not ready yet!"});
    if(!req.query || !req.query.searchQuery) {
        return res.status(400).send({
            message:"'searchQuery' param should be passed with valid query!"
        });
    }
    MetaFile.find().then(metaFiles => {
        if(!metaFiles) {
            return res.status(404).send({
                message: "No photos found for search query: " + req.query.searchQuery
            });
        }
        var photoMetaFiles = [];
        const queryVal = req.query.searchQuery.toLowerCase();
        metaFiles.forEach(function(metaFile){
            if(metaFile) {
                if(JSON.stringify(metaFile).toLowerCase().indexOf(queryVal)>-1){
                    photoMetaFiles.push(metaFile);
                }
            }
        });
        res.status(200).send({metaFiles});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while fetching all photos!"
        });
    });
};
