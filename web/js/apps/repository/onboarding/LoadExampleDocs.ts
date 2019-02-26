import {AppPath} from '../../../electron/app_path/AppPath';
import {FilePaths} from '../../../util/FilePaths';
import {PDFImporter, ImportedFile} from '../importers/PDFImporter';
import {PersistenceLayer} from '../../../datastore/PersistenceLayer';
import {Providers} from '../../../util/Providers';
import {Pagemarks} from '../../../metadata/Pagemarks';
import {Logger} from '../../../logger/Logger';
import {Tag} from '../../../tags/Tag';
import {ISODateTimeString, ISODateTimeStrings} from '../../../metadata/ISODateTimeStrings';
import {Optional} from '../../../util/ts/Optional';

const log = Logger.create();

export class LoadExampleDocs {

    private readonly persistenceLayer: PersistenceLayer;

    private readonly pdfImporter: PDFImporter;

    constructor(persistenceLayer: PersistenceLayer) {
        this.persistenceLayer = persistenceLayer;

        this.pdfImporter
            = new PDFImporter(
                Providers.toInterface(
                    Providers.of(
                        this.persistenceLayer)));

    }

    public async load() {

        if (await this.hasDocs()) {
            // we're done as there already docs in the repo
            log.debug("Docs already exist");
            return;
        }

        // TODO: register 10 docs.. 4 on first day, then 3, then 2...
        // TODO: highlights and comments...
        // TODO: flashcards

        // now load the files propery..
        await this.doDoc0();
        await this.doDoc1();
        await this.doDoc2();

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'availability.pdf'), {
            title: "Availability in Globally Distributed Storage Systems",
            tags: this.createTags('google', 'availability'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-12h'),
            pagemarkEnd: 7
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'borg.pdf'), {
            title: "Large-scale cluster management at Google with Borg",
            tags: this.createTags('google', 'borg', 'docker'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 2
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'chubby.pdf'), {
            title: "The Chubby lock service for loosely-coupled distributed systems",
            tags: this.createTags('google', 'chubby'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3h'),
            pagemarkEnd: 2
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'datacenter-as-a-computer.pdf'), {
            title: "The Datacenter as a Computer",
            tags: this.createTags('google', 'datacenters'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 2
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'dremel.pdf'), {
            title: "Dremel: Interactive Analysis of Web-Scale Datasets",
            tags: this.createTags('google', 'dremel'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 1
        });

    }

    private createTag(id: string, label?: string): Tag {
        return {id, label: label || id};
    }

    private createTags(...labels: string[]): {[id: string]: Tag} {

        const result: {[id: string]: Tag} = {};

        for (const label of labels) {
            const id = label;
            result[id] = {id, label};
        }

        return result;

    }

    private async doDoc0() {

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'pub47492.pdf'), {
            title: "Efficient Live Expansion for Clos Data Center Networks",
            tags: this.createTags('google', 'datacenters'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2h'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1h'),
            pagemarkEnd: 17
        });

    }

    private async doDoc1() {

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'bigtable.pdf'), {
            title: "Bigtable: A Distributed Storage System for Structured Data",
            tags: {
                google: this.createTag('google'),
                bigtable: this.createTag('bigtable'),
                compsci: this.createTag('compsci')
            },
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1d'),
            pagemarkEnd: 3,
            flagged: true
        });

    }

    private async doDoc2() {

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'mapreduce.pdf'), {
            title: "MapReduce: Simplified Data Processing on Large Clusters",
            tags: {
                google: this.createTag('google'),
                mapreduce: this.createTag('mapreduce'),
                compsci: this.createTag('compsci')
            },
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            pagemarkEnd: 6
        });

    }

    private async doDoc(relativePath: string, opts: DocOpts) {

        const importedFile =
            await this.doImport(relativePath);

        if (importedFile.isPresent()) {

            const docInfo = importedFile.get().docInfo;

            const docMeta = await this.persistenceLayer.getDocMeta(docInfo.fingerprint);

            if (docMeta) {
                docMeta.docInfo.title = opts.title;

                // const tags = {...(opts.tags || {}),
                //               ...this.createTags('polar:example')};

                const tags = {...(opts.tags || {})};

                docMeta.docInfo.tags = tags;

                if (opts.pagemarkEnd) {
                    Pagemarks.updatePagemarksForRange(docMeta, opts.pagemarkEnd);
                }

                if (opts.added) {
                    docMeta.docInfo.added = opts.added;
                }

                if (opts.lastUpdated) {
                    docMeta.docInfo.lastUpdated = opts.lastUpdated;
                }

                docMeta.docInfo.flagged
                    = Optional.of(opts.flagged).getOrElse(false);

                log.info("Wrote to persistenceLayer: ", opts.title);

                await this.persistenceLayer.writeDocMeta(docMeta);
            }

        }

    }

    private async doImport(relativePath: string): Promise<Optional<ImportedFile>> {

        const appPath = AppPath.get();

        if (! appPath) {
            return Optional.empty();
        }

        const path = FilePaths.join(appPath, relativePath);

        return await this.pdfImporter.importFile(path);

    }

    private async hasDocs() {
        const docMetaRefs = await this.persistenceLayer.getDocMetaRefs();

        return docMetaRefs.length !== 0;
    }

}

interface DocOpts {
    readonly title?: string;
    readonly pagemarkEnd?: number;
    readonly tags?: {[id: string]: Tag};
    readonly added?: ISODateTimeString;
    readonly flagged?: boolean;
    readonly lastUpdated?: ISODateTimeString;
}
