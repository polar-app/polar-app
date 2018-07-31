export class Promises {

    /**
     * Return a promise that returns a literal value.
     *
     * @param val
     * @return {Promise<any>}
     */
    static of(val: any) {
        return new Promise(resolve => {
            resolve(val);
        });
    }


    /**
     * Calls the given callback as a promise which we can await but runs it with
     * a background thread via timeout.
     */
    static async withTimeout<T>(timeout: number, callback: () => Promise<T> ) {

        return new Promise((resolve,reject) => {

            setTimeout(() => {
                callback().then(result => resolve(result))
                          .catch(err => reject(err));
            }, timeout);

        });

    }

}
