/**
 * @abstract
 */
import {Container} from '../Container';
import {ContainerLifecycleListener} from '../lifecycle/ContainerLifecycleListener';

export class ContainerProvider {

    /**
     * Return all containers in the document indexed by their ID.  For pages
     * and thumbnails this is just going to be the page number.
     *
     * @return {Object<number,Container>}
     */
    getContainers(): {[key: number]: Container} {
        throw new Error("Not implemented");
    }

    /**
     *
     * @return {Object<number,Container>}
     */
    _getContainers(selector: string) {

        let result: {[key: number]: Container} = {};

        const elements: HTMLElement[] = Array.from(document.querySelectorAll(selector));

        elements.forEach(element => {
            const page = parseInt(element.getAttribute("data-page-number")!);
            const id = page;
            const container = new Container({id, element, page});
            result[id] = container;
        });

        return result;

    }

    /**
     * Get the {ContainerLifecycleListener} to use with the container types.
     *
     */
    createContainerLifecycleListener(container: Container): ContainerLifecycleListener {
        throw new Error("Not implemented");
    }

}
