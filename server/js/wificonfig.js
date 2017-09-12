/**
 * Copyright 2017 Ryoya Kawai
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
**/

var wifiConfig = function () {
    this.wifi = require('node-wifi');
    this.url = null;
    this.options = {
        name: null,
        txPowerLevel: -22,
        tlmCount: 2,
        tlmPeriod: 10
    };
};

wifiConfig.prototype = {
    init: function() {
	this.wifi.init({ iface: null });
    },
    scan: function(callback) {
	this.wifi.scan((err, networks) => {
	    if (err) {
		console.log(err);
	    } else {
		callback(networks);
	    }
	});
	
    },
    connect: function(ssid, passwd) {
	let out=true;
	this.wifi.connect({ ssid : ssid, password : passwd}, (err) => {
	    if (err) {
		console.log(err);
		out=false;
	    }
	    console.log('[Connected] ' + ssid);
	    return out;
	});
    },
    disconnect: function() {
	this.wifi.disconnect((err) => {
	    if (err) {
	        console.log(err);
	    }
	    console.log('[Disconnected]');
	});
    },
    getCurrentConnections: function(callback) {
	this.wifi.getCurrentConnections( (err, conn) => {
	    if (err) {
		console.log(err);
	    } else {
		callback(conn);
	    }
	});
    }
};

module.exports = new wifiConfig();
