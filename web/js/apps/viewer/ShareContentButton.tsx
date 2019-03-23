/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {UncontrolledPopover} from 'reactstrap';
import {NULL_FUNCTION} from '../../util/Functions';
import {Visibility} from '../../datastore/Datastore';
import {ShareContentControl} from './ShareContentControl';

const log = Logger.create();

class Styles {

    public static dropdownChevron: React.CSSProperties = {

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

    };

    public static shareControlButtonParent: React.CSSProperties = {

        position: 'absolute',
        top: '90px',
        right: '50px',
        zIndex: 10,

        // marginLeft: '5px'

    };

}

export class ShareContentButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        const visibility = this.props.visibility || Visibility.PRIVATE;

        const buttonIconClass = this.props.visibility === Visibility.PRIVATE ? "fas fa-lock" : "fas fa-lock-open";

        return (

            <div style={Styles.shareControlButtonParent}
                 className="twitter-bootstrap-enabled twitter-bootstrap-content shadow">

                <Button color="primary"
                        id="share-control-button"
                        size="lg"
                        onClick={() => NULL_FUNCTION}
                        className="header-filter-clickable">

                    <i className={buttonIconClass} style={{marginRight: '5px'}}></i>

                    <span className="">
                        Share
                    </span>

                    <span className="text-white" style={Styles.dropdownChevron}></span>

                </Button>

                <UncontrolledPopover trigger="legacy"
                                     placement="bottom"
                                     target="share-control-button"
                                     className="twitter-bootstrap-enabled twitter-bootstrap-content"
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

    readonly visibility?: Visibility;

    readonly onChanged: (visibility: Visibility) => void;

    readonly onDone: () => void;

}

interface IState {
}
