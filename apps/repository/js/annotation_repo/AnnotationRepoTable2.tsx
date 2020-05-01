import * as React from 'react';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {ExtendedReactTable} from '../util/ExtendedReactTable';
import {AnnotationPreview} from './AnnotationPreview';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TablePagination from "@material-ui/core/TablePagination";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";

interface ToolbarProps {
    readonly nrRows: number;
    readonly page: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPage: number) => void;
}

const Toolbar = React.memo((props: ToolbarProps) => {

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);

    };

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            size="small"
            count={props.nrRows}
            rowsPerPage={props.rowsPerPage}
            style={{
                padding: 0,
                overflow: "hidden",
                minHeight: '4.5em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}
            // onDoubleClick={event => {
            //     event.stopPropagation();
            //     event.preventDefault();
            // }}
            page={props.page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    )

}, isEqual);


interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly onSelected: (repoAnnotation: IDocAnnotation) => void;

    readonly data: ReadonlyArray<IDocAnnotation>;

}

interface IState {

    readonly selected?: number;

    readonly page: number;

    readonly rowsPerPage: number;

    /**
     * The currently selected repo annotation.
     */
    readonly repoAnnotation?: IDocAnnotation;


}

export class AnnotationRepoTable2 extends ExtendedReactTable<IProps, IState> {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;

        this.state = {
            page: 0,
            rowsPerPage: 25
        };

    }

    public onSelected(selected: number,
                      repoAnnotation: IDocAnnotation) {

        this.setState({
            ...this.state,
            selected,
            repoAnnotation
        });
        this.props.onSelected(repoAnnotation);

    }

    public render() {

        const {page, rowsPerPage} = this.state;

        const data = arrayStream(this.props.data)
            .sort((a, b) => {

                const toTimestamp = (val: IDocAnnotation): string => {
                    return val.lastUpdated ?? val.created ?? '';
                };

                return toTimestamp(b).localeCompare(toTimestamp(a));
            })
            .collect();

        const handleSelect = (viewIndex: number, annotation: IDocAnnotation) => {
            this.onSelected(viewIndex, annotation);
        };

        const handleChangePage = (page: number) => {
            this.setState({
                ...this.state,
                page,
                selected: undefined
            })
        };

        const handleChangeRowsPerPage = (rowsPerPage: number) => {
            this.setState({
                ...this.state,
                rowsPerPage,
                page: 0,
                selected: undefined
            });
        };

        // const onNextPage = () => this.setState({
        //     ...this.state,
        //     pageSize: this.state.pageSize + 50
        // });

        // const reactTableProps = ReactTablePaginationPropsFactory.create(onNextPage);
        const pageData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (

            <Paper square id="doc-repo-table"
                   elevation={0}
                   style={{
                       display: 'flex',
                       flexDirection: 'column',
                       minHeight: 0
                   }}>

                <div id="doc-table"
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         minHeight: 0
                     }}>

                    <Toolbar
                        nrRows={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />

                    <Divider orientation="horizontal"/>

                    <TableContainer style={{
                                        flexGrow: 1,
                                        overflow: 'auto'
                                    }}>
                        <Table
                            stickyHeader
                            style={{
                                minWidth: 0,
                                maxWidth: '100%',
                                tableLayout: 'fixed'
                            }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                            aria-label="enhanced table">


                            <TableBody>
                                {pageData.map((annotation, index) => {

                                        const viewIndex = (page * rowsPerPage) + index;
                                        const id = 'annotation-title' + viewIndex;
                                        const rowSelected = this.state.selected === viewIndex;

                                        return (
                                            <TableRow
                                                key={viewIndex}
                                                hover
                                                // className={classes.tr}
                                                role="checkbox"
                                                tabIndex={-1}
                                                onClick={() => handleSelect(viewIndex, annotation)}
                                                // onDoubleClick={() => props.onOpen(row)}
                                                selected={rowSelected}
                                                >

                                                <TableCell padding="checkbox">
                                                    <Box p={1}>
                                                        <AnnotationPreview id={id}
                                                                           text={annotation.text}
                                                                           img={annotation.img}
                                                                           color={annotation.color}
                                                                           lastUpdated={annotation.lastUpdated}
                                                                           created={annotation.created}/>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );

                                    })}

                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>

            </Paper>

        );
    }

};
