var express = require('express');
//var FSStore = require('ms-session')(express);
var path = require('path');
var utils = require('ms-utils');
var assetManager = require('connect-assetmanager');
var passport = require('passport');
var mystore = require('ms-middleware');
var storeHelper = require('ms-store');
require('ms-config').loadConfigs();

var nconf = require('nconf');
//require('ms-config').loadConfigs();
var env = process.env.NODE_ENV || "prd";
nconf.use('file', { file: path.join(__dirname, './config/' + env + '.json') });

var app = module.exports = express();
app.use(mystore.addLogger());

storeHelper.getDomains();
app.use(function (req, res, next) {
    if (req.headers.host.indexOf("www.") == -1) {
        if ('/robots.txt' == req.url) {
            var sitemapUrl = 'http://www.' + req.headers.host + '/sitemap.xml';
            res.type('text/plain')
            res.send("User-agent: *\nDisallow: /admin\nDisallow: /cart\nSitemap: " + sitemapUrl);
        } else {
            next();
        }
    } else {
        next();
    }

});
app.use(mystore.checkStoreName());
//var domain = require('domain');

app.use(express.limit('8mb'));
//app.use(express.multipart());
app.use(express.bodyParser());

/*setting headers for the store dont remove below code*/
/*app.use(function(req,res,next){
 storeHelper.checkServerGroup(req.headers.host, function(serverGroup){
 res.setHeader('server-group', serverGroup);
 next();
 });
 });*/
/*app.use(function(req,res,next){
 storeHelper.getDatabaseName(req.headers.host, function(databaseName){
 res.header('database-name', databaseName);
 next();
 });
 });*/
app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    // Following headers are needed for CORS
    res.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, ajax');
    res.setHeader('access-control-allow-methods', 'POST,HEAD,GET,PUT,DELETE,OPTIONS');
    res.setHeader('access-control-allow-origin', '*');
    res.removeHeader("X-Powered-By");
    storeHelper.checkServerGroup(req.headers.host, function (serverGroup) {
        res.setHeader('server-group', serverGroup);
        next();
    });
});

// settings
// map .renderFile to ".html" files
app.engine('html', require('ejs').renderFile);

// make ".html" the default
app.set('view engine', 'html');

// set views for error and 404 pages
app.set('views', __dirname + '/views');

// log

app.use(express.logger('dev'));


// serve static files
app.use(express.static(__dirname + '/frontend'));

var assetManagerGroups = {
    'js': {
        'route': /\/js\/mystore.js/, 'path': __dirname + '/frontend/js/', 'dataType': 'javascript', 'files': [
            , 'ms.js'
            , 'ms-module.js'
            , 'ms-controllers.js'
            , 'ms-widgetDirectives.js'
            , 'store.js'
            , 'datatable.js'
            , 'mform.js'
            , 'validation.js'
            , 'cart.js'
            , 'user.js'
            , 'mystore-functions.js'
        ]
    }
}
app.use(assetManager(assetManagerGroups));

process.on('uncaughtException', function (err) {
});
//app.use(express.json());
//app.use(express.urlencoded());


// support _method (PUT in forms etc)
app.use(express.methodOverride());
// session support
app.use(express.cookieParser());
/*app.use(express.session({
 secret: 'aersda@#$32sfas2342',
 cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }, //2 days
 store: new FSStore({dir: '/tmp/sessions'})
 }));*/
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.session({secret: 'aersda@#$32sfas2342'}));


app.use(mystore.serverCrawlers());
app.use(mystore.addStoreName());
app.use(mystore.addStoreInfo());
app.use("/checkadmin", mystore.checkAdmin());
app.use(mystore.connectServerGroup());
app.use(mystore.connectDatabase());

app.use("/admin", function (req, res, next) {
    if (req.store.demo_store == "1") {
        var demoAdmin = {
            email: "demo@mystore.in"
        }
        req.session.adminUser = demoAdmin;
    }
    if (req.session.adminUser) {
        res.sendfile(__dirname + '/frontend/admin.html');
    } else {
        res.sendfile(__dirname + '/frontend/login.html');
    }
});

app.use("/store/info.js", function (req, res, next) {
    var fs = require('fs');
    var storeInfo = path.normalize(__dirname + '/frontend/store/' + req.store._id + "/info.js");
    console.log(storeInfo);
    var isStoreInfoExist = fs.existsSync(storeInfo);
    console.log(isStoreInfoExist);
    if (isStoreInfoExist) {
        res.sendfile(storeInfo);
    } else {
        next();
    }
});

//require('./backend/services/mystoreTools')(app);
require('./backend/services/storeinfo')(app);
require('./backend/services/permissions')(app);
require('./backend/services/userinfo')(app);
require('./backend/services/backupStore')(app);
//require('./backend/services/google-analytics');
//app.use('/deploy',deploy)
app.use(mystore.sendDefaultLayout());


