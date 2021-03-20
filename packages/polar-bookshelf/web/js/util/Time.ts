/**
 * Functions related to time.
 */
export class Time {

    /**
     * Promise to sleep for a given interval.
     *
     * @param interval
     * @return {Promise<any>}
     */
    static sleep(interval: number) {

        return new Promise<boolean>(resolve =>  {
            setTimeout(() => {
                resolve(true);
            }, interval);
        })

    }

}
