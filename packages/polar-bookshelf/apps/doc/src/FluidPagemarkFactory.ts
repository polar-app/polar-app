import {IPagemarkRange} from "polar-shared/src/metadata/IPagemarkRange";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

export type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

export interface IFluidPagemark {
    readonly range: IPagemarkRange;
}

export interface FluidPagemarkCreateOpts {

    /**
     * Specify the existing pagemark to see if it has a range that has to be
     * merged.
     */
    readonly existing: IPagemark | undefined;

    /**
     * The range we're working with.
     */
    readonly range: Range | undefined;

    /**
     * The direction that a pagemark was resized so that we can compute the
     * proper start/end parameters.
     */
    readonly direction: Direction | undefined;
}

export interface FluidPagemarkFactory {

    /**
     * Create a fluid pagemark or undefined if one can't be created.
     */
    create: (opts: FluidPagemarkCreateOpts) => IFluidPagemark | undefined;

}

export class NullFluidPagemarkFactory implements FluidPagemarkFactory {

    public create(opts: FluidPagemarkCreateOpts): IFluidPagemark | undefined {
        return undefined;
    }

}
