// Reference:
// https://github.com/ankidroid/Anki-Android/wiki/Database-Structure
import sha1 from 'sha1'
import {Database} from 'better-sqlite3'
import {DeckConfig, DeckModels} from "./DeckConfig";
import {Card} from "./Card";

import { FlashcardType } from "polar-shared/src/metadata/FlashcardType";

export function initDatabase(database: Database) {

  const sql = `
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS col (
	id	integer,
	crt	integer NOT NULL,
	mod	integer NOT NULL,
	scm	integer NOT NULL,
	ver	integer NOT NULL,
	dty	integer NOT NULL,
	usn	integer NOT NULL,
	ls	integer NOT NULL,
	conf	text NOT NULL,
	models	text NOT NULL,
	decks	text NOT NULL,
	dconf	text NOT NULL,
	tags	text NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS cards (
	id	integer,
	nid	integer NOT NULL,
	did	integer NOT NULL,
	ord	integer NOT NULL,
	mod	integer NOT NULL,
	usn	integer NOT NULL,
	type	integer NOT NULL,
	queue	integer NOT NULL,
	due	integer NOT NULL,
	ivl	integer NOT NULL,
	factor	integer NOT NULL,
	reps	integer NOT NULL,
	lapses	integer NOT NULL,
	left	integer NOT NULL,
	odue	integer NOT NULL,
	odid	integer NOT NULL,
	flags	integer NOT NULL,
	data	text NOT NULL,
	PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS notes (
	id	integer,
	guid	text NOT NULL,
	mid	integer NOT NULL,
	mod	integer NOT NULL,
	usn	integer NOT NULL,
	tags	text NOT NULL,
	flds	text NOT NULL,
	sfld	integer NOT NULL,
	csum	integer NOT NULL,
	flags	integer NOT NULL,
	data	text NOT NULL,
	PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS graves (
	usn	integer NOT NULL,
	oid	integer NOT NULL,
	type	integer NOT NULL
);
CREATE TABLE IF NOT EXISTS revlog (
	id	integer,
	cid	integer NOT NULL,
	usn	integer NOT NULL,
	ease	integer NOT NULL,
	ivl	integer NOT NULL,
	lastIvl	integer NOT NULL,
	factor	integer NOT NULL,
	time	integer NOT NULL,
	type	integer NOT NULL,
	PRIMARY KEY(id)
);
CREATE INDEX IF NOT EXISTS ix_revlog_usn ON revlog (
	usn
);
CREATE INDEX IF NOT EXISTS ix_revlog_cid ON revlog (
	cid
);
CREATE INDEX IF NOT EXISTS ix_notes_usn ON notes (
	usn
);
CREATE INDEX IF NOT EXISTS ix_notes_csum ON notes (
	csum
);
CREATE INDEX IF NOT EXISTS ix_cards_usn ON cards (
	usn
);
CREATE INDEX IF NOT EXISTS ix_cards_sched ON cards (
	did,
	queue,
	due
);
CREATE INDEX IF NOT EXISTS ix_cards_nid ON cards (
	nid
);
COMMIT;
`
  database.exec(sql)
}

