import {Finder, FindHandler, IFindOpts, IMatches} from "../../Finders";
import {IEventBus, IPDFFindController} from 'polar-pdf/src/pdf/PDFJSViewer';

export namespace PDFFindControllers {

    interface UpdateFindMatchesCount {
        readonly matchesCount: IMatches;
    }

    export function createFinder(eventBus: IEventBus, findController: IPDFFindController): Finder {

        const defaultOpts = {
            phraseSearch: true,
            highlightAll: true,
            findPrevious: false,
        };

        const exec = (opts: IFindOpts): FindHandler => {

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
                // findController.reset();

            };

            function next() {
                findController.executeCommand('findagain', {
                    ...opts,
                    ...defaultOpts,
                    findPrevious: false
                });
            }

            function prev() {
                findController.executeCommand('findagain', {
                    ...opts,
                    ...defaultOpts,
                    findPrevious: true
                });
            }

            findController.executeCommand('find', {
                ...defaultOpts,
                ...opts
            });

            return {opts, cancel, next, prev};

        };

        return {
            features: {
                phraseSearch: true,
            },
            exec
        };

    }

}
