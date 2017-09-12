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
var blePeripheral = function() {
    this.connectToWifi = function(){};
};

blePeripheral.prototype = {
    init: function(name, uuid, ip, port) {
	var events = require('events');
	this.events = new events.EventEmitter();

	this.encoding = 'utf-8';
	this.TextEncoding = require('text-encoding');
	this.primaryService;
	if(name!=null) this.name = name;
 	this.uuid = {
	    service: uuid.service.toLowerCase().replace(/\-/g, ''),
	    chara00: uuid.chara00.toLowerCase().replace(/\-/g, ''),
	    chara01: uuid.chara01.toLowerCase().replace(/\-/g, ''),
	    chara02: uuid.chara02.toLowerCase().replace(/\-/g, ''),
	    chara03: uuid.chara03.toLowerCase().replace(/\-/g, '')
	};
	this.serviceUuids = [this.uuid.service];
	this.ipArray = [0, 0, 0, 0];
	this.portArray = [0, 0, 0, 0];
	if(ip!=null || port!=null) {
	    this.ipArray = ip.split('.');
	    var cnt=0;
	    while(port > 0) {
		this.portArray[cnt] = (port & 0xff);
		port = port >> 8;
		cnt++;
	    }
	}
    },
    connectToWifi: function() {},
    setApNameList: function(list) {
	this.apNameList = list;
    },
    start: function() {
	var bleno = require('bleno');
	var uuid = this.uuid, ipArray=this.ipArray, portArray=this.portArray;
	var self = this;
	let callback = (data) => { console.log(data); };
	var primaryService = new bleno.PrimaryService({
	    uuid: self.uuid.service,
	    characteristics: [
		      new bleno.Characteristic({
		          uuid: self.uuid.chara00,
		          properties: ['read'],
		          value: new Buffer(ipArray)
		      }),
		      new bleno.Characteristic({
		          uuid: self.uuid.chara01,
		          properties: ['read', 'write'],
			  onWriteRequest: function(data, offset, withouResponse, callback) {
			      let mode = new self.TextEncoding.TextDecoder(self.encoding).decode(data);
			      if(mode=='requestHeader') {
				  console.log(self);
			      }
			      callback(self.RESULT_SUCCESS);
			  },
			  onReadRequest: function (offset, callback) {
			      let string = new self.TextEncoding.TextEncoder().encode('123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012'); // max 102 letter
			      console.log('[STRING] ', string);
			      callback(this.RESULT_SUCCESS, string);
			  }
		      }),
		      new bleno.Characteristic({ // AP Name + \t + AP PAss
		          uuid: self.uuid.chara02,
		          properties: ['read', 'write'],
			  withoutResponse: false,
			  onWriteRequest: function(data, offset, withouResponse, callback) {
			      console.log('[CALLBACK] ', callback);
			      let string = new self.TextEncoding.TextDecoder(self.encoding).decode(data);
			      let ap_name_pass = string.split("\t")
			      self.connectToWifi({'ssid': ap_name_pass[0], 'pass': ap_name_pass[1]});
			      //self.events.emit('connectionrequest', {'ssid': ap_name_pass[0], 'pass': ap_name_pass[1]});
			      callback(self.RESULT_SUCCESS);
			  }
		      }),
		      new bleno.Characteristic({
		          uuid: self.uuid.chara03,
		          properties: ['write'],
			  onWriteRequest: function (data, offset, withouResponse, callback) {
			      var string = new self.TextEncoding.TextDecoder(self.encoding).decode(data);
			      console.log('[chara03]', string, self.RESULT_SUCCESS);
			      callback(self.RESULT_SUCCESS);
			  }
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
		console.log('[BLE Peripheral] start advertising. (UUID.service:' + self.serviceUuids + ')');
		bleno.setServices([primaryService]);
	    } else {
		console.error(error);
	    }
	});
    }
};

module.exports = new blePeripheral();
