import {Clipboard} from '../Clipboard';
import {clipboard} from "electron";
import {isPresent} from '../../../../Preconditions';

export class ElectronClipboard implements Clipboard{

    public writeText(text: string) {
        clipboard.writeText(text);
    }

    public static supported() {
        return isPresent(clipboard);
    }

}
