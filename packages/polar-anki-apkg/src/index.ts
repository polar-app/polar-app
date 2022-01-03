import {join} from 'path'
import {initDatabase, insertCard} from './sql'
import {createWriteStream, mkdirSync, writeFileSync} from 'fs'
import * as archiver from 'archiver'
import {DeckConfig} from "./DeckConfig";
import {Card} from "./Card";
import Database from "better-sqlite3";
import rimraf from "rimraf";

export class APKG {
  private db: Database.Database
  private deck: DeckConfig
  private dest: string
  private mediaFiles: Array<string>
  constructor(private config: DeckConfig) {
    this.dest = join(__dirname, config.name)
    this.clean()
    mkdirSync(this.dest)
    this.db = new Database(join(this.dest, 'collection.anki2'))
    this.deck = {
      ...config,
      id: +new Date()
    }
    initDatabase(this.db, this.deck)
    this.mediaFiles = []
  }
  addCard(card: Card) {
    insertCard(this.db, this.deck, card)
  }
  addMedia(filename: string, data: Buffer) {
    const index = this.mediaFiles.length
    this.mediaFiles.push(filename)
    writeFileSync(join(this.dest, `${index}`), data)
  }
  async save(destination: string) {
    const directory = join(__dirname, this.config.name)
    const archive = archiver.create('zip');

    const mediaObj = this.mediaFiles.reduce((obj, file, idx) => {
      // @ts-ignore
      obj[idx] = file
      return obj
    }, {})
    writeFileSync(join(this.dest, 'media'), JSON.stringify(mediaObj))
    archive.directory(directory, false)
    archive.pipe(
      createWriteStream(join(destination, `${this.config.name}.apkg`))
    )

    archive.on('end', this.clean.bind(this))
    await archive.finalize();

  }
  private clean() {
    rimraf(this.dest, () => {})
  }
}
