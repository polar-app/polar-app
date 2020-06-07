import * as React from 'react';
import {Nav} from '../util/Nav';
import {SURVEY_LINK} from '../../../../apps/repository/js/splash/splashes/survey/Survey';
import Button from '@material-ui/core/Button/Button';

export class TakeExtendedSurveyButton extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {
        return (
            <Button variant="contained"
                    onClick={() => this.onDone()}>
                Take Extended Survey
            </Button>
        );

    }

    private onDone() {

        Nav.openLinkWithNewTab(SURVEY_LINK);

    }

}

export interface IProps {

}

export interface IState {
}

