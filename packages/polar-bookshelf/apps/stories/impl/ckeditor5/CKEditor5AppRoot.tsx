import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {CKEditor5GlobalCss} from "./CKEditor5GlobalCss";
import * as React from "react";

interface IProps {
    readonly children: JSX.Element;
}

export const CKEditor5AppRoot = deepMemo(function CKEditor5AppRoot(props: IProps) {

    return (
        <>
            <CKEditor5GlobalCss/>
            {props.children}
        </>

    );

});