export namespace Mocha {

    export function isMocha() {
        return typeof global.it === 'function';
    }

}
