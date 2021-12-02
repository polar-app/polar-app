import React from "react";
import {useBlocksStore} from "../notes/store/BlocksStore";
import {NoteProviders} from "../notes/NoteScreen";
import {BlocksTreeProvider} from "../notes/BlocksTree";
import {createStyles, makeStyles} from "@material-ui/core";
import {useDocViewerStore} from "../../../apps/doc/src/DocViewerStore";
import {AnnotationSidebar2, NoAnnotations} from "./AnnotationSidebar2";
import {useNotesIntegrationEnabled} from "../notes/NoteUtils";
import {useHighlightBlockIDs} from "../notes/HighlightBlocksHooks";
import {HighlightBlock} from "../notes/HighlightBlock";

type IAnnotationSidebarRendererProps = {
    docFingerprint: string;
};

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(1.5),
            flex: 1,
        },
        info: {
            margin: 10,
            textAlign: 'center',
        }
    }),
);

const AnnotationSidebarRenderer: React.FC<IAnnotationSidebarRendererProps> = React.memo((props) => {
    const { docFingerprint } = props;
    const classes = useStyles();

    const blocksStore = useBlocksStore();

    const documentBlock = blocksStore.getBlock(blocksStore.indexByDocumentID[docFingerprint]);

    const annotationBlockIDs = useHighlightBlockIDs({ docID: docFingerprint });

    if (! documentBlock) {
        return <h2 className={classes.info}>No document note was found for this document.</h2>
    }


    return (
        <div className={classes.root}>
            <NoteProviders>
                <BlocksTreeProvider root={documentBlock.id} autoExpandRoot>
                    {annotationBlockIDs.length
                        ? (
                            annotationBlockIDs.map(id => (
                                <HighlightBlock key={id} id={id} parent={documentBlock.id} />
                            ))
                        ) : (
                            <NoAnnotations />
                        )

                    }
                </BlocksTreeProvider>
            </NoteProviders>
        </div>
    );
});

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
