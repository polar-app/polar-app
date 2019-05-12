import * as React from 'react';
import {DeepPureComponent} from '../../js/react/DeepPureComponent';
import {TNode} from './TreeNode';
import {TreeNode} from './TreeNode';

export class TreeNodeChildren extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        let idx = 0;
        const children = this.props.children || [];

        if (this.props.closed) {
            return <div/>;
        } else {
            return <div style={{
                            paddingLeft: '0.5em',
                            marginLeft: '0.5em',
                            borderLeft: '1px solid #c6c6c6'
                        }}>
                        {children.map(child => <TreeNode key={idx++} node={child}/>)}
            </div>;
        }

    }

}

interface IProps {
    readonly closed?: boolean;
    readonly children?: TNode[];
}


interface IState {
}


