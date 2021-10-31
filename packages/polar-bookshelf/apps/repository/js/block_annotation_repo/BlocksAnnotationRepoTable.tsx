import {Box, createStyles, makeStyles, Table, TableBody, TableContainer, TableRow} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import {Numbers} from "polar-shared/src/util/Numbers";
import React from "react";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {BlockComponentProps, HiddenBlockComponentProps, IntersectionList, ListValue, VisibleComponentProps} from "../../../../web/js/intersection_list/IntersectionList";
import {createContextMenu} from "../doc_repo/MUIContextMenu2";
import {BlocksAnnotationRepoTableMenu} from "./BlocksAnnotationRepoContextMenu";
import {useAnnotationRepoViewBlockIDs, useBlocksAnnotationRepoStore} from "./BlocksAnnotationRepoStore";
import {BlocksAnnotationRepoTableRow, useFixedHeightBlockAnnotationCalculator} from "./BlocksAnnotationRepoTableRow";


const VisibleComponent = (props: VisibleComponentProps<ListValue>) => {
    const { index, value } = props;

    return (
        <BlocksAnnotationRepoTableRow key={value.id}
                                      viewIndex={index}
                                      rowSelected={true}
                                      blockID={value.id} />
    );

};

const BlockComponent = deepMemo(function BlockComponent(props: BlockComponentProps<ListValue>) {

    const fixedHeightAnnotationCalculator = useFixedHeightBlockAnnotationCalculator();
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

    const height = React.useMemo(() => {
        const blocks = blocksAnnotationRepoStore.idsToRepoAnnotationBlocks(props.values.map(({ id }) => id));
        return Numbers.sum(...blocks.map(current => fixedHeightAnnotationCalculator(current)));
    }, [props.values, blocksAnnotationRepoStore, fixedHeightAnnotationCalculator]);

    return (
        <TableBody ref={props.innerRef}
                   style={{ height, minHeight: height, flexGrow: 1 }}
                   children={props.children} />
    );

});

const HiddenBlockComponent = deepMemo((props: HiddenBlockComponentProps<ListValue>) => {

    const fixedHeightAnnotationCalculator = useFixedHeightBlockAnnotationCalculator();
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

    const height = React.useMemo(() => {
        const blocks = blocksAnnotationRepoStore.idsToRepoAnnotationBlocks(props.values.map(({ id }) => id));
        return Numbers.sum(...blocks.map(current => fixedHeightAnnotationCalculator(current)));
    }, [props.values, blocksAnnotationRepoStore, fixedHeightAnnotationCalculator]);


    return <TableRow style={{ minHeight: `${height}px`, height: `${height}px` }} />;

});

export const [BlocksAnnotationRepoTableContextMenu, useBlocksAnnotationRepoTableContextMenu]
    = createContextMenu(BlocksAnnotationRepoTableMenu, {name: 'annotation-repo2'});

const useBlocksAnnotationRepoTableStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            minHeight: 0,
        },
        table: {
            overflowX: 'hidden',
        }
    }),
);

export const BlocksAnnotationRepoTable = observer(function BlocksAnnotationRepoTable() {

    const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
    const classes = useBlocksAnnotationRepoTableStyles();

    const highlightBlockIDs = useAnnotationRepoViewBlockIDs();

    return (
        <Box display="flex" flexDirection="column" className={classes.root}>

            <TableContainer className={classes.table} ref={setRoot}>

                {root && (
                    <Table stickyHeader
                           aria-labelledby="tableTitle"
                           size="medium"
                           aria-label="enhanced table">

                            <IntersectionList values={highlightBlockIDs}
                                              root={root}
                                              blockSize={10}
                                              BlockComponent={BlockComponent}
                                              HiddenBlockComponent={HiddenBlockComponent}
                                              VisibleComponent={VisibleComponent} />
                    </Table>
                )}
            </TableContainer>

        </Box>
    );
});
