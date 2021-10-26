import {Readable} from "stream";
import archiver from "archiver";

export type ZipStreamChunk = {
    readonly source: string | Readable | Buffer
    readonly data?: archiver.EntryData | archiver.ZipEntryData | undefined
}
