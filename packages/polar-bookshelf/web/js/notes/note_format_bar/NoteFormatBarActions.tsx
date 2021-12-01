import React from "react";
import {Box, TextField} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import {NoteFormatBarButton} from "./NoteFormatBarButton";

type IContentEditableTextStyle = 'bold'
                                 | 'italic'
                                 | 'subscript'
                                 | 'superscript'
                                 | 'strikeThrough'
                                 | 'removeFormat'
                                 | 'createLink';

export const useExecCommandExecutor = (command: IContentEditableTextStyle) => {
    return React.useCallback((value?: string) => {
        document.execCommand(command, false, value);
        // Update block
    }, [command]);
};

interface ILinkCreatorProps {
    onLink: (link: string) => void;
    onClose: () => void;
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
