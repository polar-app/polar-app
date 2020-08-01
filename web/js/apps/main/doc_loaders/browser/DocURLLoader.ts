import {Nav} from '../../../../ui/util/Nav';
import {useNav} from "../../../../ui/util/NavHook";

export namespace DocURLLoader {

    /**
     * @Deprecated
     */
    export function create(): (url: string) => void {

        const linkLoader = Nav.createLinkLoader({focus: true, newWindow: true});

        return (url: string) => {
            linkLoader.load(url);
        }

    }

}

export function useDocURLLoader(): (url: string) => void {

    const nav = useNav();

    const opts = {focus: true, newWindow: true};

    return (url: string) => {
        nav(url, opts);
    }

}
