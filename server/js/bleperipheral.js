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
var blePeripheral = function() {};

blePeripheral.prototype = {
    init: function(name, uuid, ip, port) {
	this.primaryService;
	this.name = name;
 	this.uuid = {
	    service: uuid.service.toLowerCase().replace(/\-/g, ''),
	    chara00: uuid.chara00.toLowerCase().replace(/\-/g, '')
	};
	this.serviceUuids = [this.uuid.service];
	this.ipArray = ip.split('.');
	this.portArray = [0, 0, 0, 0];
	var cnt=0;
	while(port > 0) {
	    this.portArray[cnt] = (port & 0xff);
	    port = port >> 8;
	    cnt++;
	}
    },
    start: function() {
	var bleno = require('bleno');
	var uuid = this.uuid, ipArray=this.ipArray, portArray=this.portArray;
	var self = this;
	var primaryService = new bleno.PrimaryService({
	    uuid: self.uuid.service,
	    characteristics: [
		      new bleno.Characteristic({
		          uuid: self.uuid.chara00,
		          properties: ['read'],
		          value: new Buffer(ipArray)
		      }),
	    ]
	});

	bleno.on('stateChange', function(state) {
	    console.log('[BLE Peripheral] stateChange: '+ state);
	    if (state === 'poweredOn') {
		bleno.startAdvertising(self.name, self.serviceUuids, function(error){
		    if (error) console.error(error);
		});
	    } else {
		bleno.stopAdvertising();
	    }
	});
	bleno.on('advertisingStart', function(error){
	    if (!error) {
		console.log('[BLE Peripheral] start advertising. (name=' + self.name + ', UUID=' + self.serviceUuids +')');
		bleno.setServices([primaryService]);
	    } else {
		console.error(error);
	    }
	});
    }
};

module.exports = new blePeripheral();
