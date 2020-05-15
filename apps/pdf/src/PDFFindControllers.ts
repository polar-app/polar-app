import {EventBus, PDFFindController} from 'pdfjs-dist/web/pdf_viewer';
import {Finder, FindHandler, IFindOpts, IMatches} from "./Finders";

export namespace PDFFindControllers {

    interface UpdateFindMatchesCount {
        readonly matchesCount: IMatches;
    }

    export function createFinder(eventBus: EventBus, findController: PDFFindController): Finder {

        const exec = async (opts: IFindOpts): Promise<FindHandler> => {

            function updatefindmatchescount(evt: UpdateFindMatchesCount) {
                // console.log("TODO: updatefindmatchescount", evt);
                opts.onMatches(evt.matchesCount);
            }

            function updatefindcontrolstate(evt: UpdateFindMatchesCount) {
                // console.log("TODO: updatefindcontrolstate", evt);
                opts.onMatches(evt.matchesCount);
            }

            // {current: 3, total: 177}
            eventBus.on("updatefindmatchescount", updatefindmatchescount);
            eventBus.on('updatefindcontrolstate', updatefindcontrolstate);

            const cancel = () => {
                eventBus.off("updatefindmatchescount", updatefindmatchescount);
                eventBus.off('updatefindcontrolstate', updatefindcontrolstate);

                eventBus.dispatch('findbarclose');

            };

            function next() {
                findController.executeCommand('findagain', {...opts, findPrevious: false});
            }

            function prev() {
                findController.executeCommand('findagain', {...opts, findPrevious: true});
            }

            findController.executeCommand('find', opts);

            // FIXME: this needs to be remove AFTER or it stays in the buss!!!

            // FIXME: when cancel is done the event handlers need
            //  to be removed...

            return {opts, cancel, next, prev};

        };

        return {exec};

    }

}
