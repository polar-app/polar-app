import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {LeftRightSplit} from '../left_right_split/LeftRightSplit';
import {Nav} from '../util/Nav';
import {SURVEY_LINK} from '../../../../apps/repository/js/splash/splashes/survey/Survey';

export class BottomBar extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const width = this.props.width || 600;

        return <div style={{
                        position: 'fixed',
                        bottom: '25px',
                        width: '100%'
                     }}>

            <div style={{
                        width:  width + 'px',
                        zIndex: 9999,
                        marginLeft: 'auto',
                        marginRight: 'auto'
                  }}
                  className="border rounded shadow bg-white p-3">

                {this.props.children}

            </div>

        </div>;

    }

}

interface IProps {
    readonly width?: number;
}

interface IState {

}
