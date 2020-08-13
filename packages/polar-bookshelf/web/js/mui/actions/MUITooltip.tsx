// import React, {
//     ForwardRefExoticComponent,
//     PropsWithoutRef,
//     RefAttributes
// } from 'react';
// import isEqual from 'react-fast-compare';
// import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
//
//
// interface RefChildProps extends RefAttributes<any> {
//
// }
//
// type RefChild = (props: RefChildProps) => React.ReactElement;
//
// interface IProps {
//     // readonly children: ForwardRefExoticComponent<PropsWithoutRef<any> & RefAttributes<any>>;
//
//     // readonly children: (props: any, ref: any) => React.ReactElement;
//
//     readonly children: RefChild;
//
// }
//
// export const MUITooltip = (props: IProps) => {
//
//     return <div/>;
//
// };
//
// export const Foo = React.forwardRef((props: any, ref) => {
//     return (
//         <div>Foo</div>
//     );
// });
//
// // const foo: RefChild = Foo;
//
// export const Test = () => {
//
//     return (
//         // <Foo ref={NULL_FUNCTION}/>
//
//         <MUITooltip>
//             <Foo/>
//         </MUITooltip>
//     );
// }
