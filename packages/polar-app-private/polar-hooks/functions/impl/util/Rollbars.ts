import Rollbar from 'rollbar';

export namespace Rollbars {

    /**
     * https://docs.rollbar.com/docs/nodejs
     */
    export function create() {

        return new Rollbar({
            accessToken: '6ec34c8e972748758b38095c921d9316',
            captureUncaught: true,
            captureUnhandledRejections: true
        });

    }

}