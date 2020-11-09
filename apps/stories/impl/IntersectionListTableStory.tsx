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

interface IData {
    readonly id: string;
    readonly idx: number;
    readonly height: number;
}

function createData(count: number) {

    const before = performance.now();

    try {
        function toData(idx: number): IData {
            return {
                id: '' + idx,
                idx,
                height: Math.floor((Math.random() * 50) + 55)
            };
        }

        return Numbers.range(1, count).map(toData);

    } finally {
        const after = performance.now();
        console.log("createData duration: " + (after - before));
    }

}

const HiddenComponent = (props: HiddenComponentProps<IData>) => {
    const height = 15;

    return (
        <TableRow style={{
                      minHeight: `${height}px`,
                      height: `${height}px`,
                  }}>

        </TableRow>
    );

};

const VisibleComponent = (props: VisibleComponentProps<IData>) => {

    const height = 15;

    return (
        <TableRow style={{
                      minHeight: `${height}px`,
                      height: `${height}px`,
                  }}>

            <TableCell>{props.value.id}</TableCell>

        </TableRow>
    );

};

const BlockComponent = (props: BlockComponentProps<IData>) => {

    const height = Numbers.sum(...props.values.map(current => current.height));

    return (
        <TableBody ref={props.innerRef}
                   style={{
                       height,
                       minHeight: height,
                       overflow: 'auto',
                       flexGrow: 1
                   }}>
            {props.children}
        </TableBody>
    );

};

export const IntersectionListTableStory = () => {

    const data = React.useMemo(() => createData(500), []);

    const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

    return (
        <div ref={setRoot}
             style={{
                 display: 'flex',
                 flexGrow: 1,
                 flexDirection: 'column',
                 overflow: 'auto'
             }}>

            {root && (

                <Table>
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
            )}

        </div>
    )

}