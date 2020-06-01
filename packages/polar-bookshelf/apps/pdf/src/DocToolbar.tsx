import * as React from "react";
import {useState} from "react";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {PDFScaleLevel, PDFScaleLevelTuples, PDFScales} from "./PDFScaleLevels";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import TextField from "@material-ui/core/TextField";
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {DocFindButton} from "./DocFindButton";
import {MUIButtonBar} from "../../../web/js/mui/MUIButtonBar";
import {
    IDocDescriptor,
    useDocViewerCallbacks,
    useDocViewerStore
} from "./DocViewerStore";
import Divider from "@material-ui/core/Divider";
import computeNextZoomLevel = PDFScales.computeNextZoomLevel;

interface PageNumberInputProps {
    readonly docDescriptor: IDocDescriptor | undefined;
}

interface PageNumberInputState {
    readonly changing: boolean;
    readonly value: string;
}

const FullScreenButton = React.memo(() => {

    const [fullScreen, setFullScreen] = useState(false);

    // FIXME: shift+command+f for macos full-screen
    // make this a hook that we can reuse...

    function requestFullScreen() {

        async function doAsync() {
            await document.documentElement.requestFullscreen();
            setFullScreen(true);
        }

        doAsync()
            .catch(err => console.error(err));

    }


    function exitFullScreen() {

        async function doAsync() {
            await document.exitFullscreen();
            setFullScreen(false);
        }

        doAsync()
            .catch(err => console.error(err));

    }

    function toggleFullScreen() {
        if (fullScreen) {
            exitFullScreen();
        } else {
            requestFullScreen();
        }
    }

    return (
        <IconButton onClick={toggleFullScreen}>
            <FullscreenIcon/>
        </IconButton>
    )

});

const PageNumberInput = (props: PageNumberInputProps) => {

    const {pageNavigator} = useDocViewerStore();
    const {onPageJump} = useDocViewerCallbacks();

    // yield to the property, except if we're changing the value, then jump
    // to the right value, and then blur the element...

    const numberToString = (value: number | undefined): string => {

        if (value) {
            return value.toString();
        }

        return '';

    };

    const [state, setState] = useState<PageNumberInputState>({
        changing: false,
        value: ''
    });

    const value = state.changing ?
        state.value :
        numberToString(pageNavigator?.get() || 1);

    const resetState = () => {
        setState({
            changing: false,
            value: ''
        });
    };

    const parsePage = (): number | undefined => {

        try {

            const page = parseInt(value);

            if (page <= 0 || page > (props.docDescriptor?.nrPages || 0)) {
                return undefined;
            }

            return page;

        } catch (e) {
            return undefined;
        }

    };

    const onEnter = () => {

        const newPage = parsePage();

        if (newPage) {
            onPageJump(newPage);
        }

    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we can
        // just listen to the key directly

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            // Make sure NO other modifiers are enabled.. control+escape for example.
            return;
        }

        switch (event.key) {

            case 'Enter':
                onEnter();
                break;

        }

    };

    const handleChange = (val: string) => {
        setState({changing: true, value: val});
    };

    const handleBlur = () => {
        resetState();
    };

    return (
        <div style={{
                 maxWidth: '5em'
             }}
             className="mt-auto mb-auto">

            <TextField value={value}
                       onChange={event => handleChange(event.currentTarget.value)}
                       onBlur={() => handleBlur()}
                       onKeyDown={event => handleKeyDown(event)}
                       type="text"
                       size="small"
                       variant="outlined"
                       inputProps={{
                           style: {
                               textAlign: "right"
                           }
                       }}
                       style={{
                           width: '5em',
                       }}/>
        </div>

    );

};

interface NumPagesProps {
    readonly pdfDocMeta: IDocDescriptor;
}

const NumPages = (props: NumPagesProps) => (
    <div className="ml-1 mt-auto mb-auto"
         style={{fontSize: "1.3rem", userSelect: 'none'}}>
        of {props.pdfDocMeta.nrPages}
    </div>
);

const PagePrevButton = React.memo(() => {

    const {onPagePrev} = useDocViewerCallbacks();
    const {pageNavigator} = useDocViewerStore();

    return (
        <IconButton disabled={! pageNavigator || pageNavigator.get() <= 1}
                    onClick={onPagePrev}>
            <ArrowUpwardIcon/>
        </IconButton>
    );

});

const PageNextButton = () => {

    const {onPageNext} = useDocViewerCallbacks();
    const {pageNavigator, docDescriptor} = useDocViewerStore();

    return (
        <IconButton disabled={! pageNavigator || ! docDescriptor || pageNavigator.get() >= docDescriptor.nrPages}
                    onClick={onPageNext}>
            <ArrowDownwardIcon/>
        </IconButton>
    );

}


export const DocToolbar = React.memo(() => {

    const {docDescriptor, docScale} = useDocViewerStore();
    const {setScale} = useDocViewerCallbacks();

    const handleScaleChange = (scale: PDFScaleLevel) => {

        const value =
            arrayStream(PDFScaleLevelTuples)
                .filter(current => current.value === scale)
                .first();

        setScale(value!);

    };

    const handleNextZoomLevel = (delta: number) => {

        const nextScale = computeNextZoomLevel(delta, docScale?.scale);

        if (nextScale) {
            setScale(nextScale);
        }

    };

    return (
        <MUIPaperToolbar borderBottom>

            <div style={{
                     display: 'flex',
                 }}
                 className="p-1 vertical-aligned-children">

                <div style={{
                        display: 'flex',
                        flexGrow: 1,
                        flexBasis: 0
                     }}
                     className="vertical-aligned-children">

                    <MUIButtonBar>

                        <DocFindButton className="mr-1"/>

                        <Divider orientation="vertical"/>

                        <PagePrevButton/>

                        <PageNextButton/>

                        <PageNumberInput docDescriptor={docDescriptor}/>

                        {docDescriptor && <NumPages pdfDocMeta={docDescriptor}/>}

                    </MUIButtonBar>
                </div>

                <div style={{
                         display: 'flex',
                         flexGrow: 1,
                         flexBasis: 0
                     }}
                     className="vertical-align-children">

                    <div style={{
                             display: 'flex',
                             alignItems: 'center'
                         }}
                         className="ml-auto mr-auto vertical-align-children">

                        <MUIButtonBar>
                            <IconButton onClick={() => handleNextZoomLevel(-1)}>
                                <RemoveIcon/>
                            </IconButton>

                            {docScale &&
                                <FormControl variant="outlined" size="small">
                                    <Select value={docScale.scale.value || 'page-width'}
                                            onChange={event => handleScaleChange(event.target.value as PDFScaleLevel)}>
                                        {PDFScaleLevelTuples.map(current => (
                                            <MenuItem key={current.value}
                                                      value={current.value}>
                                                {current.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>}

                            <IconButton onClick={() => handleNextZoomLevel(1)}>
                                <AddIcon/>
                            </IconButton>

                        </MUIButtonBar>

                    </div>

                </div>

                <div style={{
                         display: 'flex',
                         flexGrow: 1,
                         flexBasis: 0
                     }}
                     className="vertical-aligned-children">

                    <div style={{display: 'flex'}}
                         className="ml-auto vertical-aligned-children">

                        <FullScreenButton/>

                    </div>

                </div>

            </div>
        </MUIPaperToolbar>
    );
});

