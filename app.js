const express = require('express'); 
const app = express();
var bodyParser  = require('body-parser');
const db = require('./dbConnection');

require('dotenv').config(); //importing node config
const port = process.env.PORT || 26666;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers to allow access region
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin,instituteusername,instancename,schoolusername,entitytype,appliedby,classid,subjectid,classenrolled,classcode,examtype,subjectcode,createdon,X-Requested-With,Content-Type,Accept,Authorization,x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const router     = require('./app/routes/api-routes')(); // ROUTES FOR OUR API
// REGISTER OUR ROUTES 
app.use('/api', router);


app.listen(port, function(){
	console.log("INST-Users Server Runnin on port - "+ port);
});