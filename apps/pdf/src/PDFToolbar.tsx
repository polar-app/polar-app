import Button from "reactstrap/lib/Button";
import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {Finder} from "./Finders";

interface IProps {
    readonly onFind: Callback;
    readonly onFullScreen: Callback;
}

export const PDFToolbar = (props: IProps) => (

    <div style={{
             display: 'flex'
         }}
         className="border-bottom p-1">
        {/*<NavLogo/>*/}

        <Button color="clear">
            <i className="fas fa-expand"/>
        </Button>

        <Button color="clear"
                onClick={() => props.onFind()}>

            <i className="fas fa-search"/>

        </Button>

    </div>
);
