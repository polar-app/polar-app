import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export class ReactComponents {

    public static shouldComponentUpdate<P>(props: Readonly<P>,
                                           nextProps: Readonly<P>,
                                           keys: ReadonlyArray<string>): boolean {

        return ! Dictionaries.equals(props, nextProps, keys);

    }

}

