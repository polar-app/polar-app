
const r = require('request');
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

    //let url = "https://www.cnn.com";
    let url = "https://httpbin.org/get";
    mainWindow.loadURL(url)
    return mainWindow;

}

var interceptCallback = async (request, callback) => {
    console.log(`intercepted ${request.method} ${request.url}`);

    // TODO: support multiple upload data's
    var options = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: (request.uploadData && request.uploadData[0]) ? request.uploadData[0].bytes : undefined,
        encoding: null,
        gzip: false,
        followRedirect: false,
    };

    r(options, async (error, response, body) => {
        const contentType = response ? (response.headers['Content-Type'] || response.headers['content-type']) : undefined;
        if (!contentType || (contentType.indexOf('text/javascript') < 0 && contentType.indexOf('application/javascript') < 0)) {
            console.log(`ignoring 'callback', used 'response'`);
            return;
        }

        const contentEncoding = response ? (response.headers['Content-Encoding'] || response.headers['content-encoding']) : undefined;

        let source = body;
        if (!error && response.statusCode === 200 && contentType) {
            if (contentEncoding === 'gzip') {
                console.log(`decoding GZIP response`);
                body = zlib.gunzipSync(body);
            }

            if (contentType.indexOf('text/javascript') >= 0 || contentType.indexOf('application/javascript') >= 0) {
                source = (new text.TextDecoder()).decode(body);
                // make changes
            }

            if (contentEncoding === 'gzip') {
                source = zlib.gzipSync(source);
            }
        }
        else {
            console.log(`did not modify response (error, non-200 status code, or no content type)`);
        }

        console.log("Going to write source...: " + source)

        var myStream = new stream.PassThrough();
        myStream.end(source);
        console.log("Writing data here (2): ");

        callback({
            statusCode: response ? response.statusCode : undefined,
            headers: response ? response.headers : undefined,
            data: myStream,
        });
    })
    .on('response', (response) => {

        const contentType = response ? (response.headers['Content-Type'] || response.headers['content-type']) : undefined;
        if (contentType && (contentType.indexOf('text/javascript') >= 0 || contentType.indexOf('application/javascript') >= 0)) {
            console.log(`ignoring 'on response', will use 'callback' below`);
            return;
        }

        // FIXME: this works because the response here is a readable...

        let headers = response ? response.headers : undefined;

        //console.log("FIXME: headers", headers);
        //console.log("Writing data here (1): " , response);

        // TODO: this works and prints to stdout.
        //console.log("FIXME: sending to stdout");
        //response.pipe(process.stdout)

        callback({
            statusCode: response ? response.statusCode : undefined,
            headers: headers,
            data: response,
        });

    })
    .on('error', (error) => {
        console.error(`'on error': ${error.message}`);
    });
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

