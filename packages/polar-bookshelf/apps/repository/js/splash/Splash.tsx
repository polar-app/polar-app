import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {ConditionalSetting} from '../../../../web/js/ui/util/ConditionalSetting';
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

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

        this.onClose = this.onClose.bind(this);
        this.onLater = this.onLater.bind(this);
        this.onDoNotShowAgain = this.onDoNotShowAgain.bind(this);

    }

    public render() {

        const CloseButton = () => {

            if (this.props.disableClose) {
                return (<div/>);
            } else {
                return (<Button color="primary"
                                variant="contained"
                                onClick={() => this.onClose()}>Close</Button>);
            }

        };

        const DontShowAgain = () => {

            if (this.props.disableDontShowAgain) {
                return (<div/>);
            } else {
                return (
                    <>
                        <InputLabel style={Styles.label}>

                            <Input type="checkbox"
                                   onChange={(event) => this.onDoNotShowAgain(!this.doNotShowAgain)}/>

                            Don't show again

                        </InputLabel>
                    </>
                );
            }

        };

        // return (
        //
        //     <LargeModal isOpen={this.state.open}>
        //
        //         <LargeModalBody>
        //
        //             {this.props.children}
        //
        //         </LargeModalBody>
        //
        //         <ModalFooter>
        //
        //             <DontShowAgain/>
        //
        //             {/*TODO: make later show up a week later...*/}
        //             <Button color="secondary"
        //                     size="sm"
        //                     onClick={() => this.onLater()}>Later</Button>
        //
        //             <CloseButton/>
        //
        //         </ModalFooter>
        //
        //     </LargeModal>
        //
        // );

        // TODO disabled until we figure out the best strategy for onboarding
        return null;

    }

    private onDoNotShowAgain(value: boolean) {
        this.doNotShowAgain = value;
    }

    private onLater() {

        // TODO migrate to Prefs.markDelayed

        const conditionalSetting
            = new ConditionalSetting(this.props.settingKey);

        const after = Date.now() + (24 * 60 * 60 * 1000);

        conditionalSetting.set(`${after}`);

        this.setState({open: false});

        document.location!.href = '#';

    }


    private onClose() {

        if (this.doNotShowAgain) {

            const conditionalSetting
                = new ConditionalSetting(this.props.settingKey);

            conditionalSetting.set('do-not-show-again');

        }

        this.setState({open: false});

    }

}

interface IProps {
    readonly settingKey: string;

    readonly disableDontShowAgain?: boolean;
    readonly disableClose?: boolean;
}

interface IState {
    readonly open: boolean;
}

