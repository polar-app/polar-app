import React from "react";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useHistory, useLocation} from "react-router-dom";
import {BlockTargetStr} from "../NoteLinkLoader";
import {NoteStackSearchParams} from "./NoteStack";

interface INoteStack {
    push: (target: BlockTargetStr) => void;
}

export const NoteStackContext = React.createContext<INoteStack | null>(null);

interface INoteStackProviderProps {
    target: BlockIDStr;
}

export const NoteStackProvider: React.FC<INoteStackProviderProps> = React.memo((props) => {
    const { target: source, children } = props;
    const location = useLocation();
    const history = useHistory();

    const push = React.useCallback((target: BlockTargetStr) => {

        const newSearch = NoteStackSearchParams.replace(location.search, source, target);
        history.push(`${location.pathname}?${newSearch}`);

    }, [source, location, history]);

    const value: INoteStack = React.useMemo(() => ({ push }), [push]);

    return <NoteStackContext.Provider value={value} children={children} />;
});

export const useNoteStack = (): INoteStack | null => {
    return React.useContext(NoteStackContext);
};

