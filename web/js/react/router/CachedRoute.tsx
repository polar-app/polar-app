import * as React from 'react';
import {Route} from "react-router-dom";
import {Cached} from '../Cached';

export type FunctionComponent = () => JSX.Element;

interface IProps {
    readonly path: string;
    readonly exact?: boolean;
    readonly component: JSX.Element;
}

// TODO: this component does not work yet but would be nice to get working.
export class CachedRoute extends React.Component<IProps> {

     public render() {
         //
         // const createComponent = (): FunctionComponent | undefined => {
         //
         //     if (this.props.component) {
         //         return () => <Cached>{this.props.component}</Cached>;
         //     }
         //
         //     return this.props.component;
         //
         // };
         //
         // const component = createComponent();
         //
         // const props = {...this.props, component};

         return (
             <Route path="#configured" render={() => <div>this is cached...</div>}/>
         );
    }

}
interface FooProps {
    readonly foopath: string;
    readonly exact?: boolean;
    readonly foocomponent: JSX.Element;
}
//
// export const CachedRoute2 = () => (
//     {/*<Route path="#configured2" render={() => <div>this is cached...</div>}/>*/}
//     null
// );


export const CachedRoute2 = () => null;
