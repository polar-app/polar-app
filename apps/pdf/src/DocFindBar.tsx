import {MUISearchBox2} from "../../../web/spectron0/material-ui/MUISearchBox2";
import * as React from "react";
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import {Logger} from "polar-shared/src/logger/Logger";
import isEqual from "react-fast-compare";
import {MUIPaperToolbar} from "../../../web/spectron0/material-ui/MUIPaperToolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {MUIButtonBar} from "../../../web/spectron0/material-ui/MUIButtonBar";
import CloseIcon from '@material-ui/icons/Close';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Collapse from "@material-ui/core/Collapse";
import {FindHandler, FindOpts} from "./Finders";
import {InputEscapeListener} from "../../../web/spectron0/material-ui/complete_listeners/InputEscapeListener";

const log = Logger.create();

type FindCallback = (opts: FindOpts) => void;

function useFindCallback(): FindCallback {

    const {finder, findHandler} = useDocViewerStore();
    const {setFindHandler, doFind} = useDocViewerCallbacks();

    return (opts: FindOpts) => {

        const {query} = opts;

        if (query.trim() === '') {
            setFindHandler(undefined);
            return;
        }

        // FIXME: we should re-execute if the new query doesn't equal the
        // current query
        if (findHandler && isEqual(opts, findHandler.opts)) {
            // there's already a find handler so that means there's an active
            // search so we should run the search 'again' to find the next match

            findHandler.next();
            return;
        }

        doFind(opts);

    }

}

export const DocFindBar = React.memo(() => {

    const {findHandler, findActive} = useDocViewerStore();
    const {setFindActive} = useDocViewerCallbacks();
    const doFind = useFindCallback();

    const [opts, setOpts] = React.useState<FindOpts>({
        query: "",
        phraseSearch: false,
        caseSensitive: false,
        highlightAll: true,
        findPrevious: false,
        onMatch: NULL_FUNCTION
    });

    const cancelFind = React.useCallback(() => {
        setOpts({...opts, query: ""})
        setFindActive(false)
    }, []);

    const handleFind = React.useCallback((query: string) => {
        const newOpts = {...opts, query};
        setOpts(newOpts);
        doFind(newOpts);
    }, []);

    return (
        <Collapse in={findActive} timeout={50}>
            <InputEscapeListener onEscape={cancelFind}>
                <MUIPaperToolbar borderBottom>

                    <div style={{
                             display: 'flex',
                             alignItems: "center",
                         }}
                         className="pl-1 pr-1">

                        <MUIButtonBar>

                            <MUISearchBox2 className="mt-1 mb-1"
                                           onChange={handleFind}
                                           autoFocus={true}
                                           value={opts.query}
                                           style={{
                                               width: '20em'
                                           }}
                                           placeholder="Search..."/>

                            <IconButton disabled={! findHandler}
                                        onClick={() => findHandler!.prev()}>
                                <ArrowUpwardIcon/>
                            </IconButton>

                            <IconButton disabled={! findHandler}
                                        onClick={() => findHandler!.next()}>
                                <ArrowDownwardIcon/>
                            </IconButton>

                        </MUIButtonBar>

                        <div style={{
                                 display: 'flex',
                                 alignItems: "center",
                                 justifyContent: 'flex-end',
                                 flexGrow: 1
                             }}>

                            <IconButton onClick={cancelFind}>
                                <CloseIcon/>
                            </IconButton>

                        </div>

                    </div>

                </MUIPaperToolbar>
            </InputEscapeListener>
        </Collapse>

    )

});
