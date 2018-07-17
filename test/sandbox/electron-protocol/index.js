
const stream = require('stream')

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;

/** @type {Electron.Net} */
const net = electron.net;
const BrowserWindow = electron.BrowserWindow;
const buffer = require('buffer');
console.log("hello world");

function createMainWindow() {
    let mainWindow = new BrowserWindow();

    //let url = "http://89zjvioulpaomlzlu1m29asasssave.com";

    let url = "https://www.cnn.com";

    //mainWindow.loadURL('https://www.cnn.com')
    //mainWindow.loadURL('example:')
    mainWindow.loadURL(url)
    return mainWindow;

}

function myBufferProtocolHandler(request, callback) {

    //console.log("handling protocol" , request);
    //callback(request);

    // FIXME: try to return a fake html buffer and see if that works...
    callback(Buffer.from("<html><body>hello world</body></html>"));

}

function myHttpProtocolHandler(request, callback) {

    // console.log("FIXME: request is: ", request)
    //
    // console.log("FIXME: does it have an abort method: " + (request.abort !== null) );
    //
    // console.log("FIXME: all keys " + Object.keys(request) );
    //
    // console.log("FUIXME: request.abort: " + request.abort );
    // //request.abort();


    // FIXME: a service worker might be the best strategy:
    //
    // registerServiceWorkerSchemes

    // FIXME: I can't get this one to work with the original URL

    // console.log("Handling: ", request.url);
    //
    // if(request.url === "https://www.example.com/" || request.url === "https://www.example.com") {
    //     console.log("myHttpProtocolHandler: no modification");
    //     callback();
    //     return;
    // }
    //
    // console.log("myHttpProtocolHandler: redirecting");
    //
    // callback({
    //     url: "https://www.example.com",
    //     method: "GET"
    // });

    // FIXME: I think I need to call a completion handler...

    //callback();

    callback({ url: request.url, method: request.method });

}

// FIXME:
function functioningHttpProtocolHandler(request, callback) {
    console.log("Got request: ", request)
    //console.log("Got request on session: ", request.session)

    // FIXME": I thjink this means it will just keep executing requests...
    //callback({ url: request.url, method: request.method});
    callback();

}

// FIXME:
function exampleHttpProtocolHandler(request, callback) {
    console.log("Got request: ", request);
    //console.log("Got request on session: ", request.session)

    // FIXME": I thjink this means it will just keep executing requests...
    callback({ url: "https://www.example.com", method: request.method});
    //callback();

}

function myProtocolCompletion(err) {

    console.log("FIXME withn: myProtocolCompletion: " + err);

    if(err)
        console.log("protocol completion failed: ", err);
}

/**
 * Register ALL the schemes...
 *
 * @param schemes
 * @param handler
 * @param completion Called with scheme and err...
 */
function interceptHttpProtocols(schemes, handler) {

    let promises = [];

    schemes.forEach(scheme => {
        let promise = new Promise((resolve, reject) => {

            protocol.interceptHttpProtocol(scheme, handler, (err) => {

                if(err) {
                    reject(err);
                } else {
                    resolve(scheme);
                }

            });

        });

        promises.push(promise);

    });

    return Promise.all(promises);

}

function handleXProtocols(schemes, func, handler, callback) {

    let promises = [];

    schemes.forEach(scheme => {
        let promise = new Promise((resolve, reject) => {

            func(scheme, handler, (err) => {

                if(err) {
                    reject(err);
                } else {
                    resolve(scheme);
                }

            });

        });

        promises.push(promise);

    });

    return Promise.all(promises);

}

function interceptStreamProtocols(schemes, handler) {
    handleXProtocols(schemes, protocol.interceptStreamProtocol.bind(protocol), handler);
}

function testNetRequest() {

    net.request()

}

const text = 'valar morghulis'

function delay (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}


function getStream (chunkSize = text.length, data = text) {
    const body = stream.PassThrough();

    async function sendChunks () {
        let buf = Buffer.from(data);
        for (;;) {
            body.push(buf.slice(0, chunkSize));
            buf = buf.slice(chunkSize);
            if (!buf.length) {
                break
            }
            // emulate network delay
            await delay(50)
        }
        body.push(null)
    }

    sendChunks()
    return body;

}
// https://github.com/electron/electron/blob/master/docs/api/protocol.md#protocolinterceptstreamprotocolscheme-handler-completion

function myStreamProtocolHandler(request, callback) {

    console.log("handling it");

    // const s = new stream.Readable();
    //
    // s.push('your text here');
    // s.push("");
    //
    // callback(s);

    callback(getStream("asdf"));

}

app.on('ready', async function() {

    console.log(protocol);

    console.log("standard schemes: " + protocol.getStandardSchemes());
    console.log("standard schemes: " + protocol.getStandardSchemes);

    //protocol.registerHttpProtocol("https", myProtocolHandler, myProtocolCompletion);
    //protocol.interceptHttpProtocol("https", myProtocolHandler, myProtocolCompletion);


    //protocol.interceptStreamProtocol("https", myProtocolHandler, myProtocolCompletion);
    //protocol.interceptBufferProtocol("https", myBufferProtocolHandler, myProtocolCompletion);

    //await interceptHttpProtocols(["http", "https"], functioningHttpProtocolHandler)

    //protocol.registerHttpProtocol("example", exampleHttpProtocolHandler)

    // protocol.interceptHttpProtocol("http", myHttpProtocolHandler, myProtocolCompletion);
    // protocol.interceptHttpProtocol("https", myHttpProtocolHandler, myProtocolCompletion);

    //await interceptStreamProtocols(["http", "https"], myStreamProtocolHandler);

    // protocol.registerFileProtocol('atom', (request, callback) => {
    //     const url = request.url.substr(7)
    //     callback({path: path.normalize(`${__dirname}/${url}`)})
    // }, (error) => {
    //     if (error) console.error('Failed to register protocol')
    // })

    protocol.registerHttpProtocol("https", exampleHttpProtocolHandler, function(err) {
        console.log(err);
    })

    console.log("Opening window");

    let mainWindow = createMainWindow();

});

