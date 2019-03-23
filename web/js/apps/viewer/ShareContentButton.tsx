/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {Visibility} from '../../datastore/Datastore';
import {DatastoreCapabilities} from '../../datastore/Datastore';
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

        this.toggle = this.toggle.bind(this);
        this.onDone = this.onDone.bind(this);

        this.state = {
            open: false,
            visibility: this.props.visibility || Visibility.PRIVATE
        };

    }

    public render() {

        const buttonIconClass = this.state.visibility === Visibility.PRIVATE ? "fas fa-lock" : "fas fa-lock-open";

        return (

            <div style={Styles.shareControlButtonParent}
                 className="twitter-bootstrap-enabled twitter-bootstrap-content shadow">

                <Button color="primary"
                        id="share-control-button"
                        size="lg"
                        onClick={() => this.toggle(true)}
                        className="header-filter-clickable">

                    <i className={buttonIconClass} style={{marginRight: '5px'}}></i>

                    <span className="">
                        Share
                    </span>

                    <span className="text-white" style={Styles.dropdownChevron}></span>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="share-control-button"
                         className="twitter-bootstrap-enabled twitter-bootstrap-content"
                         style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow">

                        <ShareContentControl datastoreCapabilities={this.props.datastoreCapabilities}
                                             createShareLink={this.props.createShareLink}
                                             visibility={this.state.visibility}
                                             onChanged={visibility => this.onChanged(visibility)}
                                             onDone={() => this.onDone()}/>

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

    private onChanged(visibility: Visibility) {
        this.setState({...this.state, visibility});
        this.props.onChanged(visibility);
    }

    private onDone() {
        this.toggle(false);
        this.props.onDone();
    }

}

interface IProps {

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly createShareLink: () => Promise<string | undefined>;

    readonly visibility?: Visibility;

    readonly onChanged: (visibility: Visibility) => void;

    readonly onDone: () => void;

}

interface IState {
    readonly open: boolean;
    readonly visibility: Visibility;
}
