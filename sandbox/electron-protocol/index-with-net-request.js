
const zlib = require('zlib');
const text = require('text-encoding');
const stream = require('stream')

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;

/** @type {Electron.Net} */
const net = electron.net;
const BrowserWindow = electron.BrowserWindow;

function createMainWindow() {
    let mainWindow = new BrowserWindow();

    let url = "https://www.cnn.com";
    mainWindow.loadURL(url)
    return mainWindow;

}

let interceptCallback = async (req, callback) => {
    console.log(`intercepted ${req.method} ${req.url}`);

    //FIXME: I need to call setHeader() for each of the headers...

    // TODO: support multiple upload data's
    let options = {
        method: req.method,
        url: req.url,

        // FIXME: upload data not known yet.
        //headers: request.headers,
        //body: (request.uploadData && request.uploadData[0]) ? request.uploadData[0].bytes : undefined,
        // encoding: null,
        // gzip: false,
        // followRedirect: false,
    };

    console.log("Going to net.request: ", options);

    let request = net.request(options)
    .on('response', (response) => {

        console.log("FIXME: got a response..");

        callback({
            statusCode: response ? response.statusCode : undefined,
            headers: response ? response.headers : undefined,
            data: response,
        });

    })
    .on('error', (error) => {
        console.error(`'on error': ${error.message}`);
    });

    request.end();

};

app.on('ready', async function() {

    protocol.interceptStreamProtocol('http', interceptCallback, (error) => {
        if (error) console.error('failed to register protocol handler for HTTP');
    });
    protocol.interceptStreamProtocol('https', interceptCallback, (error) => {
        if (error) console.error('failed to register protocol handler for HTTPS');
    });

    let mainWindow = createMainWindow();

});

