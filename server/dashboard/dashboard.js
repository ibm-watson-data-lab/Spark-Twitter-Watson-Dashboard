'use strict';

/**
 * Dashboard for Twitter Sentiment analysis using Spark Streaming and Watson Tone Analyzer
 * 
 * @author David Taieb
 */

var _ = require('lodash');

require('babel/register')({
    only: /node_modules\/mozaik[^/]*\/src/
});

function dashboard(app){
	var mozaik = new (require('mozaik'))(require('../../config'));

	mozaik.bus.registerApi('sparkTwitter', require('./sparkTwitterApiClient'));
	
	//Start Mozaik server
	mozaik.startServer(app);
}
module.exports = dashboard;
