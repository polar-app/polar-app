import {Box, Typography} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import React from "react";
import {BlockItems} from "../../../../web/js/notes/BlockItems";
import {Block} from "../../../../web/js/notes/Block";
import {BlocksTreeProvider} from "../../../../web/js/notes/BlocksTree";
import {NoteProviders} from "../../../../web/js/notes/NoteScreen";
import {useBlocksAnnotationRepoStore} from "./BlocksAnnotationRepoStore";

export const BlocksAnnotationInlineViewer = observer(function AnnotationInlineViewer() {

    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

    const activeBlock = blocksAnnotationRepoStore.activeBlock;

    if (! activeBlock) {
        return (
            <Box p={1}>
                <Typography align="center"
                            variant="h5"
                            color="textPrimary">
                    No annotation selected.
                </Typography>

            </Box>
        );
    }

    return (
        <Box m={1} flex="1">
            <NoteProviders>
                <BlocksTreeProvider root={activeBlock.id} autoExpandRoot>
                    <Box display="flex" flexDirection="column">
                        <Block
                            id={activeBlock.id}
                            parent={activeBlock.parent}
                            alwaysExpanded
                            noBullet
                            dontRenderChildren
                        />
                        <BlockItems
                            blockIDs={activeBlock.itemsAsArray}
                            indent={false}
                            parent={activeBlock.id} />
                    </Box>
                </BlocksTreeProvider>
            </NoteProviders>
        </Box>
    );

});
