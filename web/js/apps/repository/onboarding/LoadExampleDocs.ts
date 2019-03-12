import {AppPath} from '../../../electron/app_path/AppPath';
import {FilePaths} from '../../../util/FilePaths';
import {ImportedFile, PDFImporter} from '../importers/PDFImporter';
import {PersistenceLayer} from '../../../datastore/PersistenceLayer';
import {Providers} from '../../../util/Providers';
import {Pagemarks} from '../../../metadata/Pagemarks';
import {Logger} from '../../../logger/Logger';
import {Tag} from '../../../tags/Tag';
import {ISODateTimeString, ISODateTimeStrings} from '../../../metadata/ISODateTimeStrings';
import {Optional} from '../../../util/ts/Optional';
import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetas} from '../../../metadata/DocMetas';
import {FirebaseDatastore} from '../../../datastore/FirebaseDatastore';
import {Backend} from '../../../datastore/Backend';
import {DocFileMeta} from '../../../datastore/DocFileMeta';
import {AppRuntime} from '../../../AppRuntime';
import {FileRef} from '../../../datastore/Datastore';
import {LoadExampleDocsMeta} from './LoadExampleDocsMeta';

const log = Logger.create();

export class LoadExampleDocs {

    public static MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT = "a2887850877ae33e1e66ea24f433e30f";

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

        // http://storage.googleapis.com/polar-32b0f.appspot.com/public/p761-thompson.pdf
        // http://storage.googleapis.com/polar-32b0f.appspot.com/public/distributed-transactions.pdf
        //

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'availability.pdf'), {
            fingerprint: "39b730b6e9d281b0eae91b2c2c29b842",
            title: "Availability in Globally Distributed Storage Systems",
            tags: this.createTags('google', 'availability'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-12h'),
            pagemarkEnd: 7,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/availability.pdf",
            nrPages: 14
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'borg.pdf'), {
            fingerprint: "3417be32534083dea66d733604d36d75",
            title: "Large-scale cluster management at Google with Borg",
            tags: this.createTags('google', 'borg', 'docker'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 2,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/borg.pdf",
            nrPages: 17
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'chubby.pdf'), {
            fingerprint: "c29bc1717788b1602a3cf4ed28ddfbcd",
            title: "The Chubby lock service for loosely-coupled distributed systems",
            tags: this.createTags('google', 'chubby'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3h'),
            pagemarkEnd: 2,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/chubby.pdf",
            nrPages: 16
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'datacenter-as-a-computer.pdf'), {
            fingerprint: "a81fe1c43148c3448e1a4133a5c8005e",
            title: "The Datacenter as a Computer",
            tags: this.createTags('google', 'datacenters'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 2,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/datacenter-as-a-computer.pdf",
            nrPages: 120
        });

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'dremel.pdf'), {
            fingerprint: "69cf32b9ffbb82056a3ac0eadea447de",
            title: "Dremel: Interactive Analysis of Web-Scale Datasets",
            tags: this.createTags('google', 'dremel'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 1,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/dremel.pdf",
            nrPages: 10
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
            fingerprint: "6ea16525b2e4eab7b946f68419a345a6",
            title: "Efficient Live Expansion for Clos Data Center Networks",
            tags: this.createTags('google', 'datacenters'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2h'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1h'),
            pagemarkEnd: 17,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/pub47492.pdf",
            nrPages: 20
        });

    }

    private async doDoc1() {

        const writtenDocMeta = await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'bigtable.pdf'), {
            fingerprint: "a2887850877ae33e1e66ea24f433e30f",
            title: "Bigtable: A Distributed Storage System for Structured Data",
            tags: {
                google: this.createTag('google'),
                bigtable: this.createTag('bigtable'),
                compsci: this.createTag('compsci')
            },
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1d'),
            // pagemarkEnd: 3,
            flagged: true,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/bigtable.pdf",
            nrPages: 14
        });

        if (writtenDocMeta) {

            // TODO: use the correct lastUpdate and created times...
            const docMeta = DocMetas.deserialize(JSON.stringify(LoadExampleDocsMeta.BIGTABLE_DOC_META),
                                                 writtenDocMeta!.docInfo.fingerprint );

            docMeta.docInfo = writtenDocMeta!.docInfo;

            await this.persistenceLayer.writeDocMeta(docMeta);

        } else {
            // this is probably in a testing env...
        }

    }

    private async doDoc2() {

        await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'mapreduce.pdf'), {
            fingerprint: "9012f59fe537f2bb5fb802e31bb40e83",
            title: "MapReduce: Simplified Data Processing on Large Clusters",
            tags: {
                google: this.createTag('google'),
                mapreduce: this.createTag('mapreduce'),
                compsci: this.createTag('compsci')
            },
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            pagemarkEnd: 6,
            url: "http://storage.googleapis.com/polar-32b0f.appspot.com/public/mapreduce.pdf",
            nrPages: 13
        });
    }

    private async doDoc(relativePath: string, opts: DocOpts): Promise<DocMeta | undefined> {

        const doImport = async (): Promise<ImportedDoc> => {

            if (AppRuntime.isElectron()) {

                const importedFile =
                    await this.doImport(relativePath);

                if (importedFile.isPresent()) {

                    const docInfo = importedFile.get().docInfo;
                    const docMeta = await this.persistenceLayer.getDocMeta(docInfo.fingerprint);
                    const ref = importedFile.get().fileRef;

                    return {
                        docMeta: docMeta!,
                        ref
                    };

                } else {
                    throw new Error("Unable to do local import");
                }

            } else {

                // DocMetas.create();
                throw new Error("Not supported yet.");

            }

        };

        const importedDoc = await doImport();

        const docInfo = importedDoc.docMeta.docInfo;

        const docMeta = importedDoc.docMeta;

        if (docMeta) {
            docMeta.docInfo.title = opts.title;

            const tags = {...(opts.tags || {}),
                          ...this.createTags('example')};

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

            const datastore = this.persistenceLayer.datastore;

            if (datastore instanceof FirebaseDatastore) {

                // with Firebase we need to tell it how to get access to
                // the data files

                const backend = Backend.STASH;
                const ref = importedDoc.ref;

                const docFileMeta: DocFileMeta = {
                    backend,
                    ref,
                    url: opts.url,
                    meta: {}
                };

                await datastore.writeFileMeta(backend, ref, docFileMeta);

            }

        }

        return docMeta;


    }

    private async doImport(relativePath: string): Promise<Optional<ImportedFile>> {

        const appPath = AppPath.get();

        if (! appPath) {
            return Optional.empty();
        }

        const path = FilePaths.join(appPath, relativePath);
        const basename = FilePaths.basename(relativePath);

        return await this.pdfImporter.importFile(path, basename);

    }

    private async hasDocs() {
        const docMetaRefs = await this.persistenceLayer.getDocMetaRefs();

        return docMetaRefs.length !== 0;
    }

}

interface DocOpts {

    readonly fingerprint: string;

    readonly title: string;

    readonly pagemarkEnd?: number;

    readonly tags?: {[id: string]: Tag};

    readonly added?: ISODateTimeString;

    readonly flagged?: boolean;

    readonly lastUpdated?: ISODateTimeString;

    /**
     * Requires so that we can create the DocMeta in cases wherwe we're adding
     * with an explit/external URL.
     */
    readonly nrPages: number;

    readonly url: string;

}

interface ImportedDoc {

    readonly docMeta: DocMeta;
    readonly ref: FileRef;

}
