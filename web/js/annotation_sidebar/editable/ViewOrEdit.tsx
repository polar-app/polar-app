import * as React from 'react';

/**
 * Simple HoC that allows the user to toggle between edit and view mode for a
 * component.
 */
export class ViewOrEdit extends React.PureComponent<IProps, IState> {

    private html: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        switch (this.props.mode) {

            case 'view':
                return this.props.view;

            case 'edit':
                return this.props.edit;

        }

    }

}

export interface IProps {
    readonly mode: Mode;
    readonly view: JSX.Element;
    readonly edit: JSX.Element;
}

export interface IState {
}

export type Mode = 'view' | 'edit';
