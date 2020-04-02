import {EventBus, PDFFindController} from 'pdfjs-dist/web/pdf_viewer';
import {Finder, FindManager, FindOpts} from "./Finders";

export namespace PDFFindControllers {

    export function createFinder(eventBus: EventBus, findController: PDFFindController): Finder {

        const exec = async (opts: FindOpts): Promise<FindManager> => {

            const cancel = () => {
                eventBus.dispatch('findbarclose');
            };

            const again = () => {
                findController.executeCommand('findagain', opts);
            };

            findController.executeCommand('find', opts);

            eventBus.on("updatefindmatchescount", (evt: any) => {
                console.log("TODO: updatefindmatchescount", evt);
            });

            eventBus.on('updatefindcontrolstate', (event: any) => {
                console.log("TODO: updatefindcontrolstate: ", event);
            });

            // FIXME: when cancel is done the event handlers need
            //  to be removed...

            return {cancel, again};

        };

        return {exec};

    }

}
