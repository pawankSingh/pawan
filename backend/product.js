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

var addproduct = function (req, res, next) {
    var d = new Date();
    var data = /*{
     name: req.body.data.productname,
     brand: req.body.data.productbrand,
     price: req.body.data.productprice,
     image :req.body.data.productimage ,
     time: d.getTime()
     };*/  req.body.data;
    req.db.collection('products').insert(data, function (err, data) {
        if (err) throw err;
        res.send('200')
    });
};


var getproduct = function (req, res, next) {
    req.db.collection('products').find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};

var updateproduct = function (req, res, next) {
    var data = {
        id: req.body.data._id,
        name: req.body.data.name,
        alias: req.body.data.alias,
        brand: req.body.data.brand,
        price: req.body.data.price,
        image: req.body.data.image
    };
    req.db.collection('products').update({'_id': ObjectID(data.id)}, {$set: data}, {upsert: true}, function (err, data) {
        res.send('200');
    });
};

var removeproduct = function (req, res, next) {
    var id = req.params.id;
    req.db.collection('products').remove({_id: ObjectID(id)}, function (err, data) {
        if (err) throw err;
        res.send('200');
        console.log('data',data)
    })
};

module.exports = function (app) {
    app.post('/products/insert', connectdb, addproduct);
    app.put('/product/update', connectdb, updateproduct);
    app.get('/product/getproduct', connectdb, getproduct);
    app.delete('/product/remove/:id', connectdb, removeproduct);
};



