
/**
 *  This is an implementation of interceptStreamProtocol in Electron.  Documented
 *  here:
 *
 *  https://github.com/electron/electron/blob/master/docs/api/protocol.md#protocolinterceptstreamprotocolscheme-handler-completion
 *
 *  I'm building a system to serve locally cached content with Electron and I need
 *  to forward un-cached documents to the network, but serve cached documents
 *  locally.
 *
 * The API states that that we just have to return
 *
 */

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;

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


        // will not work.. resposne is not readable...

        // The response is a readable and I should be able to use this direclty.

        // key point is that the response is READABLE so we can send it directly
        // and we keep low latency!

        let statusCode = response ? response.statusCode : undefined;
        let headers = response ? response.headers : undefined;

        console.log("FIXME: got a response..", response);
        console.log("FIXME: got a response.. statusCode: ", statusCode);
        console.log("FIXME: got a response.. headers: ", headers);

        // FIXME: this confirms that it DOES read the data, that it IS a pipe,
        // and that the data is valid.. just that the callback isn't functioning..
        //response.pipe(process.stdout);

        callback({
            statusCode,
            headers: headers,
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

