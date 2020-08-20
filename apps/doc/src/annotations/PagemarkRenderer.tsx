import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {PagemarkRendererForFluid} from "./PagemarkRendererForFluid";
import {PagemarkRendererForFixed} from "./PagemarkRendererForFixed";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly container: HTMLElement;
}

export const PagemarkRenderer = deepMemo((props: IProps) => {
    if (props.pagemark.range) {
        return <PagemarkRendererForFluid {...props}/>
    } else {
        return <PagemarkRendererForFixed {...props}/>
    }
});
