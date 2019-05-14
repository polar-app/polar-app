import * as React from 'react';
import {DeepPureComponent} from '../../js/react/DeepPureComponent';
import {TNode} from './TreeNode';
import {TreeNode} from './TreeNode';
import {TreeState} from './TreeNode';

class Styles {

    public static NODE_CHILDREN: React.CSSProperties = {
        display: 'block',
        paddingLeft: '10px',
        marginLeft: '5px',
        borderLeft: '1px solid #c6c6c6'
    };

}


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
            return <div style={Styles.NODE_CHILDREN}>
                        {children.map(child =>
                            <TreeNode key={idx++} node={child} treeState={this.props.treeState} />)}
            </div>;
        }

    }

}

interface IProps {
    readonly closed?: boolean;
    readonly children?: TNode[];
    readonly treeState: TreeState;

}


interface IState {
}


