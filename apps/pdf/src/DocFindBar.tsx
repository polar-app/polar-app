import {MUISearchBox2} from "../../../web/spectron0/material-ui/MUISearchBox2";
import * as React from "react";
import {Logger} from "polar-shared/src/logger/Logger";
import isEqual from "react-fast-compare";
import {MUIPaperToolbar} from "../../../web/spectron0/material-ui/MUIPaperToolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {MUIButtonBar} from "../../../web/spectron0/material-ui/MUIButtonBar";
import CloseIcon from '@material-ui/icons/Close';
import Collapse from "@material-ui/core/Collapse";
import {IFindOpts} from "./Finders";
import {InputEscapeListener} from "../../../web/spectron0/material-ui/complete_listeners/InputEscapeListener";
import {useDocFindCallbacks, useDocFindStore} from "./DocFindStore";

const log = Logger.create();

type FindCallback = (opts: IFindOpts) => void;

function useFindCallback(): FindCallback {

    const {finder, findHandler} = useDocFindStore();
    const {setFindHandler, doFind} = useDocFindCallbacks();

    return (opts: IFindOpts) => {

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

const Matches = React.memo(() => {

    const {matches} = useDocFindStore();

    if (! matches) {
        return null;
    }

    return (
        <div>
            {matches.current} of {matches.total}
        </div>
    );

}, isEqual);

const MatchNav = React.memo(() => {

    const {matches} = useDocFindStore();
    const {findHandler} = useDocFindStore();

    return (
        <>
            <IconButton disabled={! matches || matches.current === 1}
                        onClick={() => findHandler!.prev()}>
                <ArrowUpwardIcon/>
            </IconButton>

            <IconButton disabled={! matches || matches.current === matches.total}
                        onClick={() => findHandler!.next()}>
                <ArrowDownwardIcon/>
            </IconButton>
        </>
    );

}, isEqual);

export const DocFindBar = React.memo(() => {

    const {active, opts} = useDocFindStore();
    const {reset, setMatches} = useDocFindCallbacks();

    const doFind = useFindCallback();

    const cancelFind = React.useCallback(() => {
        reset();
    }, []);

    const handleFind = React.useCallback((query: string) => {
        const newOpts = {...opts, query, onMatches: setMatches};
        doFind(newOpts);
    }, []);

    return (
        <Collapse in={active} timeout={50}>
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

                            <MatchNav/>

                            <Matches/>

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
