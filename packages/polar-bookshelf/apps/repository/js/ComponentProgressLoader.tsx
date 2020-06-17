import React from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";

interface IComponentProgressLoader {
    readonly setLoading: (loading: boolean) => void;
}

const ComponentProgressLoaderContext = React.createContext<IComponentProgressLoader>(null!);

function useComponentProgressLoader() {
    return React.useContext(ComponentProgressLoaderContext);
}

const LoadingBar = () => {
    console.log("FIXME: showing loading bar");

    return (
        <LinearProgress style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 1,
            width: '100%',
            zIndex: 20000
        }}/>
    );
};

const StartLoading = () => {
    const loader = useComponentProgressLoader();

    React.useEffect(() => {
        console.log("FIXME StartLoading");
        loader.setLoading(true);
    }, [])

    return null;

}

const EndLoading = () => {
    const loader = useComponentProgressLoader();

    React.useEffect(() => {
        console.log("FIXME EndLoading");
        loader.setLoading(false);
    }, [])

    return null;
}

interface IProps {
    readonly children: React.ReactElement;
}

export const ComponentProgressLoader = React.memo((props: IProps) => {

    const [loading, setLoading] = React.useState<boolean>(false);

    const context = React.useMemo<IComponentProgressLoader>(() => {
        return {
            setLoading
        };
    }, []);

    console.log("FIXME: loading: ", loading);

    return (
        <ComponentProgressLoaderContext.Provider value={context}>
            <>

                {loading && <LoadingBar/>}

                <StartLoading/>

                {props.children}

                <EndLoading/>

            </>
        </ComponentProgressLoaderContext.Provider>
    );

});
