import * as React from 'react';
import {IStyleMap} from '../../react/IStyleMap';


const Styles: IStyleMap = {

    button: {
        paddingTop: '4px',
        color: 'red !important',
        fontSize: '15px'

        // minWidth: '350px',
        // width: '350px'
    },

    icon: {
        fontSize: '120px',
        margin: '20px',
        color: '007bff'
        // minWidth: '350px',
        // width: '350px'
    },

    overview: {
        fontSize: '18px',
        textAlign: 'justify',
        margin: '25px'
    },

    features: {
        marginLeft: '25px'
    },

    price: {
        textAlign: 'center',
    },

    price_value: {
        fontSize: '40px',
        fontWeight: 'bold',
        lineHeight: '1em',
    },


    price_overview: {
        fontSize: '14px',
    }

};

export class CloudSignupContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div>

                <div className="text-center">

                    <i className="fas fa-cloud-upload-alt" style={Styles.icon}></i>

                    <h1>Polar Cloud Sync</h1>

                </div>

                <p className="intro" style={Styles.overview}>
                    Polar Cloud Sync enables synchronization of your
                    documents and annotations between multiple
                    devices transparently with the cloud.
                </p>

                <ul style={Styles.features}>

                    <li>
                        Full sync of your data into the cloud in realtime.
                        Your files are immediately distributed to your other
                        devices (MacOS, Windows, and Linux)
                    </li>

                    <li>
                        Up to 10 GB of storage for all your documents and
                        annotations.
                    </li>

                    <li>
                        Private access control. Your data is private
                        and only accessible to your account.
                    </li>

                    <li>
                        Full offline access with sync upon reconnect.
                    </li>

                    <li>
                        Your full document repository is still kept local which
                        enables you to stop using cloud sync at any time.
                    </li>

                </ul>

                <p>
                    <b>PREVIEW:</b> Cloud sync is currently available in preview.
                    We anticipate making it generally available in January
                    2019 and will support up to 100 documents for free with
                    $7.99 for up to 10GB of storage.  For now we're letting
                    users use cloud sync in preview mode with full access.
                </p>

                {/*<p style={Styles.price}>*/}

                    {/*<div style={Styles.price_value}>*/}
                        {/*$7.99*/}
                    {/*</div>*/}

                    {/*<div className="text-muted" style={Styles.price_overview}>*/}
                        {/*per month*/}
                    {/*</div>*/}

                {/*</p>*/}

            </div>

        );
    }

}

interface IProps {
}

interface IState {

}


