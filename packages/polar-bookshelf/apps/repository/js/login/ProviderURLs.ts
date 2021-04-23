import {HashURLs} from "polar-shared/src/util/HashURLs";

interface IProviderURL {
    readonly provider?: string;
}

export namespace ProviderURLs {
    import ILocationWithHash = HashURLs.ILocationWithHash;

    export function parse(location: ILocationWithHash): IProviderURL {
        const params = HashURLs.parse(location);
        const provider = params.get('provider') || undefined
        return {provider};
    }
}
