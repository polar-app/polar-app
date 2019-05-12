import * as React from 'react';
import {DeepPureComponent} from '../../js/react/DeepPureComponent';
import {TreeNode} from './TreeNode';
import {TreeState} from './TreeNode';
import {TNode} from './TreeNode';

export class TreeView extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const treeState = new TreeState();

        return (

            <div>
                <TreeNode node={this.props.root} treeState={treeState}/>
            </div>

        );

    }

}

interface IProps {
    readonly root: TNode;
}

interface IState {

}
