import {WebResource} from '../../../electron/webresource/WebResource';

export interface LoadedFile {

    readonly webResource: WebResource;

    readonly title?: string;

}
