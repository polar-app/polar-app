import {Nav} from '../../../../ui/util/Nav';
import {useLinkLoader} from "../../../../ui/util/LinkLoaderHook";

export namespace DocURLLoader {

    /**
     * @deprecated
     */
    export function create(): (url: string) => void {

        const linkLoader = Nav.createLinkLoader({focus: true, newWindow: true});

        return (url: string) => {
            linkLoader.load(url);
        }

    }

}

export function useDocURLLoader(): (url: string) => void {

    const linkLoader = useLinkLoader();

    const opts = {focus: true, newWindow: true};

    return (url: string) => {
        alert(url);
        linkLoader(url, opts);
    }

}
