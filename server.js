'use strict';

/**
 * Dashboard for Twitter Sentiment analysis using Spark Streaming and Watson Tone Analyzer
 * 
 * @author David Taieb
 */

var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var bluemixHelperConfig = require('bluemix-helper-config');
var global = bluemixHelperConfig.global;
var configManager = bluemixHelperConfig.configManager;

var app = global.app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler({ dumpExceptions:true, showStack:true }));

var env = app.get('env');
if ('production' === env) {
	app.use(morgan('dev'));
}

if ('development' === env || 'test' === env) {
	app.use(morgan('dev'));
	app.use(errorHandler()); // Error handler - has to be last
}

app.use('/res', express.static(path.join(__dirname, 'app')));

var port = process.env.VCAP_APP_PORT || configManager.get("DEV_PORT");

var connected = function() {
	console.log("Spark Twitter Watson Dashboard started on port %s : %s", port, Date(Date.now()));
};

var server = app.server = require('http').createServer(app);
if (process.env.VCAP_APP_HOST){
	server.listen(port,
                 process.env.VCAP_APP_HOST,
                 connected);
}else{
	server.listen(port,connected);
}

//Start the mozaik dashboard
require('./server/dashboard/dashboard')(app);

//Start the MessageHub/kafka bridge
require('./server/messageHubBridge');

require("cf-deployment-tracker-client").track();
