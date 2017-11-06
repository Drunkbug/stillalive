var express = require('express');
var app = express();

var bodyParser = require('body-parser');//to help parse the body

var cookieParser = require('cookie-parser');
var session      = require('express-session');

var passport = require('passport');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
var secret = "mysecret";



if(process.env.SESSION_SECRET) {
    secret = process.env.SESSION_SECRET
}


app.use(session({ secret: secret }));


app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));


var stillalive = require('./stillalive/app.js');
stillalive(app);




var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.PORT || 5000;

app.listen(port, ipaddress);
