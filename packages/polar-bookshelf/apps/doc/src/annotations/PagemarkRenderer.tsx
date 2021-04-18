import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {PagemarkRendererForFluid} from "./PagemarkRendererForFluid";
import {PagemarkRendererForFixed} from "./PagemarkRendererForFixed";
import {useDocViewerContext} from "../renderers/DocRenderer";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly container: HTMLElement;
}

export const PagemarkRenderer = deepMemo(function PagemarkRenderer(props: IProps) {

    const {fileType} = useDocViewerContext();

    if (fileType === 'epub') {
        // we always have to use fluid pagemarks with epub documents.
        return <PagemarkRendererForFluid {...props}/>
    } else {
        return <PagemarkRendererForFixed {...props}/>
    }

});
