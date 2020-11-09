import * as React from 'react';
import {Numbers} from "polar-shared/src/util/Numbers";
import {IntersectionList, IntersectionListComponentProps} from "../../../web/js/intersection_list/IntersectionList";
import {IntersectionListItem} from "../../../web/js/intersection_list/IntersectionListItem";

interface IData {
    readonly id: string;
    readonly height: number;
}

function createData(count: number) {

    const before = performance.now();

    try {
        function toData(idx: number): IData {
            return {
                id: '' + idx,
                height: Math.floor((Math.random() * 50) + 55)
            };
        }

        return Numbers.range(1, count).map(toData);

    } finally {
        const after = performance.now();
        console.log("createData duration: " + (after - before));
    }

}

const ItemComponent = (props: IntersectionListComponentProps<IData>) => {

    return (
        <div ref={props.innerRef}
             style={{
                 minHeight: `${props.value.height}px`,
                 height: `${props.value.height}px`
             }}>

            {props.inView && (
                <div>
                    id: {props.value.id} <br/>
                    height: {props.value.height}
                </div>
            )}

        </div>
    );

}

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
                                  component={ItemComponent}/>
            )}

        </div>
    )

}