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
let utils = require('./js/utils.js');
utils.init();

let rpiLeds = require('rpi-leds');
let leds = new rpiLeds();

let serverConf = {};
console.log(utils.getSelfIPv4Addr());

// to notify web config page through BLE
let blepe = require('./js/bleperipheral.js');
let uuid = {
    service: '148c0888-eedc-4bed-b59e-9718382af1c0',
    chara00: '148c0888-eedc-4bed-b59e-9718382af1c1',
    chara01: '148c0888-eedc-4bed-b59e-9718382af1c2',
    chara02: '148c0888-eedc-4bed-b59e-9718382af1c3',
    chara03: '148c0888-eedc-4bed-b59e-9718382af1c4'
};

let name=null, ip=null, port=null;
let apNameList = new Array();

blepe.init(name, uuid, ip, port);
blepe.start();

let piwifi = require('./js/piwifi.js');
piwifi.scan( (data) => {
    for(var i=0; i<data.length; i++) {
	apNameList.push(data[i].ssid);
    }
    blepe.setApNameList(apNameList);
    console.log(apNameList);
});


blepe.connectToWifi = function(data) {
    console.log('[[[[connect]]]] ', data);
    piwifi.piwifi.connect(data.ssid, data.pass, (err) => {
	if (err) {
	    console.log(err.message);
	} else {
	    console.log('[Successfully connected');
	}
	return;
    });
};

/*
blepe.events.on('connectionrequest', (data) => {
    console.log('[[[[connect]]]] ', data);
    piwifi.piwifi.connect(data.ssid, data.pass, (err) => {
	if (err) {
	    console.log(err.message);
	} else {
	    console.log('Successful connection!');
	}
	return;
    });
});

*/
