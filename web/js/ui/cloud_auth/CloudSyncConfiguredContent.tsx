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
        // color: '007bff'
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
    },

    content: {
        maxWidth: '800px'
    }

};

export class CloudSyncConfiguredContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div style={Styles.content}>

                <div className="text-center">

                    <i className="fas fa-check-circle text-success" style={Styles.icon}></i>

                    <h1>Cloud Sync Configured</h1>

                </div>

                <p className="intro" style={Styles.overview}>
                    Polar Cloud Sync is setup.  Your documents will now be
                    copied to the cloud in the background.
                </p>

                <p>
                    Any new documents you add (or annotate) will also be updated
                    and synchronized in the background.
                </p>

                <p>
                    Please remember that Polar Sync is not a replacement for a
                    good backup strategy!  If you delete your files in Polar Sync
                    they're gone forever - just as though you deleted them locally.
                </p>

            </div>

        );
    }

}

interface IProps {
}

interface IState {

}


