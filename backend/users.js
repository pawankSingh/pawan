/**
 * Created by pawankumarsingh on 10/1/15.
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

var adduser = function (req, res, next) {
    var d = new Date();
    console.log('req.body.data', req.body.data);
    var data = {
        name: req.body.data.name,
        email: req.body.data.email,
        password: req.body.data.password,
        image :req.body.data.image ,
        time: d.getTime()
    };
    req.db.collection('users').insert(data, function (err, data) {
        if (err) throw err;
        res.send('200')
    });
};

var userfind = function (req, res, next) {
    req.db.collection('users').find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};




var loginuser = function (req, res, next) {
    req.db.collection('users').findOne({email: req.params.email}, function (err, data) {
        if (err) throw err;
        res.send(data);
    })
};

var remove = function (req, res, next) {
    console.log('req.body.data.id', req.params.id);
    var id = req.params.id;

    req.db.collection('users').remove({_id: ObjectID(id)}, function (err, data) {

        if (err) throw err;
        res.send('200');
    })
};

module.exports = function (app) {
    app.post('/user/addusers', connectdb, adduser);
//    app.put('/user/updateusers', connectdb, update);
    app.get('/user/getusers', connectdb, userfind);
    app.get('/user/login/:email', connectdb, loginuser);
    app.delete('/user/removeusers/:id', connectdb, remove);
};



