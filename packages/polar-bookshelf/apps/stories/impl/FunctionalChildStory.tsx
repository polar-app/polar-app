import * as React from 'react';

interface IChildProps {
    readonly message: string;
}

const Child = (props: IChildProps) => {
    return (
        <div>
            {props.message}
        </div>
    )
}

interface IMainProps {
    readonly component: React.FunctionComponent<IChildProps>;
}

export const Main = (props: IMainProps) => {

    const Child = props.component;

    const message = 'this is my message';

    const Render = () => (
        <Child message={message}/>
    )

    return (
        <Render/>
    );

}

export const FunctionalChildStory = () => {
    return (
        <Main component={Child}/>
    )
}
