const path = require("path");
const model = require('../models/file.model.js');
const mongoose = require('mongoose');
const appDbConfig = require('../config/database.config');
const multer = require('multer');
let GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
let STORAGE_PATH_DISK = path.join(__dirname,'../../storage/inventoryPhotos');
Grid.mongo = mongoose.mongo;
const fs = require('fs');
var gfs

//[DB
console.log("\nSetting up storage database..");
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(appDbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("\nSuccessfully connected to the storage database. Now setting up gfs..");
    gfs = Grid(mongoose.connection.db);
}).catch(err => {
    console.log('\nCould not connect to the storage database. Exiting now...', err);
    process.exit();
});
//DB]

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
                +"<br><br><pre>You can use below end points: \n\t1) POST: /uploadPhoto \n\tOR \n\t2) DELETE: /deletePhoto \n\tOR \n\t3) GET: /downloadPhoto \n\tOR \n\t4) GET: /searchPhotos</pre>"
            +"</body>"
        +"</html>"
    );
};

//https://medium.com/@parthkamaria/storing-and-retrieving-files-from-mongodb-using-mean-stack-and-gridfs-aebd8b91cf38
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
//https://github.com/expressjs/multer
let storageDisk = multer.diskStorage({
  destination: function (req, file, callback) {
    //.log("\n\nstorageDisk(), destination: " + STORAGE_PATH_DISK);
    callback(null, STORAGE_PATH_DISK);
  },
  filename: function (req, file, callback) {
    let fileName = file.fieldname + '_' + Date.now() + ".";
    callback(null, fileName);
  }
});

//https://medium.com/@parthkamaria/storing-and-retrieving-files-from-mongodb-using-mean-stack-and-gridfs-aebd8b91cf38
// let storageGridFs = GridFsStorage({
//     gfs : gfs,
//     filename: (req, file, cb) => {
//         let date = Date.now();
//         cb(null, file.fieldname + '_' + Date.now() + ".")
//     },
//
//     // Meta-data
//     metadata: function(req, file, cb) {
//         cb(null, { originalname: file.originalname });
//     },
//     // Root collection name
//     root: 'inventoryPhotos'
// });

var upload = multer({
    storage: storageDisk
    // storage: storageGridFs
});

//[WORKING
exports.uploadFile = (req, res) => {
    console.log("\n\nuploadFile()");
    // upload.single('photo') (req,res,(err) => {
    //     if(err) {
    //         return res.status(400).send({"message": err});
    //     }
    //     return res.status(200).send({
    //         "message": "Successfully added photo: " + req.body.name,
    //         "success": true,
    //         "photoId": ""
    //     });
    // });
    return res.status(200).send({"message": "This API is deprecated! Purpose was testing alone. Try /api/v1/addPhoto"});
};
//WORKING]

//Client-Android[https://stackoverflow.com/questions/36552637/uploading-file-to-a-rest-api-server-using-android-http-client]
exports.uploadPhoto = (req, res) => {
    // console.log("\n\nuploadPhoto()");
    // console.log("\tHeaders:\n" + JSON.stringify(req.headers));
    // console.log("\tBody:\n" + JSON.stringify(req.body));
    if(!req.body) {
        return res.status(400).send({
            message:"Photo details can not be empty!"
        });
    }
    upload.single('photo') (req,res,(err) => {
        if(err) {
            return res.status(400).send({
                "success": false,
                "message": err
            });
        }
        if(!req.file) {
            return res.status(404).send({
                "success": false,
                "message": "Could not save OR retrieve saved file name!"
            });
        }
        const photo = new RawFile({
            name: req.file.filename,
            itemId: req.body.itemId || "NoItemId_" + Date.now(),
            contentType: "image/jpg",
            data: []//Later you can move req.file.filename from disk to buffer and set here..
        });
        photo.save().then( savedPhoto => {
            const photoMetaData = new MetaFile({
                name: req.body.name || "NoName_" + Date.now(),
                itemId: req.body.itemId || "NoItemId_" + Date.now(),
                description: req.body.description || "General photo",
                category: req.body.category || "General",
                tags: req.body.tags || "General photo",
                rawFile: savedPhoto._id
            });
            photoMetaData.save().then(savedMetaData => {
                res.status(200)
                    .send({
                        "success": true,
                        "rawPhotoId": savedMetaData.rawFile
                    });
            }).catch(error => {
                res.status(500).send({
                    "success": false,
                    "message": error.message || "Some error occured while uploading the photo!"
                });
            });
        }).catch(error => {
            res.status(500).send({
                message: error.message || "Some error occured while uploading the photo!"
            });
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
    // console.log("DEBUG: Fetching all raw files..");
    RawFile.find().then(rawFiles => {
        rawFiles.forEach(function(rawFile){
            // console.log(JSON.stringify(rawFile).toLowerCase());
            console.log("File avaliable for ID: " + rawFile._id);
        });
    });
    RawFile.findById("" + req.query.photoId).then( photoFile => {
        if(!photoFile) {
            return res.status(404).send({
                message: "No photo found for ID: " + req.query.photoId
            });
        }

        res.setHeader('content-type', 'image/png');

        let downloadFilePath = "" + path.join(STORAGE_PATH_DISK, "" + photoFile.name);
        // console.log("downloadFilePath: " + downloadFilePath);
        // res.download(downloadFilePath);
        res.status(200).send(fs.readFileSync(downloadFilePath));
    }).catch(err => {
        if(err.kind == 'ObjectId') {
            return res.status(404).send({
                message: "Photo not found for ID: " + req.query.photoId
            });
        }
        return res.status(500).send({
            message: "Error while retrieving photo. Error: " + err //This will dump file path, which is not secure!
            // message: "Error while retrieving photo!"
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
        var photoIds = [];
        const queryVal = req.query.searchQuery.toLowerCase();
        metaFiles.forEach(function(metaFile){
            if(metaFile) {
                //console.log(JSON.stringify(metaFile));
                if(JSON.stringify(metaFile).toLowerCase().indexOf(queryVal)>-1){
                    photoIds.push(metaFile.rawFile);
                }
            }
        });
        res.status(200).send({photoIds});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while fetching all photos!"
        });
    });
};
