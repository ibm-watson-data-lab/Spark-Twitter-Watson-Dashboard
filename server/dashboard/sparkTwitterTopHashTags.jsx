import React, { Component, PropTypes } from 'react';
import reactMixin                      from 'react-mixin';
import Mozaik                          from 'mozaik/browser';
import { ListenerMixin }               from 'reflux';
import c3                              from 'c3';
import _                               from 'lodash';

class SparkTwitterTopHashTags extends Component{
	constructor(props) {
        super(props);
        
        this.state = {
    		"colData": []
    	};
    }

    getApiRequest() {
    	//console.log("Calling getApiRquest for topHashTag widget");
        return {
            id: 'sparkTwitter.getTopHashTags',
            params: {
            	topic: "topHashTags"
            }
        };
    }

    onApiData(metrics) {
    	if ( metrics.length > 0 ){
    		this.setState({"colData":metrics});
    	}
    }

    componentDidUpdate() {
      this.chart.load(this.getChartData());
      this.onResize();
    }
    
    getChartData(){
    	var retData = {"columns": this.state.colData, "unload":[]};
    	
    	//Unload any columns that is not part of the colData
    	var data = retData.columns;
    	_.forEach( this.chart.data(), function(t){
    		if ( !_.find(data, function(u){
    			if( u[0]!==t.id || !t.values || u.length != t.values.length+1){
    				return false;
    			}else{
    				//Check each values for identity
    				for( var i=1;i<u.length;i++){
    					if(t.values[i-1].value==undefined || u[i]!=t.values[i-1].value){
    						return false;
    					}
    				}    				
    			}
    			return true;
    		})){
    			retData.unload.push(t.id);
    		}
    	});
    	
    	return retData;
    }
    
    onResize() {
    	if (this.chart) {
    		var parent = document.querySelector(".sparkTwitter-topHashTags-chart").parentNode;
    		this.chart.resize({ height: parent.offsetHeight - 50 });
    	}
    }

    componentDidMount() {
      var chartElement = React.findDOMNode(this.refs.chartWrapper);
      this.chart = c3.generate({
    	  bindto: chartElement,
    	  data: {
    		  columns: this.state.colData,
    		  type : 'pie',
    		  onclick: function (d, i) { console.log("onclick", d, i); },
    		  onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    		  onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    	  },
//    	  pie: {
//			label: {
//			    format: function (value, ratio, id) {
//			        return id + " ("+ (ratio * 100).toFixed(2)+"%)";
//			    },
//			    show:true
//			}
//		  },
		  legend: {
			  position: 'right'
		  }
      });

      window.addEventListener('resize', this.onResize.bind(this));
      this.onResize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize.bind(this));
      if (this.chart) {
        this.chart.destroy();
      }
    }

    render() {
    	return (
    		<div style={{height:'100%'}}>
	    		<div className="chart-title-text">Trending Hashtags on Twitter</div>
	            <div ref="chartWrapper" className="sparkTwitter-topHashTags-chart"></div>
	        </div>
        );
  	}
}

reactMixin(SparkTwitterTopHashTags.prototype, ListenerMixin);
reactMixin(SparkTwitterTopHashTags.prototype, Mozaik.Mixin.ApiConsumer);
export { SparkTwitterTopHashTags as default };
