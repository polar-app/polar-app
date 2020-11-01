import * as React from "react";
import {PDFThumbnailer} from "polar-pdf/src/pdf/PDFThumbnailer";
import {Loading} from "../../../web/js/mui/MUIAsyncLoader";
import {useComponentDidMount} from "../../../web/js/hooks/ReactLifecycleHooks";

const url = 'https://storage.googleapis.com/polar-32b0f.appspot.com/stash/1PwtutApP6pbC1SszLuEzjBpU8V14EZDAnUfGmPN.pdf';

export const PDFThumbnailerStory = () => {

    const [thumbnail, setThumbnail] = React.useState<PDFThumbnailer.IThumbnail | undefined>();

    const doAsync = React.useCallback(async () => {
        const thumbnail = await PDFThumbnailer.generate2(url);
        setThumbnail(thumbnail);
    }, []);

    if (! thumbnail) {
        return <Loading/>;
    }

    useComponentDidMount(() => {
        doAsync().catch(err => console.error(err));
    })

    return (
        <div>
            loaded
        </div>
    );
}