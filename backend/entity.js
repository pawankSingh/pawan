/**
 * Created by pawankumarsingh on 4/3/15.
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

var addEntity = function (req, res, next) {
    var data = req.body.data;
    req.db.collection('entity').insert(data, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });

};

var addEntityRecord = function (req, res, next) {
    var data = req.body.data;
    req.db.collection(req.body.entityName).insert(data, function (err, resp) {
        if (err) throw err;
        res.send(resp);
    });

};


var getEntity = function (req, res, next) {
    req.db.collection('entity').find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};
var getEntityRecords = function (req, res, next) {
    req.db.collection(req.params.entityname).find().toArray(function (err, data) {
        if (err) throw err;
        res.send(data);
    });
};

var removeEntity = function (req, res, next) {
    var id = req.params.id;
    req.db.collection('entity').remove({_id: ObjectID(id)}, function (err, data) {
        if (err) throw err;
        res.send('200');
    })
};

var getEntityFields = function (req, res, next) {
    var entity = req.params.entity;
    req.db.collection('entity').find({name: entity}).toArray(function (err, data) {
        if (err) throw err;
        res.send(data);

    });
};
var deleteEntityRecords = function (req, res, next) {
    var id = req.params.id;
    var entity = req.params.entity;
    req.db.collection(entity).remove({_id: ObjectID(id)}, function (err, data) {
        if (err) throw err;
        res.send('200');
    })
};

module.exports = function (app) {
    app.post('/entity/_add', connectdb, addEntity);
    app.post('/entity/entityRecord', connectdb, addEntityRecord);
    app.get('/entity/get', connectdb, getEntity);
    app.get('/entity/getRecords/:entityname', connectdb, getEntityRecords);
    app.get('/entity/fields/:entity', connectdb, getEntityFields);
    app.delete('/entity/deleteRecords/:entity/:id', connectdb, deleteEntityRecords);
    app.delete('/del/entity/:id', connectdb, removeEntity);
};



