import * as React from "react";
import {useState} from "react";
import {Callback, Callback1} from "polar-shared/src/util/Functions";
import {GlobalHotKeys} from "react-hotkeys";
import {PDFDocMeta} from "./PDFDocument";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    PDFScaleLevel,
    PDFScaleLevelTuple,
    PDFScaleLevelTuples,
    PDFScales
} from "./PDFScaleLevels";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import TextField from "@material-ui/core/TextField";
import {MUIPaperToolbar} from "../../../web/spectron0/material-ui/MUIPaperToolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {DocFindButton} from "./DocFindButton";
import computeNextZoomLevel = PDFScales.computeNextZoomLevel;
import {MUIButtonBar} from "../../../web/spectron0/material-ui/MUIButtonBar";



// FIXME: move this its own component
const globalKeyMap = {
    PAGE_NEXT: ['n', 'j'],
    PAGE_PREV: ['p', 'k']
};

interface IProps {
    readonly onFind: Callback;
    readonly onFullScreen: Callback;
    readonly onPagePrev: () => void;
    readonly onPageNext: () => void;
    readonly onPageJump: (page: number) => void;
    readonly pdfDocMeta: PDFDocMeta | undefined;
    readonly onScale: Callback1<PDFScaleLevelTuple>;

}

interface PageNumberInputProps {
    readonly pdfDocMeta: PDFDocMeta | undefined;
    readonly onPageJump: (page: number) => void;
}

interface PageNumberInputState {
    readonly changing: boolean;
    readonly value: string;
}

const FullScreenButton = React.memo(() => {

    const [fullScreen, setFullScreen] = useState(false);

    // FIXME: shift+command+f for macos full-screen

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
        numberToString(props.pdfDocMeta?.currentPage || 1);

    const resetState = () => {
        setState({
            changing: false,
            value: ''
        });
    };

    const parsePage = (): number | undefined => {

        try {

            const page = parseInt(value);

            if (page <= 0 || page > (props.pdfDocMeta?.nrPages || 0)) {
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
            // resetState();
            props.onPageJump(newPage);
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
    readonly pdfDocMeta: PDFDocMeta;
}

const NumPages = (props: NumPagesProps) => (
    <div className="ml-1 mt-auto mb-auto" style={{fontSize: "1.3rem"}}>
        of {props.pdfDocMeta.nrPages}
    </div>
);

export const DocToolbar = (props: IProps) => {

    const globalKeyHandlers = {
        PAGE_NEXT: () => props.onPageNext(),
        PAGE_PREV: () => props.onPagePrev()
    };

    const handleScaleChange = (scale: PDFScaleLevel) => {

        const value =
            arrayStream(PDFScaleLevelTuples)
                .filter(current => current.value === scale)
                .first();

        props.onScale(value!);

    };

    const handleNextZoomLevel = (delta: number) => {

        const nextScale = computeNextZoomLevel(delta, props.pdfDocMeta?.scale);

        if (nextScale) {
            props.onScale(nextScale);
        }

    };

    return (
        <GlobalHotKeys
            keyMap={globalKeyMap}
            handlers={globalKeyHandlers}>

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

                            <IconButton onClick={() => props.onPagePrev()}>
                                <ArrowUpwardIcon/>
                            </IconButton>

                            <IconButton onClick={() => props.onPageNext()}>
                                <ArrowDownwardIcon/>
                            </IconButton>

                            <PageNumberInput pdfDocMeta={props.pdfDocMeta}
                                             onPageJump={page => props.onPageJump(page)}/>

                            {props.pdfDocMeta && <NumPages pdfDocMeta={props.pdfDocMeta}/>}

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

                                <IconButton onClick={() => handleNextZoomLevel(1)}>
                                    <AddIcon/>
                                </IconButton>

                                <FormControl variant="outlined" size="small">
                                    <Select value={props.pdfDocMeta?.scale.value || 'page-width'}
                                            onChange={event => handleScaleChange(event.target.value as PDFScaleLevel)}>
                                        {PDFScaleLevelTuples.map(current => (
                                            <MenuItem key={current.value}
                                                      value={current.value}>
                                                {current.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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


                            {/*<MUISearchBox2 onChange={text => props.onFiltered(text)}*/}

                            <DocFindButton/>

                            {/*<IconButton onClick={() => props.onFind()}>*/}
                            {/*    <SearchIcon/>*/}
                            {/*</IconButton>*/}

                            <FullScreenButton/>

                        </div>

                    </div>

                </div>
            </MUIPaperToolbar>
        </GlobalHotKeys>
    );
};

