import { IPagemarkRange } from "polar-shared/src/metadata/IPagemarkRange";
import {IDocViewerContextMenuOrigin} from "./DocViewerMenu";

export interface IFluidPagemark {
    readonly percentage: number;
    readonly range: IPagemarkRange;
}

export interface FluidPagemarkFactory {

    /**
     * Create a fluid pagemark or undefined if one can't be created.
     */
    readonly create: (origin: IDocViewerContextMenuOrigin) => IFluidPagemark | undefined;

}
