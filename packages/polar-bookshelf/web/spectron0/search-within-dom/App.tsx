import * as React from 'react';

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div>
            </div>
        );

    }


}

interface IAppState {

}


