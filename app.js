const express = require('express'); 
const app = express();
var bodyParser  = require('body-parser');
var path=require('path');
const db = require('./dbConnection');

require('dotenv').config(); //importing node config
const port = process.env.PORT || 26666;

//To specify application root folder
global.__basedir = __dirname;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies

// Add headers to allow access region
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin,instituteusername,instancename,schoolusername,staffusername,username,userrole,entitytype,appliedby,classid,subjectid,classenrolled,classcode,examtype,subjectcode,createdon,messageto,timelinemode,role,listmode,stuid,email,X-Requested-With,Content-Type,Accept,Authorization,x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const router     = require('./app/routes/api-routes')(); // ROUTES FOR OUR API

//TO Specify uploads folder
let options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html','jpg'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
  
app.use(express.static('assets', options))

// REGISTER OUR ROUTES 
app.use('/api', router);


app.listen(port, function(){
	console.log("INST-Users Server Runnin on port - "+ port);
});