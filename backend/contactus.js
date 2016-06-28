var Db = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');

var connectdb = function (req, res, next) {
    Db.connect("mongodb://localhost:27017", function (err, db) {
        req.db = db;
        next();
    });
};

var contactusinsert = function (req, res, next) {
    var d = new Date();
    var data = {
        name: req.body.data.name,
        email: req.body.data.email,
        message: req.body.data.message,
        image :req.body.data.image ,
        time: d.getTime()
    };
    req.db.collection('contactus').insert(data, function (err, data) {
        if (err) throw err;
        res.send('200')
    });
};

var contactusfind = function (req, res, next) {
    req.db.collection('contactus').find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};
var remove = function (req, res, next) {
    var id = req.params.id;


    req.db.collection('contactus').remove({_id: ObjectID(id)}, function (err, data) {
        if (err) throw err;
        res.send('200');
    })
};

var update = function(req ,res ,next){
    var data = {
        id:req.body.data._id,
        name: req.body.data.name,
        email: req.body.data.email,
        message: req.body.data.message,
        time: req.body.data.time
    };
    req.db.collection('contactus').update({'_id': ObjectID(data.id)}, {$set: {'name': data.name, 'email': data.email, 'message': data.message , time:data.time}}, {upsert: true}, function (err, data) {
        res.send('200');
    });
};


module.exports = function (app) {
    app.post('/products/contactusinsert', connectdb, contactusinsert);
    app.put('/products/contactusupdate', connectdb, update);
    app.get('/products/contactusfind', connectdb, contactusfind);
    app.delete('/products/remove/:id', connectdb, remove);
};



