
const zlib = require('zlib');
const text = require('text-encoding');
const stream = require('stream')

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
const convertStream = require("convert-stream");

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
    .on('response', async (response) => {


        // will not work.. resposne is not readable...

        // The response is a readable and I should be able to use this direclty.

        // key point is that the response is READABLE so we can send it directly
        // and we keep low latency!

        let headers = response ? response.headers : {};

        console.log("FIXME: got a response..", response);
        console.log("FIXME: got a response.. headers: ", headers);

        // FIXME: this confirms that it DOES read the data, that it IS a pipe,
        // and that the data is valid.. just that the callback isn't functioning..
        //response.pipe(process.stdout);

        let buffer = await convertStream.toBuffer(response);

        // callback({
        //     statusCode,
        //     headers: headers,
        //     data: buffer,
        // });

        // mimeType

        let mimeType = headers["content-type"];
        if( !mimeType) {
            mimeType = "text/html";
        }

        callback({
            mimeType: mimeType,
            data: buffer,
        });


    })
    .on('error', (error) => {
        console.error(`'on error': ${error.message}`);
    });

    request.end();

};

function toBuffer(stream) {

    return toArray(stream)
        .then(function (parts) {
            const buffers = parts
                .map(part => util.isBuffer(part) ? part : Buffer.from(part));
            return Buffer.concat(buffers);
        })

}

app.on('ready', async function() {

    protocol.interceptBufferProtocol('http', interceptCallback, (error) => {
        if (error) console.error('failed to register protocol handler for HTTP');
    });
    protocol.interceptBufferProtocol('https', interceptCallback, (error) => {
        if (error) console.error('failed to register protocol handler for HTTPS');
    });

    let mainWindow = createMainWindow();

});

