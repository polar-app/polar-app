// @NotStale

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
        loader.setLoading(true);
    }, [loader])

    return null;

}

const EndLoading = () => {

    const loader = useComponentProgressLoader();

    React.useEffect(() => {

        loader.setLoading(false);

    }, [loader])

    return null;
}

interface IProps {
    readonly children: React.ReactElement;
}

export const ComponentProgressLoader = React.memo(function ComponentProgressLoader(props: IProps) {

    const [loading, setLoading] = React.useState<boolean>(false);

    const context = React.useMemo<IComponentProgressLoader>(() => ({
        setLoading
    }), [setLoading  ]);

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
