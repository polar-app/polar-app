import { join } from 'path'
import { initDatabase, insertCard, insertCols } from './sql'
import { createWriteStream, mkdirSync, writeFileSync, rmSync } from 'fs'
import * as archiver from 'archiver'
import { DeckConfig, DeckModels } from "./DeckConfig";
import { Card } from "./Card";
import Database from "better-sqlite3";

export namespace APKG {
    export function init(name: string) {
        const dest: string = join(__dirname, name);

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

        function addCard(modelID: number, card: Card): void {
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
