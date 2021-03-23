import React from 'react';

interface IProps {
    readonly children: React.ReactNode;
}

// this doesn't seem to work but it might be because our components load async
export class MountProgressLoader extends React.Component<IProps, any> {

    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {
        return false;
    }

    public componentDidMount(): void {
        console.log("FIXME mounted")
    }

    public render() {
        return this.props.children;
    }

}