export function insertCols(database: Database, deck: DeckConfig): DeckModels {
  const basicModel = deck.id + 1;
  const clozeModel = deck.id + 2;
  const basicAndReverseModel = deck.id + 3;
  const basicOptionalReverseModel = deck.id + 4;

  const conf = {
    nextPos: 1,
    estTimes: true,
    activeDecks: [1],
    sortType: 'noteFld',
    timeLim: 0,
    sortBackwards: false,
    addToCur: true,
    curDeck: 1,
    newBury: true,
    newSpread: 0,
    dueCounts: true,
    curModel: basicModel,
    collapseTime: 1200
  }
  const models = {
    [basicModel]: {
      vers: [],
      name: 'polar-basic',
      tags: [],
      did: deck.id,
      usn: -1,
      req: [[0, 'all', [0]]],
      flds: generateFields(['Front', 'Back']),
      sortf: 0,
      latexPre:
        '\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n',
      tmpls: [
        {
          name: deck.name,
          qfmt: "{{Front}}",
          afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}",
          did: null,
          ord: 0,
          bafmt: '',
          bqfmt: ''
        }
      ],
      latexPost: '\\end{document}',
      type: 0,
      id: basicModel,
      css:
        '.card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n',
      mod: Date.now()
    },
    [clozeModel]: {
      id: clozeModel,
      type: 1,
      vers: [],
      name: 'polar-cloze',
      tags: [],
      did: deck.id,
      usn: -1,
      req: [[0, 'any', [0]]],
      flds: generateFields(['Text']),
      sortf: 0,
      latexPre:
        '\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n',
      tmpls: [
        {
          afmt: "{{cloze:Text}}",
          name: "polar-cloze",
          qfmt: "{{cloze:Text}}",
          did: null,
          ord: 0,
          bafmt: '',
          bqfmt: ''
        }
      ],
      latexPost: '\\end{document}',
      css:
        '.card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n',
      mod: Date.now()
    },
    [basicAndReverseModel]:  {
      id: basicAndReverseModel,
      vers: [],
      name: 'polar-basic (and reversed card)',
      tags: [],
      did: deck.id,
      usn: -1,
      req: [
        [0, 'all', [0]],
        [1, 'any', [1]]
      ],
      flds: generateFields(['Front', 'Back']),
      sortf: 0,
      latexPre:
        '\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n',
      tmpls: [
        {
          name: "Card 1",
          qfmt: "{{Front}}",
          afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}",
          did: null,
          ord: 0,
          bafmt: '',
          bqfmt: ''
        }
      ],
      latexPost: '\\end{document}',
      type: 0,
      css:
        '.card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n',
      mod: Date.now()
    },
    [basicOptionalReverseModel]:  {
      id: basicOptionalReverseModel,
      type: 0,
      vers: [],
      name: 'polar-basic (optional reversed card)',
      tags: [],
      did: deck.id,
      usn: -1,
      req: [
        [0, 'any', [0]],
        [1, 'all', [1, 2]]
      ],
      flds: generateFields(['Front', 'Back', 'Add Reverse']),
      sortf: 0,
      latexPre:
        '\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n',
      tmpls: [
        {
          name: "Card 1",
          qfmt: "{{Front}}",
          afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}",
          did: null,
          ord: 0,
          bafmt: '',
          bqfmt: ''
        }, 
        {
          name: "Card 2",
          qfmt: "{{#Add Reverse}}{{Back}}{{/Add Reverse}}",
          afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Front}}",
          did: null,
          ord: 1,
          bafmt: '',
          bqfmt: ''
        }
      ],
      latexPost: '\\end{document}',
      css:
        '.card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n',
      mod: Date.now()
    }
  }
  const decks = {
    [deck.id]: {
      name: deck.name,
      extendRev: 50,
      usn: -1,
      collapsed: false,
      newToday: [1362, 0],
      timeToday: [1362, 0],
      dyn: 0,
      extendNew: 10,
      conf: 1,
      revToday: [1362, 0],
      lrnToday: [1362, 0],
      id: deck.id, // deck id
      mod: Date.now(), // last modification time
      desc: ''
    }
  };

  const decksConfig = {};
  const sql = `
    INSERT INTO col VALUES (
      1,
      1401912000,
      ${deck.id},
      ${deck.id},
      11,
      0,
      0,
      0,
      '${JSON.stringify(conf)}',
      '${JSON.stringify(models)}',
      '${JSON.stringify(decks)}',
      '${JSON.stringify(decksConfig)}',
      '{}'
    );
  `;
  database.exec(sql);

  return {
    [FlashcardType.BASIC_FRONT_BACK]: basicModel,
    [FlashcardType.CLOZE]: clozeModel,
    [FlashcardType.BASIC_FRONT_BACK_AND_REVERSE]: basicAndReverseModel,
    [FlashcardType.BASIC_FRONT_BACK_OR_REVERSE]: basicOptionalReverseModel
  };
}

export function insertCard(database: Database, deck: DeckConfig, modelId: number, card: Card) {
  const createTime = Date.now()
  const cardId = createTime
  const noteId = cardId + 1
  const fieldsContent = card.content.join('\u001F')
  const sortField = card.content[0]
  const SQL_CARD = `INSERT INTO cards (id,nid,did,ord,mod,usn,type,queue,due,ivl,factor,reps,lapses,left,odue,odid,flags,data) VALUES (?,  ?,  ?,  0,  ?,  -1,  0,  0,  86400,0,0,0,0,0,0,0,0,'')`
  database.prepare(SQL_CARD).run(cardId, noteId, deck.id, createTime)

  const SQL_NOTE = `INSERT INTO notes (id,guid,mid,mod,usn,tags,flds,sfld,csum,flags,data) VALUES (?,  ?,  ?,  ?,  -1,  '',  ?,  ?,  ?,  0,  '');`
  database
    .prepare(SQL_NOTE)
    .run(
      noteId,
      `${cardId}`,
      modelId,
      createTime,
      fieldsContent,
      sortField,
      parseInt(sha1(sortField).substr(0, 8), 16)
    )
}


function generateFields(fields: Array<string>) {
  return fields.map((field, ord) => ({
    size: 20,
    name: field,
    media: [],
    rtl: false,
    ord,
    font: 'Arial',
    sticky: false
  }));
}