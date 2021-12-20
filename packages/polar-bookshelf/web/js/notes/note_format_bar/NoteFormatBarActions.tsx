import React from "react";
import {Box, TextField} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import {NoteFormatBarButton} from "./NoteFormatBarButton";
import {useBlockContentUpdater} from "../BlockEditor";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {BlockContentCanonicalizer} from "../contenteditable/BlockContentCanonicalizer";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {ContentEditables} from "../ContentEditables";

type IContentEditableTextStyle = 'bold'
                                 | 'italic'
                                 | 'subscript'
                                 | 'superscript'
                                 | 'underline'
                                 | 'strikeThrough'
                                 | 'removeFormat'
                                 | 'createLink';

export const useExecCommandExecutor = (command: IContentEditableTextStyle) => {
    const blockContentUpdater = useBlockContentUpdater();

    return React.useCallback((value?: string) => {
        const range = ContentEditables.currentRange();

        if (! range) {
            return;
        }

        const elem = DOMBlocks.findBlockParent(range.startContainer);
        const id = elem ? DOMBlocks.getBlockID(elem) : undefined;

        if (! elem || ! id) {
            return;
        }

        document.execCommand(command, false, value);

        if (range.collapsed) {
            return;
        }

        // Update block
        const div = BlockContentCanonicalizer.canonicalizeElement(elem);
        const newContent = MarkdownContentConverter.toMarkdown(div.innerHTML);

        blockContentUpdater(id, newContent);
    }, [command, blockContentUpdater]);
};

interface ILinkCreatorProps {
    readonly onLink: (link: string) => void;
    readonly onClose: () => void;
}

export const LinkCreator: React.FC<ILinkCreatorProps> = (props) => {
    const { onLink, onClose } = props;
    const valueRef = React.useRef("");

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        valueRef.current = event.currentTarget.value;
    }, []);

    const handleCreateLink = React.useCallback(() => {
        const value = valueRef.current;
        if (! value.startsWith('http:') && ! value.startsWith('https:')) {
            return;
        }

        onLink(value);
    }, [onLink, valueRef]);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'Enter':
                handleCreateLink();
                break;
            case 'Escape':
                onClose();
                break;
        }
    }, [handleCreateLink, onClose]);


    return (
        <Box display="flex">
            <TextField required
                       placeholder="https://example.com"
                       autoFocus
                       style={{ flex: 1 }}
                       onKeyUp={handleKeyUp}
                       onChange={handleChange}/>

            <NoteFormatBarButton icon={<CheckIcon style={{ color: 'green' }} />}
                                 onClick={handleCreateLink} />
                
        </Box>
    );
};
