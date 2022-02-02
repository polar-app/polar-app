import {URLStr} from "polar-shared/src/util/Strings";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace NoteURLs {

    export interface INoteURL {
        readonly target: string;
    }

    export function parse(url: URLStr): INoteURL {

        function computePathName() {
            if (url.startsWith('http')) {
                const u = new URL(url);
                return u.pathname;
            }

            return url;
        }

        const pathname = computePathName();
        const target = decodeURIComponent(Arrays.last(pathname.split('/'))!);
        return {target};
    }

}
