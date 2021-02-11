import * as React from 'react';
import Button from '@material-ui/core/Button';
import {useComponentWillUnmount} from "../../../web/js/hooks/ReactLifecycleHooks";

interface IChildProps {
    readonly message: string;
}

const Child = (props: IChildProps) => {

    useComponentWillUnmount(() => console.log('unmounting'));

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

    const [iter, setIter] = React.useState(0);

    const message = 'this is my message: '+ iter;

    const Render = () => {
        return Child({message});
    }

    return (
        <div>
            {Child({message})}

            <Button onClick={() => setIter(iter + 1)}>click</Button>
        </div>
    );

}

export const UnmountComponentStory = () => {
    return (
        <Main component={Child}/>
    )
}
