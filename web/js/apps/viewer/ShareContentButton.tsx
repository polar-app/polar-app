/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import {UserInfo} from '../../../../web/js/apps/repository/auth_handler/AuthHandler';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {UncontrolledPopover} from 'reactstrap';
import {IStyleMap} from '../../react/IStyleMap';
import {NULL_FUNCTION} from '../../util/Functions';
import {AppRuntime} from '../../AppRuntime';
import {Visibility} from '../../datastore/Datastore';
import {ShareContentControl} from './ShareContentControl';

const log = Logger.create();

const Styles: IStyleMap = {

    dropdownChevron: {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    }

};

export class ShareContentButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);


    }

    public render() {

        return (

            <div>

                <Button color="primary"
                        id="share-control-button"
                        size="lg"
                        onClick={() => NULL_FUNCTION}
                        className="header-filter-clickable p-1 pl-2 pr-2 border">

                    <i className="fas fa-lock-open" style={{marginRight: '5px'}}></i>
                    <span>
                        Share
                    </span>

                    <div className="text-white" style={Styles.dropdownChevron}></div>

                </Button>

                <UncontrolledPopover trigger="legacy"
                                     placement="bottom"
                                     target="account-control-button"
                                     style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow">

                        <ShareContentControl onChanged={visibility => this.props.onChanged(visibility)}
                                             onDone={() => this.props.onDone()}/>

                    </PopoverBody>

                </UncontrolledPopover>

            </div>

        );

    }

}

interface IProps {

    readonly visibility: Visibility;

    readonly onChanged: (visibility: Visibility) => void;

    readonly onDone: () => void;

}

interface IState {
}
