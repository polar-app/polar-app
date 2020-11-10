import * as React from 'react';
import {HiddenComponent, ListValue} from "./IntersectionList";
import {Numbers} from "polar-shared/src/util/Numbers";
import {typedMemo} from "../hooks/ReactHooks";

interface IProps<V extends ListValue> {

    readonly indexBase: number;
    readonly count: number;
    readonly hiddenComponent: HiddenComponent<V>;

}
//
// export const HiddenComponentBlock = typedMemo(function<V extends ListValue>(props: IProps<V>) {
//
//     const HiddenComponent = props.hiddenComponent;
//
//     const {indexBase} = props;
//
//     return Numbers.range(1, props.count)
//         .map((current, idx) => (
//             <HiddenComponent key={current} index={indexBase + idx} value={props.value}/>
//         ));
// });