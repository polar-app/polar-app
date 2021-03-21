import {Readable} from "stream";
import archiver from "archiver";

export type ZipStreamChunk = {
    source: string | Readable | Buffer
    data?: archiver.EntryData | archiver.ZipEntryData | undefined
}
