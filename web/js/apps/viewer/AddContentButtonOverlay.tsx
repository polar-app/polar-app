import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Callback} from "polar-shared/src/util/Functions";

const DesktopTopRight = (props: any) => (

    <div className=""
         style={{
             position: 'fixed',
             top: '70px',
             right: '60px',
             zIndex: 100
         }}>

        {props.children}

    </div>

);

const DesktopBottomRight = (props: any) => (

    <div className=""
         style={{
             position: 'fixed',
             bottom: '20px',
             right: '20px',
             zIndex: 100,
             width: '435px'
         }}>

        {props.children}

    </div>

);

interface AboutButtonProps {
    readonly onClick: Callback;
}

const AddButton = (props: AboutButtonProps) => (
    <Button id="add-content-overlay"
            direction="down"
            style={{
                fontWeight: 'bold',
                fontSize: '16px',
                fontFamily: 'sans-serif'
            }}
            color="success"
            className="btn-lg shadow ml-auto mr-auto"
            onClick={() => props.onClick()}
            size="lg">

        <i className="fas fa-plus mr-1"/>
        Add to Polar

    </Button>
);

interface DownloadButtonProps {
    readonly onClick: Callback;
}

const DownloadButton = (props: DownloadButtonProps) => (
    <Button id="download-content-overlay"
            direction="down"
            style={{
                fontWeight: 'bold',
                fontFamily: 'sans-serif'
            }}
            color="primary"
            className="shadow ml-auto mr-auto"
            onClick={() => props.onClick()}
            size="sm">

        <i className="fas fa-file-download mr-1" />
        Download

    </Button>
);

const AboutSplash = () => (

    <div style={{
            borderWidth: '2px !important'
         }}
         className="bg-white border border-primary rounded p-3">

        <h4 className="text-center">
            Polar makes it easy to manage your education.
        </h4>

        <p className="ml-2">
            <i className="fas fa-check text-success"/> Manage both PDFs and web pages.<br/>
            <i className="fas fa-check text-success"/> Track reading progress, annotate, and comment.<br/>
            <i className="fas fa-check text-success"/> Web, desktop, and mobile support.<br/>
            <i className="fas fa-check text-success"/> Study smarter with flashcards and spaced repetition.<br/>
        </p>

        <div className="mt-3 text-center">
            <a href="https://getpolarized.io/">
                <Button size="lg" color="primary">
                    Learn Smarter
                </Button>
            </a>
        </div>

    </div>
);

export class AddContentButtonOverlay  extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        // TODO: Add RendererAnalytics for when this is loaded ... and added...

        return (
            <>
                <DesktopTopRight>

                    <div className="text-center">

                        <div>
                            <AddButton {...this.props}/>
                        </div>

                        <div className="mt-2">
                            <DownloadButton onClick={() => this.handleDownload()}/>
                        </div>

                    </div>

                </DesktopTopRight>

                <DesktopBottomRight>
                    <AboutSplash/>
                </DesktopBottomRight>

            </>

        );

    }

    private handleDownload() {
        const url = new URL(document.location.href);
        const file = url.searchParams.get('file');
        document.location.href = file!;
    }

}

interface IProps {
    onClick: () => void;
}

interface IState {
}
