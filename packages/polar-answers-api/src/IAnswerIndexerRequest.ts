import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";

export interface IAnswerIndexerRequest {
    readonly docID: IDStr;
    readonly url: URLStr;
    readonly skipPages?: ReadonlyArray<PageNumber>;
}
