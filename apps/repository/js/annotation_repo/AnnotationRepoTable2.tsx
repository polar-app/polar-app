import * as React from 'react';
import ReactTable from "react-table";
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {ExtendedReactTable, IReactTableState} from '../util/ExtendedReactTable';
import {AnnotationPreview} from './AnnotationPreview';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {ReactTablePaginationPropsFactory} from "../../../../web/js/ui/react-table/paginators/ReactTablePaginationProps";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import {EnhancedTableHead} from "../../../../web/spectron0/material-ui/doc_repo_table/EnhancedTableHead";
import TableBody from "@material-ui/core/TableBody";
import {DocRepoTableRow} from "../../../../web/spectron0/material-ui/doc_repo_table/DocRepoTableRow";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {AutoBlur} from "../../../../web/spectron0/material-ui/doc_repo_table/AutoBlur";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";


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

        this.setState({...this.state, selected, repoAnnotation});
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

        // const onNextPage = () => this.setState({
        //     ...this.state,
        //     pageSize: this.state.pageSize + 50
        // });

        // const reactTableProps = ReactTablePaginationPropsFactory.create(onNextPage);
        const pageData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return (

            <Paper square id="doc-repo-table">

                <div id="doc-table">

                    <TableContainer style={{flexGrow: 1}}>
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

                                        return (
                                            <TableRow
                                                hover
                                                // className={classes.tr}
                                                role="checkbox"
                                                // aria-checked={selected}
                                                tabIndex={-1}
                                                onClick={() => handleSelect(viewIndex, annotation)}
                                                // onDoubleClick={() => props.onOpen(row)}
                                                // selected={selected}
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

                                {/*{emptyRows > 0 && (*/}
                                {/*    <TableRow*/}
                                {/*        style={{height: (dense ? 33 : 53) * emptyRows}}>*/}
                                {/*        <TableCell colSpan={6}/>*/}
                                {/*    </TableRow>*/}
                                {/*)}*/}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>

            </Paper>

        );
    }

};
