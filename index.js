var express = require('express');
var app = module.exports = express();
app.use(express.bodyParser());
var Db = require('mongodb').Db;
var router = express.Router();
app.use(express.static(__dirname + '/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//require(__dirname + '/backend/contactus')(app);
//require(__dirname + '/backend/users')(app);
//require(__dirname + '/backend/product')(app);
//require(__dirname + '/backend/slides')(app);
//require(__dirname + '/backend/category')(app);
//require(__dirname + '/backend/entity')(app);

app.use('/admin', function (req, res , next) {
    res.sendfile(__dirname + '/admin.html');
});
app.use('/', function (req, res , next) {
    res.sendfile(__dirname + '/index.html');
});

app.listen(3000);