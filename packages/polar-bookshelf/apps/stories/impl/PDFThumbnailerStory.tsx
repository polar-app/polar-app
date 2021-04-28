import * as React from "react";
import {PDFThumbnailer} from "polar-pdf/src/pdf/PDFThumbnailer";
import {useComponentDidMount} from "../../../web/js/hooks/ReactLifecycleHooks";
import {DataURLs} from "polar-shared/src/util/DataURLs";
import Box from "@material-ui/core/Box";
import {IThumbnail} from "polar-shared/src/util/Thumbnailer";
import {MUILoading} from "../../../web/js/mui/MUILoading";

const url = 'https://storage.googleapis.com/polar-32b0f.appspot.com/stash/1PwtutApP6pbC1SszLuEzjBpU8V14EZDAnUfGmPN.pdf';

const Thumbnail = (props: IThumbnail) => {

    const toDataURL = React.useCallback(() => {

        switch(props.format) {
            case "arraybuffer":
                return DataURLs.encode(props.data as ArrayBuffer, props.type);
            case "dataurl":
                return props.data as string;
        }

    }, [props.data, props.format, props.type]);

    const dataURL = React.useMemo(() => toDataURL(), [toDataURL]);

    return (
        <div>
            <img src={dataURL} width={props.scaledDimensions.width} height={props.scaledDimensions.height}/>
        </div>
    );
}

export const PDFThumbnailerStory = () => {

    const [thumbnail, setThumbnail] = React.useState<IThumbnail | undefined>();

    const doAsync = React.useCallback(async () => {
        console.log("Generating thumbnail...")
        const thumbnail = await PDFThumbnailer.generate({
            pathOrURL: url,
            scaleBy: 'width',
            value: 300
        });

        setThumbnail(thumbnail);
    }, []);

    useComponentDidMount(() => {
        doAsync().catch(err => console.error(err));
    })

    if (! thumbnail) {
        return <MUILoading/>;
    }

    return (
        <div>

            <b>type: </b> {thumbnail.type} <br/>
            <b>format: </b> {thumbnail.format} <br/>
            <b>nativeDimensions: </b> {thumbnail.nativeDimensions.width}x{thumbnail.nativeDimensions.height} <br/>
            <b>scaledDimensions: </b> {thumbnail.scaledDimensions.width}x{thumbnail.scaledDimensions.height} <br/>

            <Box mt={1} mb={1}>
                <Thumbnail {...thumbnail}/>
            </Box>

        </div>
    );
}