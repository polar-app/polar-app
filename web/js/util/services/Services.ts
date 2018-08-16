import {StoppableService} from './Service';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class Services {

    static stop(serviceReferences: {[name: string]: StoppableService}): void {

        Object.entries(serviceReferences).forEach(serviceReference => {

            let name = serviceReference[0];
            let service = serviceReference[1];

            let message = `Stopping service ${name}...`;

            log.info(message);

            service.stop();

            log.info(message + "done");

        });

    }

}
