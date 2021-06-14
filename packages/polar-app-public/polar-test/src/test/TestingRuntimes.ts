export namespace TestingRuntimes {

    export function compute(): 'karma' | 'mocha' | undefined {
        // *** detect karma
        if ((<any>window).__karma__ !== undefined) {
            return 'karma';
        }

        // *** now detect mocha
        //
        // https://stackoverflow.com/questions/29183044/how-to-detect-if-a-mocha-test-is-running-in-node-js

        if (typeof global.it === 'function') {
            return 'mocha'
        }

        return undefined;

    }

    export function isKarma() {
        return compute() === 'karma';
    }

    export function isMocha() {
        return compute() === 'mocha';
    }

}
