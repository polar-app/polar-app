class Promises {

    /**
     * Return a promise that returns a literal value.
     *
     * @param val
     * @return {Promise<any>}
     */
    static of(val) {
        return new Promise(resolve => {
            resolve(val);
        });
    }

}

module.exports.Promises = Promises;
