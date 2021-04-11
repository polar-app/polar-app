import {Mappers} from "polar-shared/src/util/Mapper";

export namespace ContentEditableWhitespace {

    export function trim(html: string): string {

        return Mappers.create(html)
                      .map(current => current.replace(/&nbsp;/g, ' '))
                      .map(current => current.trim())
                      .collect();

    }

}
