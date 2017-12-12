# Spark-Twitter-Watson-Dashboard
This sample Spark Streaming application collects Twitter data and run analytics in real-time that compute the top hashtags as well as a distribution of the emotional tones (provided by Watson Tone Analyzer). Then results show on a live dashboard web app featuring dynamic graphics that update continuously.

## Architecture:
![Spark+Watson+Twitter Part 2 Architecture](http://developer.ibm.com/clouddataservices/wp-content/uploads/sites/47/2015/12/Spark-Watson-Twiiter-Part2-Architecture.png)

## Real-time dashboard:
![Running Realtime dashboard](http://developer.ibm.com/clouddataservices/wp-content/uploads/sites/47/2016/01/Running-Spark-Dashboard.png)

You can follow a detailed tutorial [here](http://developer.ibm.com/clouddataservices/2016/01/15/real-time-sentiment-analysis-of-twitter-hashtags-with-spark/)

## Deploy to IBM Cloud

The fastest way to deploy this application to IBM Cloud is to click the **Deploy to IBM Cloud** button below. If you prefer instead to deploy manually to IBM Cloud skip ahead to the next section.

[![Deploy to IBM Cloud](https://metrics-tracker.mybluemix.net/stats/9ab07ee76ae677da2235e250f1798412/button.svg)](https://bluemix.net/deploy?repository=https://github.com/ibm-watson-data-lab/Spark-Twitter-Watson-Dashboard)

**Don't have an IBM Cloud account?** If you haven't already, you'll be prompted to [sign up](http://www.ibm.com/cloud-computing/bluemix/) for an IBM Cloud account when you click the button.  Sign up, verify your email address, then return here and click the the **Deploy to IBM Cloud** button again. Your new credentials let you deploy to the platform and also to code online with IBM Cloud and Git. If you have questions about working in IBM Cloud, find answers in the [IBM Cloud Docs](https://www.ng.bluemix.net/docs/).

## Build and Deploy Locally

### Configure Cloud Foundry

If you haven't already:

1. [Install the Cloud Foundry command line interface.](https://www.ng.bluemix.net/docs/#starters/install_cli.html)
2. Follow the instructions at the above link to connect to IBM Cloud.
3. Follow the instructions at the above link to log in to IBM Cloud.

### Build

_Note: This section is optional and only applies if you make changes to the application_
<p>To build the application, you need to use the <a href="http://gulpjs.com/">gulp framework</a>. The build handles the following tasks:</p>

<ol>
<li>Collect and copy various artifacts to the build area, like fonts, styles, and imgs.</li>
<li>Compile all the js and jsx files into a bundle that can also execute on the browser (uses <a href="http://browserify.org/" target="_blank">browserify</a>).</li>
<li>Minify the code and deploy it into the build area.</li>
</ol>

<p>To start the build manually, call <code>gulp build</code></p>

### Deploy

To deploy to IBM Cloud, simply:

    $ cf push

**Note:** You may notice that IBM Cloud assigns a URL to your application containing a random word. This is defined in the `manifest.yml` file where the `random-route` key set to the value of `true`. This ensures that multiple people deploying this application to IBM Cloud do not run into naming collisions. To specify your own route, remove the `random-route` line from the `manifest.yml` file and add a `host` key with the unique value you would like to use for the host name.


### Privacy Notice

Refer to https://github.com/IBM/metrics-collector-client-node#privacy-notice

#### Disabling Deployment Tracking

Deployment tracking can be disabled by removing the following line from `server.js`:

```
require("metrics-tracker-client").track();
```

Once that line is removed, you may also uninstall the `metrics-tracker-client` npm package.

#### License 

Copyright [2015] [IBM Cloud Data Services]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
