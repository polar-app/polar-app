import * as React from 'react';
import {Numbers} from "polar-shared/src/util/Numbers";
import {
    BlockComponentProps,
    HiddenComponentProps,
    IntersectionList,
    VisibleComponentProps
} from "../../../web/js/intersection_list/IntersectionList";
import useTheme from '@material-ui/core/styles/useTheme';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

interface IData {
    readonly id: string;
    readonly idx: number;
    readonly height: number;
}

const HEIGHT = 58;

function createData(count: number) {

    const before = performance.now();

    try {
        function toData(idx: number): IData {
            return {
                id: '' + idx,
                idx,
                height: HEIGHT
            };
        }

        return Numbers.range(1, count).map(toData);

    } finally {
        const after = performance.now();
        console.log("createData duration: " + (after - before));
    }

}

const HiddenComponent = React.memo((props: HiddenComponentProps<IData>) => {

    const height = HEIGHT;

    return (
        <TableRow style={{
                      minHeight: `${height}px`,
                      height: `${height}px`,
                  }}>

        </TableRow>
    );

});

const VisibleComponent = React.memo((props: VisibleComponentProps<IData>) => {

    const height = HEIGHT;

    return (
        <TableRow style={{
                      minHeight: `${height}px`,
                      height: `${height}px`,
                  }}>

            <TableCell>{props.value.id}</TableCell>

        </TableRow>
    );

});

const BlockComponent = React.memo((props: BlockComponentProps<IData>) => {

    const height = Numbers.sum(...props.values.map(current => current.height));

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

export const IntersectionListTableStory = () => {

    const data = React.useMemo(() => createData(500), []);

    const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

    return (
        <div ref={setRoot}
             style={{
                 display: 'flex',
                 flexGrow: 1,
                 flexDirection: 'column',
                 overflow: 'auto',
                 minHeight: 0
             }}>

            {root && (

                <TableContainer>
                    <Table stickyHeader style={{overflow: 'auto'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>id</TableCell>
                            </TableRow>
                        </TableHead>
                        <IntersectionList values={data}
                                          root={root}
                                          blockComponent={BlockComponent}
                                          hiddenComponent={HiddenComponent}
                                          visibleComponent={VisibleComponent}/>
                    </Table>
                </TableContainer>
            )}

        </div>
    )

}