import * as React from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from './AnnotationRepoStore';
import {AnnotationRepoTableRow} from "./AnnotationRepoTableRow";
import {createContextMenu} from "../doc_repo/MUIContextMenu2";
import {AnnotationRepoTableMenu} from "./AnnotationRepoTableMenu";
import {
    BlockComponentProps,
    HiddenBlockComponentProps, IntersectionList,
    VisibleComponentProps
} from "../../../../web/js/intersection_list/IntersectionList";
import {RepoDocInfo} from "../RepoDocInfo";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Numbers} from "polar-shared/src/util/Numbers";
import {useFixedHeightAnnotationCalculator} from "./FixedHeightAnnotationPreview";
import TableRow from '@material-ui/core/TableRow';
import {DocRepoContextMenu} from "../doc_repo/DocRepoTable2";

interface AnnotationRepoTableRowProps {
    readonly viewIndex: number;
    readonly annotation: IDocAnnotation;
}

const VisibleComponent = deepMemo((props: VisibleComponentProps<IDocAnnotation>) => {

    const {selected} = useAnnotationRepoStore(['selected']);

    const annotation = props.value;
    const viewIndex = props.index;
    const rowSelected = selected.includes(annotation.id);

    return (
        <AnnotationRepoTableRow key={annotation.id}
                                viewIndex={viewIndex}
                                rowSelected={rowSelected}
                                annotation={annotation}/>
    );

});

const BlockComponent = React.memo((props: BlockComponentProps<IDocAnnotation>) => {

    const fixedHeightAnnotationCalculator = useFixedHeightAnnotationCalculator();

    const height = Numbers.sum(...props.values.map(current => fixedHeightAnnotationCalculator(current)));

    return (
        <TableBody ref={props.innerRef}
                   style={{
                       height,
                       minHeight: height,
                       flexGrow: 1
                   }}>
            {props.children}
        </TableBody>
    );

});

const HiddenBlockComponent = React.memo((props: HiddenBlockComponentProps<IDocAnnotation>) => {

    const fixedHeightAnnotationCalculator = useFixedHeightAnnotationCalculator();

    const height = Numbers.sum(...props.values.map(current => fixedHeightAnnotationCalculator(current)));

    return (
        <TableRow style={{
                      minHeight: `${height}px`,
                      height: `${height}px`,
                  }}>

        </TableRow>
    );

});

export const [AnnotationRepoTableContextMenu, useAnnotationRepoTableContextMenu]
    = createContextMenu(AnnotationRepoTableMenu);

export const AnnotationRepoTable2 = React.memo(() => {

    const {view} = useAnnotationRepoStore(['view']);

    const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

    return (

        <AnnotationRepoTableContextMenu>
            <Paper className="AnnotationRepoTable2"
                   square id="doc-repo-table"
                   elevation={0}
                   style={{
                       display: 'flex',
                       flexDirection: 'column',
                       minHeight: 0,
                       flexGrow: 1
                   }}>

                <div id="doc-table"
                     className="AnnotationRepoTable2.Body"
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         minHeight: 0,
                         flexGrow: 1,
                         overflow: 'auto'
                     }}>

                    <TableContainer ref={setRoot}
                                    style={{
                                        flexGrow: 1,
                                        overflow: 'auto'
                                    }}>

                        <Table stickyHeader
                               style={{
                                   minWidth: 0,
                                   maxWidth: '100%',
                                   tableLayout: 'fixed'
                               }}
                               aria-labelledby="tableTitle"
                               size={'medium'}
                               aria-label="enhanced table">

                            {root && (
                                <IntersectionList values={view}
                                                  root={root}
                                                  blockSize={10}
                                                  BlockComponent={BlockComponent}
                                                  HiddenBlockComponent={HiddenBlockComponent}
                                                  VisibleComponent={VisibleComponent}/>)}

                        </Table>
                    </TableContainer>

                </div>

            </Paper>
        </AnnotationRepoTableContextMenu>

    );
});
