import * as React from 'react';
import {Numbers} from "polar-shared/src/util/Numbers";
import {
    BlockComponentProps, HiddenBlockComponentProps,
    IntersectionList,
    VisibleComponentProps
} from "../../../web/js/intersection_list/IntersectionList";
import useTheme from '@material-ui/core/styles/useTheme';

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

const VisibleComponent = React.memo(function VisibleComponent(props: VisibleComponentProps<IData>) {

    const theme = useTheme();

    const background = props.value.idx % 2 === 0 ? theme.palette.background.paper: theme.palette.background.default;

    return (
        <div style={{
                 minHeight: `${props.value.height}px`,
                 height: `${props.value.height}px`,
                 background
             }}>

            <div>
                id: {props.value.id} <br/>
                height: {props.value.height}
            </div>

        </div>
    );

});

const BlockComponent = React.memo(function BlockComponent(props: BlockComponentProps<IData>) {

    const height = Numbers.sum(...props.values.map(current => current.height));

    return (
        <div ref={props.innerRef}
             style={{
                 height,
                 minHeight: height,
                 overflow: 'auto',
                 flexGrow: 1
             }}>
            {props.children}
        </div>
    );

});

const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<IData>) {

    const height = Numbers.sum(...props.values.map(current => current.height));

    return (
        <div style={{
                 minHeight: `${height}px`,
                 height: `${height}px`
             }}>

        </div>
    );

});

export const IntersectionListStory = () => {

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
                <IntersectionList values={data}
                                  root={root}
                                  BlockComponent={BlockComponent}
                                  HiddenBlockComponent={HiddenBlockComponent}
                                  VisibleComponent={VisibleComponent}/>
            )}

        </div>
    )

}
