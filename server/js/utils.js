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

const utils = function() {
    this.os = require('os');
    this.ifacesObj = { };
};

utils.prototype = {
    init: function() {
        this.getIPAddr();
    },
    getIPAddr: function() {
        this.ifacesObj.ipv4 = new Array();
        this.ifacesObj.ipv6 = new Array();
        //this.ifacesObj.ipv6.push("localhost");
        var interfaces = this.os.networkInterfaces();

        for (var dev in interfaces) {
            interfaces[dev].forEach((details) => {
                if (!details.internal){
                    switch(details.family){
                    case "IPv4":
                        this.ifacesObj.ipv4.push({name:dev, address:details.address});
                        break;
                    case "IPv6":
                        this.ifacesObj.ipv6.push({name:dev, address:details.address});
                        break;
                    }
                }
            });
        }
    },
    getSelfIPv4Addr: function() {
        return this.ifacesObj.ipv4;
    },
    getSelfIPv6Addr: function() {
        return this.ifacesObj.ipv6;
    },
    generateRandomLetters: function() {
        let strong = Math.random() * Math.exp(10, 13);
        const out = (new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16))
                  + (Math.floor(strong*Math.random()).toString(16)) + "aaaaaaa";
        return out.substring(2, 17);
    }
};

module.exports = new utils();
