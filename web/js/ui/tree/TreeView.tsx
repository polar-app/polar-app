import * as React from 'react';
import {DeepPureComponent} from '../../react/DeepPureComponent';
import {TreeNode} from './TreeNode';
import {TreeState} from './TreeNode';
import {TNode} from './TreeNode';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';

class Styles {

    public static PARENT: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };

    public static HEADER: React.CSSProperties = {
    };

    public static BODY: React.CSSProperties = {
        flexGrow: 1
    };

}

export class TreeView<V> extends DeepPureComponent<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);

    }

    public render() {

        const treeState = new TreeState(this.props.onSelected);

        return (

            <div style={Styles.PARENT}>

                {/*<InputGroup className="m-1"*/}
                {/*            style={Styles.HEADER}>*/}

                {/*    <InputGroupAddon addonType="append">*/}
                {/*        X*/}
                {/*    </InputGroupAddon>*/}

                <div style={{display: 'flex'}}>

                    <Input className="p-1" placeholder="Filter folders by name..." />

                    <Button className="ml-1" color="light" title="Create new folder">

                        <i className="hover-button fas fa-plus"></i>

                    </Button>

                </div>

                {/*</InputGroup>*/}

                <div style={Styles.HEADER}>
                    <TreeNode node={this.props.root} treeState={treeState}/>
                </div>

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
