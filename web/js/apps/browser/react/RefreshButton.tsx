import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';
import {ISimpleReactor} from '../../../reactor/SimpleReactor';
import {NavigationEventType} from '../BrowserApp';

export class RefreshButton extends React.Component<Props, State> {

    constructor(props: Props, context: State) {
        super(props, context);

        this.props.navigationReactor.addEventListener(event => {

            if (event === 'did-start-loading') {
                console.log("started loading!");

                this.setState( {
                    nav: 'loading'
                });

            }

            if (event === 'did-stop-loading') {
                console.log("stopped loading!");

                this.setState( {
                    nav: 'loaded'
                });

            }

        });

        this.state = {
            nav: 'none'
        };

    }

    public render() {

        let navButtonClassName = '';
        let disabled = false;

        switch (this.state.nav) {
            case 'none':
                navButtonClassName = 'fa fa-refresh fa-lg';
                disabled = true;
                break;
            case 'loading':
                navButtonClassName = 'fa fa-refresh fa-lg fa-spin';
                disabled = false;
                break;
            case 'loaded':
                navButtonClassName = 'fa fa-refresh fa-lg';
                disabled = false;
                break;
        }

        return (

            <InputGroupAddon addonType="prepend"
                             title="Refresh the current page">

                <Button type="button"
                        className="btn btn-outline-secondary"
                        aria-label=""
                        disabled={disabled}
                        onClick={this.props.onReload}>

                    <span className={navButtonClassName} aria-hidden="true"></span>

                </Button>

            </InputGroupAddon>

        );

    }

}

interface Props {
    navigationReactor: ISimpleReactor<NavigationEventType>;
    onReload: () => void;

}

interface State {
    // what's happening with the load status.
    nav: 'none' | 'loading' | 'loaded';
}
