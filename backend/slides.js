/**
 * Created by pawankumarsingh on 23/1/15.
 */


/**
 * Created by pawankumarsingh on 20/1/15.
 */

var Db = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');


var connectdb = function (req, res, next) {
    Db.connect("mongodb://localhost:27017", function (err, db) {
        req.db = db;
        next();
    });
};

var addslides = function (req, res, next) {
    var d = new Date();
    var data = {
        caption: req.body.data.caption,
        image :req.body.data.image ,
        description: req.body.data.description

    };
    req.db.collection('slides').insert(data, function (err, data) {
        if (err) throw err;
        res.send('200')
    });
};



var getslides = function (req, res, next) {
    req.db.collection('slides').find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};



var remove = function (req, res, next) {
    var id = req.params.id;

    req.db.collection('slides').remove({_id: ObjectID(id)}, function (err, data) {

        if (err) throw err;
        res.send('200');
    })
};

module.exports = function (app) {
    app.post('/slides/insert', connectdb, addslides);
    app.get('/slides/getslides', connectdb, getslides);
    app.delete('/slides/remove/:id', connectdb, remove);
};