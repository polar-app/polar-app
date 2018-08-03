import {Tokens} from './Tokens';
import {Preconditions} from '../Preconditions';
import {Strings} from './Strings';


export class Attributes {

    /**
     * Extract data attributes on an element as a map.
     *
     */
    static dataToMap(element: HTMLElement) {

        let result: {[key: string]: string | number | boolean} = {};

        Preconditions.assertNotNull(element, "element");

        Array.from(element.attributes).forEach((attr) => {

            if(attr.name.startsWith("data-")) {
                let key = attr.name;
                key = key.replace("data-", "");
                key = Tokens.hyphenToCamelCase(key);
                result[key] = Strings.toPrimitive(attr.value);
            }

        });

        return result;

    }

}
