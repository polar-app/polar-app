import Button from "reactstrap/lib/Button";
import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {GlobalHotKeys, configure} from "react-hotkeys";
import {InputGroup, Input} from "reactstrap";
import {PDFDocMeta} from "./PDFDocument";

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

                <Button color="clear">
                    <i className="fas fa-minus"/>
                </Button>

                <Button color="clear">
                    <i className="fas fa-plus"/>
                </Button>

                <Button color="clear"
                        onClick={() => props.onFind()}>
                    <i className="fas fa-search"/>
                </Button>
            </div>

        </GlobalHotKeys>
    );
};

