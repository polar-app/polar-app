import * as React from 'react';

import deepEqual from "react-fast-compare";

/**
 * Like PureComponent but does a deep comparison.
 */
export abstract class FastComponent<P> extends React.Component<P> {

    public shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<any>, nextContext: any): boolean {

        if (! deepEqual(this.props, nextProps)) {
            return true;
        }

        // if (! deepEqual(this.state, nextState)) {
        //     return true;
        // }

        return false;

    }

}

