import * as React from 'react';
import {LazyProps} from './LazyComponents';
import {LazyState} from './LazyComponents';
import {lazyObjEquals} from './LazyComponents';

/**
 * Component that has a smart implementation of shouldComponentUpdate that
 * supports primitiveTypes
 */
export abstract class LazyComponent<L extends LazyProps, S extends LazyState> extends React.Component<L, S> {

    protected constructor(props: L, context: any) {
        super(props, context);
    }

    public shouldComponentUpdate(nextProps: Readonly<LazyProps>, nextState: Readonly<LazyState>, nextContext: any): boolean {
        return lazyObjEquals(this.props, nextProps) && lazyObjEquals(this.state, nextState);
    }

}

