/**
 * Created by pawankumarsingh on 2/2/15.
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

var addcategory = function (req, res, next) {
    var d = new Date();
    var data =req.body.data ;
    req.db.collection('categories').insert(data, function (err, data) {
        if (err) throw err;
        res.send('200')
    });
};



var getcategory= function (req, res, next) {
    req.db.collection('categories').find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};



var remove = function (req, res, next) {
    console.log('req.params',req.params)
    var id = req.params.id;
    req.db.collection('categories').remove({_id: ObjectID(id)}, function (err, data) {

        if (err) throw err;
        res.send('200');
    })
};

module.exports = function (app) {
    app.post('/category/insert', connectdb, addcategory);
    app.get('/category/get', connectdb, getcategory);
    app.delete('/category/remove/:id', connectdb, remove);
};