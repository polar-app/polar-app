import * as React from "react";
import {useState} from "react";
import * as ReactDOM from 'react-dom';
import {Button} from "reactstrap";
import {NullCollapse} from "../../js/ui/null_collapse/NullCollapse";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface ActivatorProps {
    readonly render: (active: boolean) => JSX.Element;
}

interface ActivatorState {
    readonly active: boolean;
}

class Activator extends React.Component<ActivatorProps, ActivatorState> {

    private windowListener: () => void;

    constructor(props: Readonly<ActivatorProps>) {
        super(props);

        this.onElementClick = this.onElementClick.bind(this);
        this.setActive = this.setActive.bind(this);

        this.windowListener = () => {
            this.setActive(false);
        };

        this.state = {
            active: false
        };

    }

    public componentDidMount(): void {
        window.addEventListener('click', this.windowListener);
    }

    public componentWillUnmount(): void {
        window.removeEventListener('click', this.windowListener);
    }

    private setActive(active: boolean) {

        if (this.state.active !== active) {
            this.setState({active});
        }

    }

    private onElementClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();

        this.setActive(true);
    }

    public render() {
        return (
            <div onClick={event => this.onElementClick(event)}>
                {this.props.render(this.state.active)}
            </div>
        );
    }

}

interface PagemarkControlProps {
    readonly active: boolean;
    readonly children: any;
}

const PagemarkControl = (props: PagemarkControlProps) => (
    <NullCollapse open={props.active}>
        {props.children}
    </NullCollapse>
);

export const FakePagemark = () => {

    const container = document.getElementById("page");


    const onClose = () => {
        console.log("FIXME: close");
    };

    //
    // return ReactDOM.createPortal((
    //     <div style={{
    //             position: 'absolute',
    //             display: 'flex',
    //             flexDirection: 'column'
    //          }}
    //          tabIndex={-1}
    //          onClick={onFocus}>
    //
    //         <div style={{
    //                 background,
    //                 width: '400px',
    //                 height: '200px'
    //              }}>
    //
    //             {/*<Button onClick={() => setActive(! active)}>test</Button>*/}
    //
    //         </div>
    //
    //         <div className="text-right">
    //             <PagemarkControl active={active}>
    //                 <Button color="clear" onClick={onClose}>X</Button>
    //             </PagemarkControl>
    //         </div>
    //
    //     </div>
    // ), container!);

    return ReactDOM.createPortal((
        <div style={{
                 position: 'absolute',
             }}
             tabIndex={-1}>

            <Activator render={(active) => (

                <div style={{
                         display: 'flex',
                         flexDirection: 'column'
                     }}>
                    <div style={{
                        background: 'rgba(0, 0, 255, 0.5)',
                        width: '400px',
                        height: '200px'
                    }}>

                        {/*<Button onClick={() => setActive(! active)}>test</Button>*/}

                    </div>

                    <PagemarkControl active={active}>
                        <div className="text-right border-right border-bottom border-left rounded">
                            <Button color="clear" onClick={NULL_FUNCTION}>comment</Button>

                            <Button color="clear" onClick={onClose}>X</Button>
                        </div>
                    </PagemarkControl>

                </div>

            )}/>

        </div>
    ), container!);

};

