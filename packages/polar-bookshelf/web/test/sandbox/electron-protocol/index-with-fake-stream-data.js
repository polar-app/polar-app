
var debugStream = require('debug-stream')('polar')
const zlib = require('zlib');
const text = require('text-encoding');
const stream = require('stream')

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
var str = require('string-to-stream')


/** @type {Electron.Net} */
const net = electron.net;
const BrowserWindow = electron.BrowserWindow;
const {PassThrough} = require('stream')

function createStream (text) {
    const rv = new PassThrough() // PassThrough is also a Readable stream
    rv.push(text)
    rv.push(null)
    return rv
}

function createMainWindow() {
    let mainWindow = new BrowserWindow();

    //let url = "http://www.cnn.com";
    let url = "http://httpbin.org/get";
    mainWindow.loadURL(url)
    return mainWindow;

}

let interceptCallback = async (req, callback) => {

    console.log(`intercepted ${req.method} ${req.url}`);

    // let responseStream = new stream.PassThrough();
    // responseStream.end("<html><body>hello world</body></html>");

    // let data = str("<html><body>hello world</body></html>");
    //
    // console.log(data);
    //
    // console.log("Going to callback()")
    // callback({
    //     statusCode: 200,
    //     headers: {"Content-Type": "text/html"},
    //     data: data,
    // });

//
// export interface ReadableStream extends EventEmitter {
//         readable: boolean;
//         read(size?: number): string | Buffer;
//         setEncoding(encoding: string | null): this;
//         pause(): this;
//         resume(): this;
//         isPaused(): boolean;
//         pipe<T extends WritableStream>(destination: T, options?: { end?: boolean; }): T;
//         unpipe<T extends WritableStream>(destination?: T): this;
//         unshift(chunk: string): void;
//         unshift(chunk: Buffer): void;
//         wrap(oldStream: ReadableStream): ReadableStream;
//     }

    callback({
        statusCode: 200,
        headers: {
            'content-type': 'text/html'
        },
        data: createStream('<h5>Response</h5>')
    })

};

app.on('ready', async function() {

    protocol.interceptStreamProtocol('http', interceptCallback, (error) => {

        if (error) {
            console.error('failed to register protocol handler for HTTP');
            return;
        }

        let mainWindow = createMainWindow();

    });

    // protocol.interceptStreamProtocol('https', interceptCallback, (error) => {
    //     if (error) console.error('failed to register protocol handler for HTTPS');
    // });


});

