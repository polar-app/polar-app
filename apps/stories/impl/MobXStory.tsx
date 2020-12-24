import * as React from 'react';
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import Button from '@material-ui/core/Button';

const Root = observer(() => {

    const store = useMyStoreContext();

    return (
        <div>

            <p>
                <Button onClick={() => store.count++} variant="contained">
                    click me
                </Button>
            </p>

            count: {store.count}
        </div>
    );

});

export const MobXStory = () => {

    return (
        <MyStoreContextProvider>
            <Root/>
        </MyStoreContextProvider>
    );

}



class MyStore {
    count: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

}

const MyStoreContext = React.createContext(new MyStore());

interface IMyStoreContextProviderProps {
    readonly children: JSX.Element;
}

const MyStoreContextProvider = React.memo((props: IMyStoreContextProviderProps) => {
    return (
        <MyStoreContext.Provider value={new MyStore()}>
            {props.children}
        </MyStoreContext.Provider>
    );
});

function useMyStoreContext() {
    return React.useContext(MyStoreContext);
}
