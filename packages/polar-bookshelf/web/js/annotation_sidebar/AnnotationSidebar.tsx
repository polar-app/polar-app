import React from "react";
import {observer} from "mobx-react-lite";
import {useBlocksStore} from "../notes/store/BlocksStore";
import {NoteProviders} from "../notes/NoteScreen";
import {Block} from "../notes/Block";
import {BlocksTreeProvider} from "../notes/BlocksTree";
import {createStyles, makeStyles} from "@material-ui/core";
import {useDocViewerStore} from "../../../apps/doc/src/DocViewerStore";
import {AnnotationSidebar2} from "./AnnotationSidebar2";
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from "../../../apps/doc/src/DocViewer";

type IAnnotationSidebarRendererProps = {
    docFingerprint: string;
};

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            padding: 16,
            flex: 1,
        },
        info: {
            margin: 10,
            textAlign: 'center',
        }
    }),
);

const AnnotationSidebarRenderer: React.FC<IAnnotationSidebarRendererProps> = observer((props) => {
    const { docFingerprint } = props;
    const classes = useStyles();

    const blocksStore = useBlocksStore();

    const documentBlock = blocksStore.getBlock(blocksStore.indexByDocumentID[docFingerprint]);
    const annotationBlocks = React.useMemo(() => {
        if (! documentBlock) {
            return [];
        }
        return blocksStore.idsToBlocks(documentBlock.itemsAsArray)
    }, [documentBlock, blocksStore]);

    if (! documentBlock) {
        return <h2 className={classes.info}>No document note was found for this document.</h2>
    }


    return (
        <div className={classes.root}>
            <NoteProviders>
                <BlocksTreeProvider root={documentBlock.id} autoExpandRoot>
                    {annotationBlocks.length
                        ? (
                            annotationBlocks.map(block => (
                                <Block
                                    key={block.id}
                                    parent={documentBlock.id}
                                    id={block.id}
                                    noExpand
                                    noBullet
                                />
                            ))
                        ) : (
                            <h2 className={classes.info}>No annotations found. why don't you create one!</h2>
                        )

                    }
                </BlocksTreeProvider>
            </NoteProviders>
        </div>
    );
});

export const AnnotationSidebar = () => {
    const { docMeta } = useDocViewerStore(['docMeta']);

    if (! docMeta) {
        return null;
    }

    if (! NEW_NOTES_ANNOTATION_BAR_ENABLED) {
        return <AnnotationSidebar2 />
    }

    return <AnnotationSidebarRenderer docFingerprint={docMeta.docInfo.fingerprint} />
};
