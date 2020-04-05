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
    readonly pdfDocMeta: PDFDocMeta | undefined;
    readonly onScale: Callback1<PDFScaleLevelTuple>;

}

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
                <Button color="clear">
                    <i className="fas fa-expand"/>
                </Button>

                <Button color="clear"
                        onClick={() => props.onPagePrev()}>
                    <i className="fas fa-arrow-up"/>
                </Button>

                <Button color="clear"
                        onClick={() => props.onPageNext()}>
                    <i className="fas fa-arrow-down"/>
                </Button>

                <InputGroup size="sm"
                            style={{
                                maxWidth: '3em'
                            }}>
                    <Input value={props.pdfDocMeta?.currentPage || 1}
                           style={{
                               textAlign: 'right'
                           }}
                           className="p-0 pl-1 pr-1"/>
                </InputGroup>

                {props.pdfDocMeta && <NumPages pdfDocMeta={props.pdfDocMeta}/>}

                <Button color="clear"
                        onClick={() => handleNextZoomLevel(-1)}>
                    <i className="fas fa-minus"/>
                </Button>

                <Button color="clear"
                    onClick={() => handleNextZoomLevel(1)}>
                    <i className="fas fa-plus"/>
                </Button>

                <InputGroup size="sm"
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

                <Button color="clear"
                        onClick={() => props.onFind()}>
                    <i className="fas fa-search"/>
                </Button>
            </div>

        </GlobalHotKeys>
    );
};

