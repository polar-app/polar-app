
const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;

const BrowserWindow = electron.BrowserWindow;

function createMainWindow() {

    let mainWindow = new BrowserWindow();

    let url = "http://httpbin.org/get";
    mainWindow.loadURL(url);

}

function interceptRequest(req, callback) {
    console.log("Request intercepted");
    callback(null);
}

app.on('ready', async function() {

    protocol.interceptStreamProtocol('http', interceptRequest, (error) => {

        if (error) {
            console.error('failed to register protocol handler for HTTP');
            return;
        }

        createMainWindow();

    });
    // protocol.interceptStreamProtocol('https', interceptCallback, (error) => {
    //     if (error) console.error('failed to register protocol handler for HTTPS');
    // });


});

