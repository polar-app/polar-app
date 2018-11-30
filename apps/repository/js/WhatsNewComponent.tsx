import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Version} from '../../../web/js/util/Version';
import {app} from 'electron';
import {FilePaths} from '../../../web/js/util/FilePaths';
import {Files} from '../../../web/js/util/Files';
import {Logger} from '../../../web/js/logger/Logger';
import {WhatsNewContent} from './WhatsNewContent';
import {WhatsNewModal} from './WhatsNewModal';
import Cookies from 'js-cookie';
import {ConditionalSetting} from '../../../web/js/ui/util/ConditionalSetting';
import {Renderer} from 'react-dom';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';

const log = Logger.create();

export class WhatsNewComponent extends React.Component<IProps, IState> {

    private readonly conditionalSetting = new ConditionalSetting('polar-whats-new-version');

    constructor(props: IProps, context: any) {
        super(props, context);

        this.hide = this.hide.bind(this);

        this.handleVersionState = this.handleVersionState.bind(this);
        this.isNewVersion = this.isNewVersion.bind(this);

        this.state = {
            open: false
        };

    }

    public componentDidMount(): void {

        this.handleVersionState()
            .catch( err => log.error("Unable to read version: ", err));

    }

    public render() {

        // noinspection TsLint
        return (
            <WhatsNewModal open={this.state.open} accept={() => this.hide()}/>
        );
    }

    private hide(): void {
        this.setState({open: false});
    }

    private async handleVersionState() {

        const isNewVersion = await this.isNewVersion();

        RendererAnalytics.event({category: 'app', action: 'whats-new-displayed'});

        this.setState({
            open: isNewVersion
        });

    }

    private async isNewVersion(): Promise<boolean> {

        const version = Version.get();

        const result =
            this.conditionalSetting.accept(value => value.getOrElse('') !== version);

        this.conditionalSetting.set(version);

        return result;

    }

}

interface IProps {
}

interface IState {
    open: boolean;
}

interface VersionData {
    version?: string;
}

