import {Messenger} from '../electron/messenger/Messenger';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class AnnotationSidebarClient {

    private static readonly messenger = new Messenger();

    public static toggleAnnotationSidebar() {

        this.messenger.postMessage({
            message: {
                type: 'toggle-annotation-sidebar',
            }
        }).catch(err => log.error("Could not post message", err));

    }

}
