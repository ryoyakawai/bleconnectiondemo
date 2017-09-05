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

var eddyStone = function () {
    this.eds = require('eddystone-beacon');
    this.url = null;
    this.options = {
        name: null,
        txPowerLevel: -22,
        tlmCount: 2,
        tlmPeriod: 10
    };
};

eddyStone.prototype = {
    setAdvertiseUrl: function(url) {
        this.url = url;
        if(typeof this.url==='undefined'
           || this.url==null) {
            this.url=false;
        }
        return this.url;
    },
    setOptions: function(options) {
        if(typeof options !=='undefined') {
            if(typeof options.name !== undefined) this.options.name=options.name;
            if(typeof options.txPowerLevel !== undefined) this.options.txPowerLevel=options.txPowerLevel;
            if(typeof options.tlmCount !== undefined) this.options.tlmCount=options.tlmCount;
            if(typeof options.tlmPeriod !== undefined) this.options.tlmPeriod=options.tlmPeriod;
        }
        return this.options;
    },
    startAdvertise: function() {
        console.log(this.url, this.options);
        this.eds.advertiseUrl(this.url, this.options);
    }
};

module.exports = new eddyStone();