// Function common for all services
/*;*/

app.options('*', function (req, res, next) {
    res.send();
});

// handle the entities
// handle the entities
//require('./backend/lib/entity')(app);
require('./backend/services/auth')(app);

// handle the services
require('./backend/services/mobile')(app);
require('./backend/services/mobilenotification')(app);
require('./backend/services/handleVariantsImages')(app);

require('./backend/services/importcategory')(app);
require('./backend/services/importproduct')(app);
require('./backend/services/cart')(app);
require('./backend/services/checkout')(app);
require('./backend/services/categories')(app);
require('./backend/services/domain')(app);
require('./backend/services/dashboard')(app);
require('./backend/services/notification')(app);
mystore.entityPreMiddleware(app);
require('./backend/services/location')(app);
require('./backend/services/entity')(app);
mystore.entityPostMiddleware(app);
require('./backend/services/user')(app);
require('./backend/services/sitemap')(app);

app.use(function (req, res, next) {
    if (res._output) {
        res.send(res._output);
    }
    else {
        next();
    }
});
//app.get('/tools', express.basicAuth('shobhi', 'sho'));

//app.listen();
//require('./backend/services/mail')(app);
//require('./scripts/backup');

// assume "not found" in the error msgs
// is a 404. this is somewhat silly, but
// valid, you can do whatever you like, set
// properties, use instanceof etc.
app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message && ~err.message.indexOf('not found')) return next();

    if (req.xhr) {
        if (env == "dev") {
            res.send(500, {error: err.stack});
        }
        else {
            res.send(500, {error: "Something went wrong. We have been notified. Please try again after some time or contact us at support@storehippo.com"});
        }
    }
    else {
        res.status(500);
        if (env == "dev") {
            res.render('error', { error: err });
        }
        else {
            res.render("error", {error: "Something went wrong. We have been notified. Please try again after some time or contact us at support@storehippo.com"});
        }
    }
});
// assume 404 since no middleware responded
app.use(function (req, res, next) {
    //console.log(req.path);
    res.status(404).render('404', { url: req.originalUrl });
});

var server = express();
//nconf.get("*").forEach(function (vhost) {
server.use(express.vhost('*', app));
//});

if (env == 'prd') {
    var httpProxy = require('http-proxy')
    var proxyServer = httpProxy.createServer(function (req, res, proxy) {

        if (req.headers.host.indexOf("www.") > -1) {
            req.headers.host = req.headers.host.toString().substring(4);
        }

        storeHelper.checkServerGroup(req.headers.host, function (serverGroup) {
            if (!serverGroup) {
                res.writeHead(404);
                res.write("STORE NOT FOUND. PLEASE CHECK THE SPELLING.");
                res.end();
                return;
            }
            if (serverGroup == "demo") {
                proxy.proxyRequest(req, res, {
                    host: 'dev.mystore.in',
                    port: nconf.get('port')
                });
            }
            else {
                proxy.proxyRequest(req, res, {
                    host: 'localhost',
                    port: 4000
                });
            }
        });
    });
    proxyServer.listen(nconf.get('port'));
    server.listen(4000);
}
else {

    console.log("inside else")
    var toolsApp = express();
    var toolsServer = express();
    // var toolsApp = module.exports = express();
    app.use(function (req, res, next) {
        // Following headers are needed for CORS
        req.setHeader('access-control-allow-headers', 'Content-Type: application/json');
        // req.removeHeader("X-Powered-By");

    });
    toolsApp.use(express.bodyParser());

    toolsServer.use(express.vhost('tools.dev.mystore.manu', toolsApp));
    /*var ManagerGroups = {
     'js': {
     'route': /\/js\/sho.js/, 'path': __dirname + '/frontend/js/mcms/', 'dataType': 'javascript', 'files': [
     , 'mystoreToolsController.js'
     ]
     }
     }
     toolsApp.use(assetManager(ManagerGroups));*/
    toolsApp.use(toolsApp.router);
    toolsApp.all("/*", express.basicAuth('shobhit', 'shobhit'));
    // toolsApp.post("/deploy",express.basicAuth('shobhit','ok'));
    //toolsApp.get("/test",express.basicAuth('shobhit','test'));

    toolsApp.use("/tools", function (req, res, next) {
        res.sendfile(__dirname + '/frontend/mystoreTools.html');
    });

    require('./backend/services/mystoreTools')(toolsApp);
    toolsServer.listen(5000);
    server.listen(nconf.get('port'));
}

console.log('\n  listening on port ' + nconf.get('port') + '\n');





















