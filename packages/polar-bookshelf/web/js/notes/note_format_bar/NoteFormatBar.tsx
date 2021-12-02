import React from "react";
import {createStoreContext} from "../../react/store/StoreContext";
import {NoteFormatBarPopper} from "./NoteFormatBarPopper";
import {NoteFormatBarStore} from "./NoteFormatBarStore";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {debounce} from "throttle-debounce";

export const BLOCK_FORMAT_BAR_CONTAINER_ID = "NoteFormatBar";

const isChildOfFormatBar = (node: Node | null): boolean => {
    if (! node) {
        return false;
    }

    if (node instanceof HTMLElement && node.id === BLOCK_FORMAT_BAR_CONTAINER_ID) {
        return true;
    }

    return isChildOfFormatBar(node.parentNode);
};

export const useNoteFormatBar = () => {
    const blockFormatBarStore = useBlockFormatBarStore();

    React.useEffect(() => {
        const showFormatBar = debounce(200, (range: Range) => {
            const elem = DOMBlocks.findBlockParent(range.startContainer);
            const id = elem && DOMBlocks.getBlockID(elem);

            if (! id || ! elem) {
                return;
            }

            blockFormatBarStore.setState({
                id,
                elem,
            });
        });

        const hideFormatBar = () => blockFormatBarStore.clear();

        const handleSelectionChange = () => {
            const selection = window.getSelection();
            const range = selection && selection.getRangeAt(0);

            if (! selection || ! range || range.collapsed) {
                // If the new range is associated with a descendant of the format bar then just ignore it
                if (range && isChildOfFormatBar(range.startContainer)) {
                    return;
                }

                hideFormatBar();
                return;
            }


            showFormatBar(range);
        };

        const handleCloseWithKeyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                hideFormatBar();
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        window.addEventListener('keyup', handleCloseWithKeyboard);

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
            window.removeEventListener('keyup', handleCloseWithKeyboard);
        };
    }, [blockFormatBarStore]);
};

export const [BlockFormatBarStoreProvider, useBlockFormatBarStore] = createStoreContext(() => {
    return React.useMemo(() => new NoteFormatBarStore(), []);
});

export const BlockFormatBarProvider: React.FC = (props) => {
    const { children } = props;

    return (
        <BlockFormatBarStoreProvider>
            {children}
            <NoteFormatBarPopper />
        </BlockFormatBarStoreProvider>
    );
};
