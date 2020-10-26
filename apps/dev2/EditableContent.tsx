import * as React from 'react';
import {deepMemo} from "../../web/js/react/ReactUtils";
import {Editor} from "./Editor";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface IProps {
    readonly content: string;
    readonly onChange: (html: string) => void;
}

export const EditableContent = deepMemo((props: IProps) => {

    const [editing, setEditing] = React.useState(false);
    const [content, setContent] = React.useState(props.content)

    const handleChange = React.useCallback((content: string) => {
        setContent(content);
        props.onChange(content);
    }, [props]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        console.log("FIXME: handling key down");
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            console.log("FIXME: finished");
            setEditing(false);
        }
    }, [])

    if (editing) {
        return (
            <ClickAwayListener onClickAway={() => setEditing((false))}>
                <div onKeyDown={handleKeyDown}>
                    <Editor html={content} onChange={handleChange}/>
                </div>
            </ClickAwayListener>
        );
    } else {
        return (
                <p onClick={() => setEditing(true)}
                   dangerouslySetInnerHTML={{__html: content}}/>
        );
    }

});