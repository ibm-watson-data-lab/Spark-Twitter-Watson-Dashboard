import React, { Component, PropTypes } from 'react';
import reactMixin                      from 'react-mixin';
import Mozaik                          from 'mozaik/browser';
import { ListenerMixin }               from 'reflux';
import _                               from 'lodash';

class SparkTwitterStats extends Component{
	constructor(props) {
        super(props);
        
        this.state = {
    		"total_tweets": 0
    	};
    }

    getApiRequest() {
    	//console.log("Calling getApiRquest for tone widget");
        return {
            id: 'sparkTwitter.stats',
            params: {
            	topic: "total_tweets"
            }
        };
    }

    onApiData(metrics) {
    	metrics.forEach(function(m){
    		if(m.length>=2 && m[0]==="total_tweets"){
    			var state={};
    			state[m[0]]=m[1];
    			this.setState(state);
    		}
    	}.bind(this));
    }

    componentDidUpdate() {
    	var chartElement = React.findDOMNode(this.refs.total_tweets);
    	chartElement.innerHTML=this.state.total_tweets;
    }
    
    onResize() {
    }

    componentDidMount() {
      window.addEventListener('resize', this.onResize.bind(this));
      this.onResize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize.bind(this));
    }

    render() {
    	return (
    		<div className="stats">Totals Tweets Processed: <span ref="total_tweets">0</span> </div>
        );
  	}
}

reactMixin(SparkTwitterStats.prototype, ListenerMixin);
reactMixin(SparkTwitterStats.prototype, Mozaik.Mixin.ApiConsumer);
export { SparkTwitterStats as default };