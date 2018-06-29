
const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
const BrowserWindow = electron.BrowserWindow;

console.log("hello world");

function createMainWindow() {
    let mainWindow = new BrowserWindow();
    mainWindow.loadURL('https://www.cnn.com')
    return mainWindow;
}

function myProtocolHandler(request, callback) {
    console.log("handling protocol" , request);
    //callback(request);
}

function myProtocolCompletion(err) {
    console.log("completed: ", err);
}

app.on('ready', async function() {

    console.log(protocol);

    console.log("standard schemes: " + protocol.getStandardSchemes());
    console.log("standard schemes: " + protocol.getStandardSchemes);

    //protocol.registerHttpProtocol("https", myProtocolHandler, myProtocolCompletion);
    //protocol.interceptHttpProtocol("https", myProtocolHandler, myProtocolCompletion);

    protocol.interceptStreamProtocol("https", myProtocolHandler, myProtocolCompletion);

    // protocol.registerFileProtocol('atom', (request, callback) => {
    //     const url = request.url.substr(7)
    //     callback({path: path.normalize(`${__dirname}/${url}`)})
    // }, (error) => {
    //     if (error) console.error('Failed to register protocol')
    // })

    let mainWindow = createMainWindow();

    console.log("It worked!");

});

