
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

    //let url = "https://www.cnn.com";
    let url = "http://cnn.com";
    mainWindow.loadURL(url);
    return mainWindow;

}

let interceptCallback = async (req, callback) => {
    console.log(`intercepted ${req.method} ${req.url}`);

    //console.log("headers: " , req.headers )

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
        //console.log("FIXME: got a response.. headers: ", headers);

        // FIXME: this confirms that it DOES read the data, that it IS a pipe,
        // and that the data is valid.. just that the callback isn't functioning..
        //response.pipe(process.stdout);

        // FIXME characterEncoding here...

        // FIXME: this is hard coded as utf8... parse the charset from the
        // mimeType... and use the proper default when not specified.
        let buffer = await convertStream.toBuffer(response);

        // callback({
        //     statusCode,
        //     headers: headers,
        //     data: buffer,
        // });

        // mimeType

        // FIXME: we're currently handling charset encoding improperly and
        // stripping the encoding if it's specified in the charset.  This will be
        // resolved when we migrate to interceptStreamProtocol
        let contentType = parseContentType(headers["content-type"][0]);

        console.log(`Using mimeType=${contentType.mimeType} for ${req.url}`)

        callback({
            mimeType: contentType.mimeType,
            data: buffer,
        });


    })
    .on('error', (error) => {
        console.error(`'on error': ${error.message}`);
    });

    request.end();

};

/**
 * Parse the content-type header and include information about the charset too.
 */
function parseContentType(contentType) {

    console.log(typeof contentType, contentType)

    // https://www.w3schools.com/html/html_charset.asp

    // html4 is ISO-8859-1 and HTML5 is UTF-8

    // https://stackoverflow.com/questions/8499930/how-to-identify-html5

    // text/html; charset=utf-8

    let mimeType = "text/html"

    if(! contentType) {
        contentType = mimeType;
    }

    let charset;
    let match;

    if(match = contentType.match("^([a-zA-Z]+/[a-zA-Z+]+)")) {
        mimeType = match[1];
    }

    if(match = contentType.match("; charset=([^ ;]+)")) {
        charset = match[1];
    }

    return {
        mimeType,
        charset
    }

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

