import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import {RichTextFeatureIntro} from "../../RichTextFeatureIntro";
import {RichTextArea} from "../../RichTextArea";
import Button from "@material-ui/core/Button";

export class EditTextHighlight extends React.PureComponent<IProps, IState> {

    private html: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.html = this.props.html;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            active: this.props.active || false
        };

    }

    public render() {



        const Editor = () => {

            return (
                <div>
                    {/*<RichTextFeatureIntro/>*/}

                    <div className="mt-1">

                        <div className="">

                            <RichTextArea id={this.props.id}
                                          defaultValue={this.props.html}
                                          autofocus={true}
                                          onKeyDown={event => this.onKeyDown(event)}
                                          onChange={(html) => this.onChange(html)}/>

                        </div>

                        <div className="flexbar w-100">


                            <div className="flexbar-right mt-1 mb-1">
                                <CancelButton onClick={() => this.props.onCancel()}/>

                                <Button onClick={() => this.props.onReset()}>

                                    Revert

                                </Button>

                                <Button color="primary"
                                        onClick={() => this.props.onChanged(this.html)}>

                                    Change

                                </Button>

                            </div>

                        </div>

                    </div>

                </div>
            )
        };

        return <NullCollapse open={this.props.active}>
            <Editor/>
        </NullCollapse>;

    }

    private onKeyDown(event: KeyboardEvent) {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.props.onChanged(this.html);
        }

    }

    private onChange(html: string): void {
        this.html = html;
    }

}
interface IProps {
    readonly id: string;
    readonly html: string;
    readonly active: boolean;
    readonly hidden: boolean;
    readonly onChanged: (html: string) => void;
    readonly onReset: () => void;
    readonly onCancel: () => void;
}

interface IState {
}


