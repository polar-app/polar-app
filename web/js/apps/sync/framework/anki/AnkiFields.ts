import {Dictionaries} from '../../../../util/Dictionaries';

export class AnkiFields {

    static normalize(fields: FieldsMap) {

        let result: FieldsMap = {};

        Dictionaries.forDict(fields, (key, value) => {
            key = key.charAt(0).toUpperCase() + key.substr(1);
            result[key] = value;
        });

        return result;

    }

}

type FieldsMap = {[key: string]: string};
