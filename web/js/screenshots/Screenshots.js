const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

let log = new Logger()

/**
  */
class Screenshots {

    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param screenshotRequest.  Specify either rect or element to capture as
     *                            properties.
     *
     * @return {Promise} for {NativeImage}. You can call toDateURL on the image
     *         with scaleFactor as an option.
     *
     */
    static async capture(screenshotRequest) {

        if(! screenshotRequest.rect && screenshotRequest.element) {
            screenshotRequest.rect = screenshotRequest.element.getBoundingClientRect();
        }

        // the element is invalid when sent to the main process.
        delete screenshotRequest.element;

        // now send the screenshotRequest IPC message and wait for the response
        return ipcRenderer.sendSync('create-screenshot', screenshotRequest);

    }

}

module.exports.Screenshots = Screenshots;
