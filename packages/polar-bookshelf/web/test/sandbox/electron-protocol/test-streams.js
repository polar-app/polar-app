
const zlib = require('zlib');
const text = require('text-encoding');
const stream = require('stream')

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
var str = require('string-to-stream')

// let data = str("<html><body>hello world</body></html>");
// data.resume();

const { Readable } = require('stream');
const inStream = new Readable({
    read() {}
});
inStream.push('ABCDEFGHIJKLM');
inStream.push('NOPQRSTUVWXYZ');
inStream.push(null); // No more data

//console.log(inStream.read());
inStream.pipe(process.stdout);
