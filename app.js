
var express = require('express');
var app = express();
var cors = require('cors')

var port = process.env.PORT || 8042;
var path = require('path');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
const fileUpload    = require('express-fileupload');
image 	= require('./lib/image');//you can include all your lib
moment   = require('moment');
var compression = require('compression');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

/***************mysql configuratrion********************/

let configDB = require('./config/database.js');
constant    = require('./config/constants.js');
auth         = require('./config/auth.js');
mysql        = require('mysql');
request = require("request");

//configuration ===============================================================

const QueryBuilder = require('node-querybuilder');
query = new QueryBuilder(configDB, 'mysql', 'single');

NodeCache = require( "node-cache" );
 myCache = new NodeCache();

app.use(fileUpload());
app.use(compression()); //use compression 

// routes ======================================================================
require('./config/routes.js')(app); // load our routes and pass in our app


//launch ======================================================================
app.listen(port);
console.log(`The magic happens on port ` + port);


app.use(express.static(path.join(__dirname, 'public')));

//catch 404 and forward to error handler
app.use(function (req, res, next) {
	res.json({'status':'fail','message':"Sorry, page not found"});
    return;
});

app.use(function (req, res, next) {
	res.json({'status':'fail','message':"Sorry, page not found"});
    return;
});
exports = module.exports = app;