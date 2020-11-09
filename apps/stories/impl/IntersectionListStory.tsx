import * as React from 'react';
import {Numbers} from "polar-shared/src/util/Numbers";
import {
    BlockComponentProps,
    HiddenComponentProps,
    IntersectionList,
    VisibleComponentProps
} from "../../../web/js/intersection_list/IntersectionList";

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

const HiddenComponent = (props: HiddenComponentProps<IData>) => {

    return (
        <div style={{
                 minHeight: `${props.value.height}px`,
                 height: `${props.value.height}px`
             }}>

        </div>
    );

};

const VisibleComponent = (props: VisibleComponentProps<IData>) => {

    return (
        <div style={{
                 minHeight: `${props.value.height}px`,
                 height: `${props.value.height}px`
             }}>

            <div>
                id: {props.value.id} <br/>
                height: {props.value.height}
            </div>

        </div>
    );

};

const BlockComponent = (props: BlockComponentProps<IData>) => {

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

};

// TODO:
//
// - implement the block strategy
//
//    - when the block is visible, render each row, when it's not, render a gap replacement.
//
//    - make sure the components are cacheable via deepMemo
//
//    - I can use multiple tbody elements BUT I haven't tested this before AND I would need to specify the width too
//      and this might not work on Safari or Firefox
//
//        - OH!!! BUT ... I could use a BlockComponent then render each item in them and set the height that way
//
//        - there would be three components
//
//        - HiddenComponent - rendered when something is hidden. height must be right
//        - VisibleComponent - rendered when something is visible. height must be right.
//        - BlockComponent - renders a block with a parent which detects visibility and has the useInView hook to
//                           keep performance reasonable.
//
// - FIXME the main problem with block components is that if the items they hold are shifted around then it will
//   trigger a full block re-render... but if the *inner* components do not re-render I think that's probably fine.
//
//          - the memoification won't work if we shift everything up one...
//
//          - but to be fair, only the empty items would be rendered below that...

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
                                  blockComponent={BlockComponent}
                                  hiddenComponent={HiddenComponent}
                                  visibleComponent={VisibleComponent}/>
            )}

        </div>
    )

}