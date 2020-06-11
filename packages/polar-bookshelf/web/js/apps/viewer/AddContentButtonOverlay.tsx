import * as React from 'react';
import {useState} from 'react';
import {Callback} from "polar-shared/src/util/Functions";
import {DeviceRouter} from "../../ui/DeviceRouter";
import Button from '@material-ui/core/Button';

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

const BottomBar = (props: any) => (

    <div className=""
         style={{
             position: 'fixed',
             bottom: '0',
             zIndex: 100,
             width: '100%'
         }}>

        {props.children}

    </div>

);

interface AboutButtonProps {
    readonly onAdd: Callback;
}

const AddButton = (props: AboutButtonProps) => (
    <Button id="add-content-overlay"
            style={{
                fontWeight: 'bold',
                fontSize: '16px',
                fontFamily: 'sans-serif'
            }}
            color="primary"
            onClick={() => props.onAdd()}
            size="large">

        <i className="fas fa-plus mr-1"/>
        Add to Polar

    </Button>
);

interface DownloadButtonProps {
    readonly onDownload: Callback;
}

const DownloadButton = (props: DownloadButtonProps) => (
    <Button id="download-content-overlay"
            variant="contained"
            style={{
                fontWeight: 'bold',
                fontFamily: 'sans-serif'
            }}
            color="primary"
            className="shadow ml-auto mr-auto"
            onClick={() => props.onDownload()}
            size="large">

        <i className="fas fa-file-download mr-1" />
        Download

    </Button>
);

export namespace devices {

    export const Handheld = (props: AddContentButtonOverlayProps) => (

        <BottomBar>

        </BottomBar>

    );

    export const Desktop = (props: AddContentButtonOverlayProps) => (
        <>
            <DesktopTopRight>

                <div className="text-center">

                    <div>
                        <AddButton onAdd={() => props.onAdd()}/>
                    </div>

                    <div className="mt-2">
                        <DownloadButton onDownload={() => handleDownload()}/>
                    </div>

                </div>

            </DesktopTopRight>

        </>
    );
}

const AboutSplash = () => (

    <Dismissable id='add-to-polar-splash' render={dismiss => (

        <div style={{
                 borderWidth: '2px !important'
             }}
             className="bg-white border border-primary rounded p-3 shadow-lg">

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

                <Button size="large"
                        variant="contained"
                        className="text-muted"
                        onClick={() => dismiss()}>
                    No Thanks
                </Button>

                <a href="https://getpolarized.io/">
                    <Button size="large"
                            variant="contained"
                            color="primary">
                        Learn Smarter
                    </Button>
                </a>

            </div>

        </div>

    )}/>

);

function handleDownload() {
    // const url = new URL(document.location.href);
    // const file = url.searchParams.get('file');
    // document.location.href = file!;

    const url = new URL(document.location.href);
    const file = url.searchParams.get('file');
    const loc = `https://getpolarized.io/download-trigger.html?file=${file}`;

    document.location.href = loc;

}

interface AddContentButtonOverlayProps {
    readonly onAdd: Callback;
}

interface DismissableProps {

    /**
     * The id to use for the key to dismiss this item in local storage.
     */
    readonly id: string;

    readonly render: (dismiss: Callback) => JSX.Element;

}

const Dismissable = (props: DismissableProps) => {

    const initial = localStorage.getItem(props.id) === 'true';

    const [dismissed, setDismissed] = useState(initial);

    const dismiss = () => {
        localStorage.setItem(props.id, 'true');
        setDismissed(true);
    };

    if (dismissed) {
        return null;
    } else {
        return props.render(dismiss);
    }

};

export const AddContentButtonOverlay = (props: AddContentButtonOverlayProps) => (
    <DeviceRouter desktop={<devices.Desktop {...props}/>}
                  handheld={<devices.Handheld {...props}/>}/>
);

