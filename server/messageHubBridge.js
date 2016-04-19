/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Dashboard for Twitter Sentiment analysis using Spark Streaming and Watson Tone Analyzer
 * 
 * @author David Taieb
 */
var MessageHub = require('message-hub-rest');
var bluemixHelperConfig = require('bluemix-helper-config');
var configManager = bluemixHelperConfig.configManager;
var _ = require("lodash");
var async=require("async");

//Store the messages by topics
var messagesByTopics={};

var consumerInstanceName = "spark_twitter_consumer_instance";
var topics = ["topHashTags", "topHashTags.toneScores", "total_tweets"];

function messageHubBridge(){
	var services = configManager.get("DEV_VCAP_CONFIG");
	if ( !services ){
		services = JSON.parse(process.env.VCAP_SERVICES);
	}
	var instance = new MessageHub(services);
	instance.topics.get()
		.then( function(response){
			console.log("List of topics: ", response);
			//Change in MessageHub on 11/2/2015: topics are not autocreated anymore			
			var createTopicIfNecessary = function( topic ){
				if ( !_.find( response, function( t ){ return t === topic || (t.hasOwnProperty("name") && t.name === topic) })){
					instance.topics.create(topic)
					.then(function(res){
						console.log("Successfully created topic " + topic);
					})
					.fail( function(error){
						console.log("Unable to create topic "+topic, error);
					})
				}
			}
			_.forEach( topics, function(topic){
				createTopicIfNecessary(topic);
			})
			if ( process.env.DELETE_ALL_TOPICS_ON_START ){
				_.forEach( response, function(r){
					r = r.name || r
					if ( true || !_.find( topics, function( topic ){ return topic === r })){
						console.log("Deleting topic ", r);
						instance.topics.delete(r)
						.then(function(res){
							console.log("Successfully delete topic ", r );
						})
						.fail( function( error ){
							console.log("Unable to delete topic " + r, error);
						})
					}
				})
			}
			
			if ( process.env.DELETE_TOPIC_ON_START ){
				var r = process.env.DELETE_TOPIC_ON_START;
				console.log("Deleting topic ", r);
				instance.topics.delete(r)
				.then(function(res){
					console.log("Successfully delete topic ", r );
				})
				.fail( function( error ){
					console.log("Unable to delete topic " + r, error);
				})
			}
		})
		.fail( function(error){
			console.log("Failed to get list of topics: ", error);
		});
	
	//Synchronized FIFO queue used to consume/produce topics to MessageHub instance
	var callQueue = async.queue(function(taskRunner, callback){
		taskRunner.run(callback);
	},1);	//Limited to 1 concurrent worker to make it synchronous
	
	//Helper that consumer a topic from MessageHub
	var consumeTopic = function( topic ){
		console.log("Create MessageHub consumer for topic: " + topic );
		instance.consume('consumer_' + topic, consumerInstanceName, { 'auto.offset.reset': 'largest' })
			.then( function( response ){
				var consumerInstance = response[0];
				var task = {
					run: function(callback){
						var that = this;
						consumerInstance.get(topic)
							.then(function(data){
								that.consume(data);
								return callback();
							})
							.fail(function(error){
								console.log("got error: ", error);
								return callback(error);
							})
					},
					schedule: function(){
						setTimeout(function(){
							callQueue.push(this,this.done);
						}.bind(this),4000);
					},
					consume: function(data){
						if ( _.isArray(data) ){
							if ( data.length > 0 ){
								//Take only the last value
								try{
									messagesByTopics[topic] = JSON.parse( data[data.length - 1] );
								}catch(e){
									console.log("Unable to parse Message Hub data", e, data[data.length-1]);
								}
							}
						}else{
							messagesByTopics[topic] = data;
						}
					},
					done: function(err){
						if( err ){
							console.log("Unable to consume topic: " + topic, err );
						}
						this.data.schedule();
					}
				};
				
				//Kick start the queue
				task.schedule();
			})
			.fail( function(error){
				console.log("Unable to get consumer instance for topic: " + topic, error);
			})
	};
	
	_.forEach( topics, function( topic ){
		if ( process.env.DELETE_CONSUMER_INSTANCE ){
			instance.consume('consumer_' + topic, consumerInstanceName, { 'auto.offset.reset': 'largest' })
				.then( function( response ){
					var consumerInstance = response[0];
					//Delete consumer instance
					console.log("Delete consumer instance: " + 'consumer_' + topic);
					consumerInstance.remove();
				})
				.fail( function(error){
					console.log("Unable to get consumer instance for topic: " + topic, error);
				})
		}else{
			consumeTopic( topic );
		}
	});
	
	this.getTopicMessage = function(topic){
		return messagesByTopics.hasOwnProperty(topic) ? messagesByTopics[topic] : [];
	}
}

module.exports = new messageHubBridge();