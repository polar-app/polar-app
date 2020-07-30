import {Nav} from '../../../../ui/util/Nav';

export namespace DocURLLoader {

    export function create(): (url: string) => void {

        const linkLoader = Nav.createLinkLoader({focus: true, newWindow: true});

        return (url: string) => {
            linkLoader.load(url);
        }

    }

}
