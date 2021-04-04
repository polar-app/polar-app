import * as React from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import {
    IAnnotationRepoStore,
    useAnnotationRepoStore, useAnnotationRepoStoreReducer
} from './AnnotationRepoStore';
import {AnnotationRepoTableRow} from "./AnnotationRepoTableRow";
import {createContextMenu} from "../doc_repo/MUIContextMenu2";
import {AnnotationRepoTableMenu} from "./AnnotationRepoTableMenu";
import {
    BlockComponentProps,
    HiddenBlockComponentProps, IntersectionList,
    VisibleComponentProps
} from "../../../../web/js/intersection_list/IntersectionList";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Numbers} from "polar-shared/src/util/Numbers";
import {useFixedHeightAnnotationCalculator} from "./FixedHeightAnnotationPreview";
import TableRow from '@material-ui/core/TableRow';
import {IDStr} from "polar-shared/src/util/Strings";


function useAnnotationSelected(id: IDStr): boolean {

    function reducer(store: IAnnotationRepoStore) {
        return store.selected.includes(id);
    }

    return useAnnotationRepoStoreReducer(reducer, {filter: (prev, next) => prev !== next});

}

const VisibleComponent = deepMemo(function VisibleComponent(props: VisibleComponentProps<IDocAnnotation>) {

    const selected = useAnnotationSelected(props.value.id);

    const annotation = props.value;
    const viewIndex = props.index;

    return (
        <AnnotationRepoTableRow key={annotation.id}
                                viewIndex={viewIndex}
                                rowSelected={selected}
                                annotation={annotation}/>
    );

});

const BlockComponent = React.memo(function BlockComponent(props: BlockComponentProps<IDocAnnotation>) {

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

const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<IDocAnnotation>) {

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
    = createContextMenu(AnnotationRepoTableMenu, {name: 'annotation-repo2'});

export const AnnotationRepoTable2 = React.memo(() => {

    const {view} = useAnnotationRepoStore(['view']);

    const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

    return (

        <>
            <div className="AnnotationRepoTable2"
                 id="doc-repo-table"
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

                            <AnnotationRepoTableContextMenu>
                                {root && (
                                    <IntersectionList values={view}
                                                      root={root}
                                                      blockSize={10}
                                                      BlockComponent={BlockComponent}
                                                      HiddenBlockComponent={HiddenBlockComponent}
                                                      VisibleComponent={VisibleComponent}/>)}
                            </AnnotationRepoTableContextMenu>
                        </Table>
                    </TableContainer>

                </div>

            </div>
        </>

    );
});
