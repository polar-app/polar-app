import {MUISearchBox2} from "../../../web/js/mui/MUISearchBox2";
import * as React from "react";
import isEqual from "react-fast-compare";
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {MUIButtonBar} from "../../../web/js/mui/MUIButtonBar";
import CloseIcon from '@material-ui/icons/Close';
import {IFindOpts} from "./Finders";
import {InputEscapeListener} from "../../../web/js/mui/complete_listeners/InputEscapeListener";
import {useDocFindCallbacks, useDocFindStore} from "./DocFindStore";
import Collapse from "@material-ui/core/Collapse/Collapse";

type FindCallback = (opts: IFindOpts) => void;

function useFindCallback(): FindCallback {

    const {findHandler} = useDocFindStore(['findHandler']);
    const {doFind, setOpts, reset} = useDocFindCallbacks();

    return (opts: IFindOpts) => {

        const {query} = opts;

        setOpts(opts);

        if (query.trim() === '') {
            reset(true);
            return;
        }

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

    const {matches} = useDocFindStore(['matches']);

    if (! matches) {
        return null;
    }

    return (
        <div style={{userSelect: 'none'}}>
            {matches.current} of {matches.total}
        </div>
    );

}, isEqual);

const MatchNav = React.memo(() => {

    const {matches} = useDocFindStore(['matches']);
    const {findHandler} = useDocFindStore(['findHandler']);

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

    const {active, opts} = useDocFindStore(['active', 'opts']);
    const {reset, setMatches} = useDocFindCallbacks();

    const doFind = useFindCallback();

    const cancelFind = React.useCallback(() => {
        reset();
    }, [reset]);

    const handleFind = React.useCallback((query: string) => {

        const newOpts = {...opts, query, onMatches: setMatches};
        doFind(newOpts);

    }, [doFind, setMatches, opts]);

    return (
        <Collapse in={active} timeout={50}>
            {active &&
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
                                               autoComplete="off"
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
                </InputEscapeListener>}
        </Collapse>

    )

});
