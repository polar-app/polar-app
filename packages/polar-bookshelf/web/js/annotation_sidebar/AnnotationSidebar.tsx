import React from "react";
import {useBlocksStore} from "../notes/store/BlocksStore";
import {NoteProviders} from "../notes/NoteScreen";
import {Block} from "../notes/Block";
import {BlocksTreeProvider} from "../notes/BlocksTree";
import {createStyles, makeStyles} from "@material-ui/core";
import {useDocViewerStore} from "../../../apps/doc/src/DocViewerStore";
import {AnnotationSidebar2, NoAnnotations} from "./AnnotationSidebar2";
import {useHighlightBlocks} from "../notes/HighlightBlocksHooks";
import {BlockItems} from "../notes/BlockItems";
import {useNotesIntegrationEnabled} from "../apps/repository/MigrationToBlockAnnotations";

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

const AnnotationSidebarRenderer: React.FC<IAnnotationSidebarRendererProps> = (props) => {
    const { docFingerprint } = props;
    const classes = useStyles();

    const blocksStore = useBlocksStore();

    const documentBlock = blocksStore.getBlock(blocksStore.indexByDocumentID[docFingerprint]);

    const annotationBlocks = useHighlightBlocks({ docID: docFingerprint });

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
                                <React.Fragment key={block.id}>
                                    <Block
                                        parent={documentBlock.id}
                                        id={block.id}
                                        alwaysExpanded
                                        dontRenderChildren
                                        noBullet
                                    />
                                    <BlockItems
                                        blockIDs={block.itemsAsArray}
                                        indent={false}
                                        parent={block.id} />
                                </React.Fragment>
                            ))
                        ) : (
                            <NoAnnotations />
                        )

                    }
                </BlocksTreeProvider>
            </NoteProviders>
        </div>
    );
};

export const AnnotationSidebar = () => {
    const { docMeta } = useDocViewerStore(['docMeta']);
    const notesIntegrationEnabled = useNotesIntegrationEnabled();

    if (! docMeta) {
        return null;
    }

    if (! notesIntegrationEnabled) {
        return <AnnotationSidebar2 />
    }

    return <AnnotationSidebarRenderer docFingerprint={docMeta.docInfo.fingerprint} />
};
