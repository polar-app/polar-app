import {join} from 'path'
import {initDatabase, insertCard, insertCols} from './sql'
import {createWriteStream, mkdirSync, rmSync, writeFileSync} from 'fs'
import * as archiver from 'archiver'
import {DeckConfig, DeckModels} from "./DeckConfig";
import {Card, CardContent} from "./Card";
import Database from "better-sqlite3";
import * as os from "os";

export namespace APKG {
    export interface IAPKG {
        addModels: () => DeckModels;
        addCard: (modelID: number, cardBody: CardContent) => void;
        addMedia: (filename: string, data: Buffer) => void;
        save: (destination: string) => Promise<string>;
    } 

    function sequenceGenerator(seed: number): () => number {
        return () => {
            return seed++;
        }
    }
    export function create(name: string): IAPKG {
        const sequence = sequenceGenerator(Date.now());

        const tmpdir = os.tmpdir();

        const dest: string = join(tmpdir, name);

        mkdirSync(dest);

        const db: Database.Database = new Database(join(dest, 'collection.anki2'));

        const deck: DeckConfig = {
            id: Date.now(),
            name
        };

        initDatabase(db);

        const mediaFiles: string[] = [];

        function addModels(): DeckModels {
            return insertCols(db, deck);
        }

        function addCard(modelID: number, cardBody: CardContent): void {
            const card: Card = {
                timestamp: sequence(),
                content: cardBody.content
            };

            insertCard(db, deck, modelID, card);
        }

        function addMedia(filename: string, data: Buffer): void {
            const index = mediaFiles.length
            mediaFiles.push(filename)
            writeFileSync(join(dest, `${index}`), data)
        }
        async function save(destination: string): Promise<string> {
            const archive = archiver.create('zip');
            const savePath = join(destination, `${deck.name}.apkg`);

            const mediaObj = mediaFiles.reduce((obj, file, idx) => {
                // @ts-ignore
                obj[idx] = file
                return obj
            }, {});

            writeFileSync(join(dest, 'media'), JSON.stringify(mediaObj));

            archive.directory(dest, false);

            archive.pipe(
                createWriteStream(savePath)
            );

            archive.on('end', () => {
                rmSync(dest, { recursive: true, force: true });
            });

            await archive.finalize();

            return savePath;
        }

        return { addModels, addCard, addMedia, save };
    }
}
