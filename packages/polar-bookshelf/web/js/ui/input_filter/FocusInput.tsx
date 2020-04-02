import React from 'react';

/**
 * An input widget that changes color on focus/blur
 */
export class FocusInput extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.setFocused = this.setFocused.bind(this);

        this.state = {
            focused: false,
        };

    }

    public render() {

        const borderClass = this.state.focused ? 'border-primary' : 'border-muted';

        return <div className={"border rounded " + borderClass}
                    style={{...this.props.style}}
                    onBlur={() => this.setFocused(false)}
                    onFocus={() => this.setFocused(true)}>

            {this.props.children}
        </div>;

    }

    private setFocused(focused: boolean) {

        this.setState({
            focused
        });

    }

}

interface IProps {
    readonly style?: React.CSSProperties;

}

interface IState {
    readonly focused: boolean;
}
