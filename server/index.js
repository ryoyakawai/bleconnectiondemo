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
let webPort=11011;

let cwd=process.cwd();

let utils = require('./js/utils.js');
utils.init();

let rpiLeds = require('rpi-leds');
let leds = new rpiLeds();

let serverConf = {};
console.log(utils.getSelfIPv4Addr());
serverConf.ip = ((utils.getSelfIPv4Addr()).pop())['address'],
serverConf.port = webPort,
serverConf.url = 'http://' + serverConf.ip + ':' + serverConf.port + '/';

// to notify web config page through BLE
let blepe = require('./js/bleperipheral.js');
let name = 'bleconndemo';
let uuid = {
    service: '148c0888-eedc-4bed-b59e-9718382af1c0',
    chara00: '148c0888-eedc-4bed-b59e-9718382af1c1'
};
let ip = serverConf.ip,
    port = serverConf.port;
blepe.init(name, uuid, ip, port);
blepe.start();

// wifi
let wifi = require('./js/wificonfig.js');
wifi.init();

// establish Web Server(API)
let express = require('express');
let app = express();
let server = app.listen(serverConf.port, () => {
    console.log('[Server Started] ' + serverConf.url);
});

app.get('/api/ble/startpwrheartbeatled', (req, res, next) => {
    leds.power.heartbeat();
    res.json({status: true, result: true});
});
app.get('/api/ble/stoppwrheartbeatled', (req, res, next) => {
    leds.power.reset();
    res.json({status: true, result: true});
});
app.get('/api/ble/startactheartbeatled', (req, res, next) => {
    leds.status.heartbeat();
    res.json({status: true, result: true});
});
app.get('/api/ble/stopactheartbeatled', (req, res, next) => {
    leds.status.reset();
    res.json({status: true, result: true});
});
app.get('/api/wifi/getCurrentConnections', (req, res, next) => {
    wifi.getCurrentConnections((conn) => {
	console.log(conn);
	res.json({status: true, connections: JSON.stringify(conn)});
    });
});
app.get('/api/wifi/scanwifiap', (req, res, next) => {
    wifi.scan((list) => {
	console.log(list);
	res.json({status: true, connections: JSON.stringify(list)});
    });
});
app.get('/api/wifi/connectwifi', (req, res, next) => {
    let ssid = req.query.ssid,
	passwd = req.query.passwd;
    let out=wifi.connect(ssid, passwd);
    res.json({status: out});
});

// establish Web Server(Doc)
console.log(cwd + '/server/docroot/index.html');
console.log(cwd + '/server/docroot');

app.use('/', express.static(cwd + '/server/docroot/index.html'));
app.use(express.static(cwd + '/server/docroot'));
