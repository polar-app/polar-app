import {join} from 'path'
import {initDatabase, insertCard, insertCols} from './sql'
import {createWriteStream, mkdirSync, writeFileSync} from 'fs'
import * as archiver from 'archiver'
import {DeckConfig} from "./DeckConfig";
import {Card} from "./Card";
import Database from "better-sqlite3";
import rimraf from "rimraf";

export class APKG {
  private db: Database.Database
  private deck: DeckConfig;
  private dest: string
  private mediaFiles: Array<string>
  constructor(name: string) {
    this.dest = join(__dirname, name);

    this.clean();

    mkdirSync(this.dest);

    this.db = new Database(join(this.dest, 'collection.anki2'));

    this.deck = {
      id: Date.now(),
      name
    };

    initDatabase(this.db);

    this.mediaFiles = [];
  }

  addModels() {
    return insertCols(this.db, this.deck);
  }

  addCard(modelID:number, card: Card) {
    insertCard(this.db, this.deck, modelID, card);
  }
  addMedia(filename: string, data: Buffer) {
    const index = this.mediaFiles.length
    this.mediaFiles.push(filename)
    writeFileSync(join(this.dest, `${index}`), data)
  }
  async save(destination: string) {
    const archive = archiver.create('zip');

    const mediaObj = this.mediaFiles.reduce((obj, file, idx) => {
      // @ts-ignore
      obj[idx] = file
      return obj
    }, {});

    writeFileSync(join(this.dest, 'media'), JSON.stringify(mediaObj));
    
    archive.directory(this.dest, false);
    
    archive.pipe(
      createWriteStream(join(destination, `${this.deck.name}.apkg`))
    );

    archive.on('end', this.clean.bind(this));

    await archive.finalize();
  }
  private clean() {
    rimraf(this.dest, () => {})
  }
}
