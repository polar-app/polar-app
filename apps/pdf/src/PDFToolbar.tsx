import Button from "reactstrap/lib/Button";
import * as React from "react";
import {Callback, Callback1} from "polar-shared/src/util/Functions";
import {GlobalHotKeys} from "react-hotkeys";
import {Input, InputGroup} from "reactstrap";
import {
    PDFDocMeta
} from "./PDFDocument";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    PDFScaleLevel,
    PDFScaleLevelTuple,
    PDFScaleLevelTuples, PDFScales
} from "./PDFScaleLevels";
import computeNextZoomLevel = PDFScales.computeNextZoomLevel;
import {useState} from "react";

// configure({logLevel: 'debug'});

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

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
        <InputGroup size="sm"
                    className="mt-auto mb-auto"
                    style={{
                        maxWidth: '3em'
                    }}>
            <Input value={value}
                   onChange={event => handleChange(event.currentTarget.value)}
                   onBlur={() => handleBlur()}
                   onKeyDown={event => handleKeyDown(event)}
                   style={{
                       textAlign: 'right'
                   }}
                   className="p-0 pl-1 pr-1"/>
        </InputGroup>

    );

};

interface NumPagesProps {
    readonly pdfDocMeta: PDFDocMeta;
}

const NumPages = (props: NumPagesProps) => (
    <div className="ml-1 mt-auto mb-auto">
        of {props.pdfDocMeta.nrPages}
    </div>
);

export const PDFToolbar = (props: IProps) => {

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
            handlers={globalKeyHandlers}
            >
            <div style={{
                     display: 'flex',
                 }}
                 className="border-bottom p-1">

                <div style={{display: 'flex', flexGrow: 1, flexBasis: 0}}>
                    <Button color="clear"
                            onClick={() => props.onPagePrev()}>
                        <i className="fas fa-arrow-up"/>
                    </Button>

                    <Button color="clear"
                            onClick={() => props.onPageNext()}>
                        <i className="fas fa-arrow-down"/>
                    </Button>

                    <PageNumberInput pdfDocMeta={props.pdfDocMeta}
                                     onPageJump={page => props.onPageJump(page)}/>

                    {props.pdfDocMeta && <NumPages pdfDocMeta={props.pdfDocMeta}/>}

                </div>

                <div style={{display: 'flex', flexGrow: 1, flexBasis: 0}}>

                    <div style={{display: 'flex'}} className="ml-auto mr-auto">

                        <Button color="clear"
                                onClick={() => handleNextZoomLevel(-1)}>
                            <i className="fas fa-minus"/>
                        </Button>

                        <Button color="clear"
                                onClick={() => handleNextZoomLevel(1)}>
                            <i className="fas fa-plus"/>
                        </Button>

                        <InputGroup size="sm"
                                    className="mt-auto mb-auto"
                                    style={{
                                        maxWidth: '7em'
                                    }}>

                            <Input type="select"
                                   value={props.pdfDocMeta?.scale.value}
                                   onChange={event => handleScaleChange(event.target.value as PDFScaleLevel)}>
                                {PDFScaleLevelTuples.map(current => (
                                    <option key={current.value}
                                            value={current.value}>
                                        {current.label}
                                    </option>
                                ))}
                            </Input>

                        </InputGroup>

                    </div>

                </div>

                <div style={{display: 'flex', flexGrow: 1, flexBasis: 0}}>

                    <div style={{display: 'flex'}} className="ml-auto">
                        <Button color="clear">
                            <i className="fas fa-expand"/>
                        </Button>

                        <Button color="clear"
                                onClick={() => props.onFind()}>
                            <i className="fas fa-search"/>
                        </Button>
                    </div>

                </div>

            </div>

        </GlobalHotKeys>
    );
};

