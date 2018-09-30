import * as React from 'react';
import {Button} from 'reactstrap';

export class AnnotationBar extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    public toggle() {

        if (! this.state.popoverOpen) {
            // this is a bit of a hack to position it exactly where we want it.
            document.getElementById('annotationbar-anchor')!.style.cssText
                = 'position: relative; top: 300px; left: 300px;';
        }

        this.setState({
             popoverOpen: !this.state.popoverOpen
        });
    }

    public render() {
        return (
            <div>

                <div className="rounded p-1 annotatebar text-center" style={{}}>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{ color: 'rgba(255,255,0)' }}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-highlighter annotatebar-btn-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(255,0,0)'}}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn annotatebar-btn-highlighter"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(0,255,0)'}}/>

                    </Button>

                    <Button size="md"
                            type="button"
                            className="btn p-1 m-1 annotatebar-btn"
                            title=""
                            aria-label=""
                            style={{ }}>

                        <span className="fas fa-comment"
                              aria-hidden="true"
                              style={{color: 'rgba(255,255,255)'}}/>

                    </Button>

                </div>

            </div>
        );
    }



}
