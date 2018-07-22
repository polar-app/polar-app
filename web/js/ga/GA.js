const Analytics  = require('electron-google-analytics');

const analytics = new Analytics.default('UA-122721184-1');

class GA {

    static getInstance() {
        return analytics;
    }

}

module.exports.GA = GA;
