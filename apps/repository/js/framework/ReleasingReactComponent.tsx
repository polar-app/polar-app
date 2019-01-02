import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {MultiReleaser} from '../../../../web/js/reactor/EventListener';

const log = Logger.create();

export default class ReleasingReactComponent<P, S> extends React.Component<P, S> {

    protected readonly releaser = new MultiReleaser();

    constructor(props: P, context: any) {
        super(props, context);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    public componentWillUnmount(): void {
        log.info("Releasing resources with releaser");
        this.releaser.release();
    }

}

