/**
 * Functions related to time.
 */
class Time {

    /**
     * Promise to sleep for a given interval.
     *
     * @param interval
     * @return {Promise<any>}
     */
    static sleep(interval) {

        return new Promise(resolve =>  {
            setTimeout(() => {
                resolve();
            }, interval);
        })

    }

}

module.exports.Time = Time;
