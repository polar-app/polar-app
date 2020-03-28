/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {EventListener} from '../../reactor/EventListener';
import {Logger} from 'polar-shared/src/logger/Logger';
import Button from 'reactstrap/lib/Button';
import {Platforms} from "polar-shared/src/util/Platforms";
import {Devices} from "polar-shared/src/util/Devices";

const log = Logger.create();

class Styles {

    public static notice: React.CSSProperties = {

        position: 'fixed',
        width: '450px',
        bottom: '10px',
        right: '15px',
        zIndex: 999999,
        backgroundColor: '#ced4da',
        whiteSpace: 'initial'

    };

    public static intro: React.CSSProperties = {

        fontWeight: 'bold',
        fontSize: '22px',
        margin: '5px 0px 10px 0px'

    };

}

export class GDPRNotice extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.onAccept = this.onAccept.bind(this);

        this.state = {
            disabled: window.localStorage.getItem('gdpr-accepted') === 'true'
        };

    }

    public render() {

        const display = this.state.disabled ? 'none' : 'block';

        if (! Devices.isDesktop()) {
            // doesn't display properly on mobile.
            return null;
        }

        return (

            <div id="gdpr-notice" style={{display}}>

                <div className="p-3 m-2 rounded" style={Styles.notice}>

                    <div className="pt-1 pb-1">

                        <div style={Styles.intro}>
                            We use cookies to track improve Polar.
                        </div>

                        <p>
                            We use cookies to help improve the quality of Polar.
                        </p>

                        <p>
                            We <b>do not</b> send personally identifiable information at any point.
                        </p>

                        <p>
                            We <b>do not</b> sell your private data to 3rd parties.
                        </p>

                    </div>

                    <div className="text-right">

                        <Button color="primary" onClick={() => this.onAccept()}>Accept</Button>

                    </div>

                </div>

            </div>

        );
    }

    private onAccept() {

        window.localStorage.setItem('gdpr-accepted', 'true');

        this.setState({
            disabled: true
        });

    }

}

export interface IState {
    readonly disabled: boolean;
}
