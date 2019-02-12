import {LoadDocRequest} from './LoadDocRequest';
import {Preconditions} from '../../../Preconditions';
import {DistRuntime} from '../../../dist_runtime/DistRuntime';
import {ElectronDocLoader} from './electron/ElectronDocLoader';

export class DocLoader {

    public static async load(loadDocRequest: LoadDocRequest) {

        if (DistRuntime.get() === 'electron') {
            await ElectronDocLoader.load(loadDocRequest);
        } else {
            throw new Error("Not implemented yet");
        }

    }


}
