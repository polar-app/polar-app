/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {EventListener} from '../../reactor/EventListener';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

class Styles {

    public static notice: React.CSSProperties = {

        position: 'fixed',
        width: '450px',
        bottom: '0',
        right: '0',
        zIndex: 9999,
        backgroundColor: '#ced4da',

    };

    public static intro: React.CSSProperties = {

        fontWeight: 'bold',
        fontSize: '22px',
        margin: '5px 0px 10px 0px'

    };

    public static subintro: React.CSSProperties = {

        fontWeight: 'bold',
        fontSize: '18px',
        margin: '5px 0px 10px 0px'

    };

}

/**
 * The sync bar is a bar in the bottom right of the page that displays sync
 * progress and can bring up a popup displaying what it is currently doing.
 */
export class GDPRNotice extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {

        return (

            <div className="p-3 m-2 rounded" style={Styles.notice}>

                <div className="pt-1 pb-1">

                    <div style={Styles.intro}>
                        We uses cookes to track your usage.
                    </div>

                    <p>
                        We use cookies to track your usage of Polar and to
                        determine which features are used and how often and
                        to improve the quality of product over time.
                    </p>

                    <p>
                        Additionally, we track errors and send them along with
                        exception reports to fix errors that happen in
                        production.  This helps us track down bugs that
                        happen in the wild and to prioritize which issues
                        to fix based on how often they occur.
                    </p>

                    <p>
                        This data is sent to 3rd parties which provide the
                        infrastructure necessary to provide the analytics
                        services.
                    </p>

                    <div style={Styles.intro}>
                        Cloud storage and privacy.
                    </div>

                    <p>
                        When using Polar cloud sync we store your data in the
                        cloud and authentication / authorization is controlled
                        by the auth provider you select.
                    </p>

                    <p>
                        We do not sell your private data.  Your private data is
                        your own and we're not interested in selling or
                        monetizing it or distributing it to 3rd parties.
                    </p>

                </div>

                <div className="text-right">

                    <Button color="primary">Accept</Button>

                </div>

            </div>

        );
    }

}
