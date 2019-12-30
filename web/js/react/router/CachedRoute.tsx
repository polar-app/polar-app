import * as React from 'react';
import {Route} from "react-router-dom";
import {Cached} from '../Cached';

export type FunctionComponent = () => JSX.Element;

interface IProps {
    readonly path: string;
    readonly exact?: boolean;
    readonly component?: FunctionComponent;
    readonly render?: FunctionComponent;
}

// TODO: this component does not work yet but would be nice to get working.
export class CachedRoute extends React.Component<IProps> {

     public render() {

         const createComponent = (): FunctionComponent | undefined => {

             if (this.props.component) {
                 return () => <Cached>{this.props.component}</Cached>;
             }

             return this.props.component;

         };

         const component = createComponent();

         const props = {...this.props, component};

         return (
             <Route path={props.path} exact={props.exact} component={props.component}/>
         );
    }

}

