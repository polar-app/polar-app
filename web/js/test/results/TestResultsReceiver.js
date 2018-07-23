/**
 * Receiver that works with Spectron to wait until we have results from the
 * test.  We
 */
class TestResultsReceiver {

    constructor(app) {
        if(! app) {
            throw new Error("app not specified");
        }
        this.app = app;
    }

    async receive() {
        //
        // let result = await this.app.client.waitUntil(this.app.client.execute(() => {
        //
        //     // let promise = new Promise(resolve => {
        //     //     setTimeout(() => resolve(true), 5000);
        //     // })
        //     //
        //     // return await promise;
        //     //
        //
        //     return window.test_results;
        //
        // }, 15000));

        let result = await this.app.client.execute(function() {

            // let promise = new Promise(resolve => {
            //     setTimeout(() => resolve(true), 5000);
            // })
            //
            // return await promise;
            //

            return window.test_results;

        });

        console.log("FIXME: got result: " + JSON.stringify(result, null, "  "));

        if(result.status === 0) {
            return result.value;
        } else {
            throw new Error("Wrong result " + JSON.stringify(result));
        }

    }

}

module.exports.TestResultsReceiver = TestResultsReceiver;