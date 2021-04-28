import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly content: string;
    readonly onChange: (html: string) => void;
}

export const EditableContent = deepMemo(function EditableContent(props: IProps) {

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
                    {/*<CKEditor5 content={content} onChange={handleChange}/>*/}
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
