import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNode} from './TreeNode';
import {TreeState} from './TreeNode';
import {TNode} from './TreeNode';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';

export class TreeView<V> extends DeepPureComponent<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);

    }

    public render() {

        const treeState = new TreeState(this.props.onSelected);

        return (

            <div>

                {/*<InputGroup className="m-1">*/}

                {/*    <InputGroupAddon addonType="append">*/}
                {/*        X*/}
                {/*    </InputGroupAddon>*/}

                {/*    <Input placeholder="Filter" />*/}

                {/*</InputGroup>*/}

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
