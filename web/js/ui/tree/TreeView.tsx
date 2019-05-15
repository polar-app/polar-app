import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNode} from './TreeNode';
import {TreeState} from './TreeNode';
import {TNode} from './TreeNode';

export class TreeView<V> extends DeepPureComponent<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);

    }

    public render() {

        const treeState = new TreeState(this.props.onSelected);

        return (

            <div>
                <TreeNode node={this.props.root} treeState={treeState}/>
            </div>

        );

    }

}

interface IProps<V> {
    readonly root: TNode<V>;
    readonly onSelected: (...nodes: ReadonlyArray<V>) => void;
}

interface IState {

}
