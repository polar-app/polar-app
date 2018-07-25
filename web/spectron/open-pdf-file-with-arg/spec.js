const {Application} = require('spectron');
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');
const {Spectron} = require("../../js/test/Spectron");
const {MockSelections} = require("../../js/highlights/text/selection/MockSelections");
const {Functions} = require("../../js/util/Functions");

describe('Open specific PDF file from command line', function () {
    this.timeout(10000);

    let examplePDF = path.join(__dirname, "../../../example.pdf");

    Spectron.setup(path.join(__dirname, '../../..'), examplePDF);

    it('PDF file loads', async function () {

        // TODO: this test isn't very good as PDF.js maintains internal state
        // and changes the default page when it reloads.

        await this.app.client.waitUntilTextExists('.textLayer', 'Trace-based Just-in-Time', 10000)

        console.log("Yup!  Got it!");

        // TODO: build the source to the script we want to run, plus
        // dependencies, within java, then inject it.... but what do I do about
        // the variables defined in the require?  How do I externalize it?


        // await this.app.client.moveToObject(".textLayer div", 10, 10);
        // await this.app.client.leftClick(".textLayer div", 100, 20);

        // let textLayer = $(".textLayer");
        // console.log("asdf: " + textLayer);

        //.moveTo... would work.. but I

        // browser.element

        // make an action to select some text...
        // https://stackoverflow.com/questions/9978081/select-a-text-and-perform-a-click-action
//
//         WebElement element = driver.findElement(By.id("text"));
// // assuming driver is a well behaving WebDriver
//         Actions actions = new Actions(driver);
// // and some variation of this:
//         actions.moveToElement(element, 10, 5)
//                .clickAndHold()
//                .moveByOffset(30, 0)
//                .release()
//                .perform()
//
//         await Functions.waitFor(60000)

        return true;

    });

})
