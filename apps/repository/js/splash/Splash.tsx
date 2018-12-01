import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input} from 'reactstrap';
import {Version} from '../../../../web/js/util/Version';
import {app} from 'electron';
import {FilePaths} from '../../../../web/js/util/FilePaths';
import {Files} from '../../../../web/js/util/Files';
import {Logger} from '../../../../web/js/logger/Logger';
import {PrioritizedComponentManager, PrioritizedComponentRef} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {PrioritizedComponent} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {GithubStars} from './splashes/github_stars/GithubStars';
import {GithubStarsRef} from './splashes/github_stars/GithubStarsRef';
import {LargeModal} from '../../../../web/js/ui/large_modal/LargeModal';
import {LargeModalBody} from '../../../../web/js/ui/large_modal/LargeModalBody';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {ConditionalSetting} from '../../../../web/js/ui/util/ConditionalSetting';

const log = Logger.create();

const Styles: IStyleMap = {
    label: {
        cursor: 'pointer',
        userSelect: 'none'
    }
};

export class Splash extends React.Component<IProps, IState> {

    private doNotShowAgain: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: true
        };

        this.onOK = this.onOK.bind(this);
        this.onLater = this.onLater.bind(this);
        this.onDoNotShowAgain = this.onDoNotShowAgain.bind(this);

    }

    public render() {

        return (

            <LargeModal isOpen={this.state.open}>

                <LargeModalBody>

                    {this.props.children}

                </LargeModalBody>

                <ModalFooter>

                    <FormGroup check>
                        <Label check style={Styles.label}>

                            <Input type="checkbox"
                                   onChange={(event) => this.onDoNotShowAgain(! this.doNotShowAgain)} />

                            Don't show again

                        </Label>
                    </FormGroup>

                    {/*TODO: make later show up a week later...*/}
                    <Button color="secondary"
                            size="sm"
                            onClick={() => this.onLater()}>Later</Button>

                    <Button color="primary"
                            size="sm"
                            onClick={() => this.onOK()}>Ok</Button>

                </ModalFooter>

            </LargeModal>

        );

    }

    private onDoNotShowAgain(value: boolean) {
        this.doNotShowAgain = value;
    }

    private onLater() {

        this.setState({open: false});

    }


    private onOK() {

        if (this.doNotShowAgain) {
            const conditionalSetting = new ConditionalSetting(this.props.settingKey);
            conditionalSetting.set('do-not-show-again');
        }

        this.setState({open: false});

    }

}

interface IProps {
    settingKey: string;
}

interface IState {
    readonly open: boolean;
}

