import {animated, useSpring, useTransition} from "react-spring";
import * as React from "react";
import {useState} from "react";

export const TestSpring = () => {

//     const items = [
//         <div key={0}>first</div>
//     ];
//
//     const transitions = useTransition(items, item => item.key, {
//         from: {
//             opacity: 0,
//         },
//         enter: {
//             opacity: 1,
//         },
//         leave: {
//             opacity: 0,
//         }
//
//     });
//
//     return transitions.map(({ item, key, props }) => item && <animated.div key={key} style={props}>{item}️</animated.div>;
//
// };

    const [show, set] = useState(true);
    const transitions = useTransition(show, null, {
        from: {position: 'absolute', opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
    });

    return transitions.map(({item, key, props}) =>
        item && <animated.div key={key} style={props}>✌️</animated.div>
    );

};
