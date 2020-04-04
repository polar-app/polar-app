import {PDFToolbar} from "./PDFToolbar";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import {PDFDocument} from "./PDFDocument";
import {TextAreaHighlight} from "./TextAreaHighlight";
import * as React from "react";
import {ViewerContainer} from "./ViewerContainer";
import {Finder} from "./Finders";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {FindBox} from "./FindBox";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

interface IProps {

}

interface IState {
    readonly finder?: Finder;
    readonly findActive?: boolean;
}

export class PDFViewer extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);

        this.onFinder = this.onFinder.bind(this);
        this.onFind = this.onFind.bind(this);
        this.onFindExecute = this.onFindExecute.bind(this);

        this.state = {
        }

    }

    public render() {
        return (

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
            }}>

                <PDFToolbar onFullScreen={NULL_FUNCTION}
                            onFind={() => this.onFind()}/>

                <FindBox active={this.state.findActive}
                         onFindExecute={query => this.onFindExecute(query)}/>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                }}>

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
                                        onFinder={finder => this.onFinder(finder)}
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
    }

    private onFinder(finder: Finder) {
        this.setState({
            ...this.state,
            finder
        })
    }

    private onFind() {

        this.setState({
            ...this.state,
            findActive: true
        })

    }

    private onFindExecute(query: string) {

        this.state.finder!.exec({
            query,
            phraseSearch: false,
            caseSensitive: false,
            highlightAll: true,
            findPrevious: false
        }).catch(err => log.error(err));

    }

}
