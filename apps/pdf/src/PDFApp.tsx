import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PDFDocument} from "./PDFDocument";
import {PersistenceLayerManager} from "../../../web/js/datastore/PersistenceLayerManager";
import {AppInitializer} from "../../../web/js/apps/repository/AppInitializer";
import {ASYNC_NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import Button from 'reactstrap/lib/Button';
import { TextAreaHighlight } from './TextAreaHighlight';
import {ControlledAnnotationBars} from "../../../web/js/ui/annotationbar/ControlledAnnotationBars";
import {ControlledPopupProps} from "../../../web/js/ui/popup/ControlledPopup";
import {
    AnnotationBarCallbacks,
    OnHighlightedCallback
} from "../../../web/js/ui/annotationbar/ControlledAnnotationBar";
import {HighlightCreatedEvent} from "../../../web/js/comments/react/HighlightCreatedEvent";
import {SimpleReactor} from "../../../web/js/reactor/SimpleReactor";
import {PopupStateEvent} from "../../../web/js/ui/popup/PopupStateEvent";
import {TriggerPopupEvent} from "../../../web/js/ui/popup/TriggerPopupEvent";

let iter: number = 0;

const Toolbar = () => (
    <div style={{
             display: 'flex'
         }}
         className="border-bottom p-1">
        {/*<NavLogo/>*/}

        <Button color="clear">
            <i className="fas fa-expand"/>
        </Button>

        <Button color="clear">
            <i className="fas fa-search"/>
        </Button>

    </div>
);

const ViewerContainer = () => {

    ++iter;

    return (

        <main id="viewerContainer"
              itemProp="mainContentOfPage"
              data-iter={iter}>

            <div>
                <div id="viewer" className="pdfViewer">
                    <div/>

                </div>
            </div>

        </main>
    );

};

const DocLayout = () => (

    <div style={{
             display: 'flex',
             flexDirection: 'column',
             flexGrow: 1
         }}>
        <Toolbar/>

        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>

            <DockLayout dockPanels={[
                {
                    id: "dock-panel-left",
                    type: 'grow',
                    style: {
                        position: 'relative'
                    },
                    component:
                        <div>

                            <ViewerContainer/>

                            <PDFDocument
                                onFinder={finder => console.log({finder})}
                                target="viewerContainer"
                                url="./test.pdf"/>

                            <TextAreaHighlight/>

                        </div>
                },
                {
                    id: "doc-panel-center",
                    type: 'fixed',
                    component: <div>this is the right panel</div>,
                    width: 300,
                    style: {
                        overflow: 'none'
                    }
                }
            ]}/>
        </div>

    </div>


);

const PositionedLayout = () => (
    <div style={{marginRight: '250px'}}>

        <ViewerContainer/>

        <PDFDocument target="viewerContainer"
                     onFinder={finder => console.log({finder})}
                     url="./test.pdf"/>

    </div>

);



export class PDFApp {

    constructor(private readonly persistenceLayerManager = new PersistenceLayerManager()) {
    }

    public async start() {

        const persistenceLayerManager = this.persistenceLayerManager;

        const app = await AppInitializer.init({
            persistenceLayerManager,
            onNeedsAuthentication: ASYNC_NULL_FUNCTION
        });


        const rootElement = document.getElementById('root') as HTMLElement;

        // TODO: pass the appURL up so I can use the persistenceLayer to add
        // a snapshot listener for the doc then load it...

        this.startAnnotationBar();

        ReactDOM.render((
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                 }}>

                <DocLayout/>

                {/*<div style={{*/}

                {/*     }}>*/}
                {/*    <PositionedLayout/>*/}
                {/*</div>*/}
                {/*<ViewerContainer/>*/}

            </div>
            ), rootElement);

        // ReactDOM.render((
        //     // <div>
        //     //     <Viewer/>
        //     // </div>
        //     ), rootElement);

    }


    private startAnnotationBar() {

        const popupStateEventDispatcher = new SimpleReactor<PopupStateEvent>();
        const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

        const annotationBarControlledPopupProps: ControlledPopupProps = {
            id: 'annotationbar',
            placement: 'top',
            popupStateEventDispatcher,
            triggerPopupEventDispatcher
        };

        const onHighlighted: OnHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {
          // noop
        };

        const annotationBarCallbacks: AnnotationBarCallbacks = {
            onHighlighted,
            // onComment
        };

        ControlledAnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks);

    }

}
