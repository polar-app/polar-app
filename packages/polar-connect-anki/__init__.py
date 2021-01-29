# Copyright 2016-2020 Alex Yatskov
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

import base64
import hashlib
import inspect
import json
import os
import os.path
import random
import re
import string
import time
import unicodedata

from PyQt5.QtCore import QTimer
from PyQt5.QtWidgets import QMessageBox

import anki
import anki.exporting
import anki.storage
import aqt
from anki.exporting import AnkiPackageExporter
from anki.importing import AnkiPackageImporter
from anki.utils import joinFields, intTime, guid64, fieldChecksum

from . import web, util


#
# PolarConnect
#

class PolarConnect:
    def __init__(self):
        self.log = None
        logPath = util.setting('apiLogPath')
        if logPath is not None:
            self.log = open(logPath, 'w')

        try:
            self.server = web.WebServer(self.handler)
            self.server.listen()

            self.timer = QTimer()
            self.timer.timeout.connect(self.advance)
            self.timer.start(util.setting('apiPollInterval'))
        except:
            QMessageBox.critical(
                self.window(),
                'PolarConnect',
                'Failed to listen on port {}.\nMake sure it is available and is not in use.'.format(util.setting('webBindPort'))
            )


    def logEvent(self, name, data):
        if self.log is not None:
            self.log.write('[{}]\n'.format(name))
            json.dump(data, self.log, indent=4, sort_keys=True)
            self.log.write('\n\n')
            self.log.flush()


    def advance(self):
        self.server.advance()


    def handler(self, request):
        self.logEvent('request', request)

        name = request.get('action', '')
        version = request.get('version', 4)
        params = request.get('params', {})
        key = request.get('key')
        reply = {'result': None, 'error': None}

        try:
            if key != util.setting('apiKey'):
                raise Exception('valid api key must be provided')

            method = None

            for methodName, methodInst in inspect.getmembers(self, predicate=inspect.ismethod):
                apiVersionLast = 0
                apiNameLast = None

                if getattr(methodInst, 'api', False):
                    for apiVersion, apiName in getattr(methodInst, 'versions', []):
                        if apiVersionLast < apiVersion <= version:
                            apiVersionLast = apiVersion
                            apiNameLast = apiName

                    if apiNameLast is None and apiVersionLast == 0:
                        apiNameLast = methodName

                    if apiNameLast is not None and apiNameLast == name:
                        method = methodInst
                        break

            if method is None:
                raise Exception('unsupported action')
            else:
                reply['result'] = methodInst(**params)

            if version <= 4:
                reply = reply['result']

        except Exception as e:
            reply['error'] = str(e)

        self.logEvent('reply', reply)
        return reply


    def window(self):
        return aqt.mw


    def reviewer(self):
        reviewer = self.window().reviewer
        if reviewer is None:
            raise Exception('reviewer is not available')
        else:
            return reviewer


    def collection(self):
        collection = self.window().col
        if collection is None:
            raise Exception('collection is not available')
        else:
            return collection


    def decks(self):
        decks = self.collection().decks
        if decks is None:
            raise Exception('decks are not available')
        else:
            return decks


    def scheduler(self):
        scheduler = self.collection().sched
        if scheduler is None:
            raise Exception('scheduler is not available')
        else:
            return scheduler


    def database(self):
        database = self.collection().db
        if database is None:
            raise Exception('database is not available')
        else:
            return database


    def media(self):
        media = self.collection().media
        if media is None:
            raise Exception('media is not available')
        else:
            return media


    def startEditing(self):
        self.window().requireReset()


    def stopEditing(self):
        if self.collection() is not None:
            self.window().maybeReset()


    def createNote(self, note):
        collection = self.collection()

        model = collection.models.byName(note['modelName'])
        if model is None:
            raise Exception('model was not found: {}'.format(note['modelName']))

        deck = collection.decks.byName(note['deckName'])
        if deck is None:
            raise Exception('deck was not found: {}'.format(note['deckName']))

        ankiNote = anki.notes.Note(collection, model)
        ankiNote.model()['did'] = deck['id']
        if 'tags' in note:
            ankiNote.tags = note['tags']

        for name, value in note['fields'].items():
            if name in ankiNote:
                ankiNote[name] = value

        allowDuplicate = False
        duplicateScope = None
        if 'options' in note:
          if 'allowDuplicate' in note['options']:
            allowDuplicate = note['options']['allowDuplicate']
            if type(allowDuplicate) is not bool:
              raise Exception('option parameter \'allowDuplicate\' must be boolean')
          if 'duplicateScope' in note['options']:
            duplicateScope = note['options']['duplicateScope']

        duplicateOrEmpty = self.isNoteDuplicateOrEmptyInScope(ankiNote, deck, duplicateScope)
        if duplicateOrEmpty == 1:
            raise Exception('cannot create note because it is empty')
        elif duplicateOrEmpty == 2:
          if not allowDuplicate:
            raise Exception('cannot create note because it is a duplicate')
          else:
            return ankiNote
        elif duplicateOrEmpty == False:
            return ankiNote
        else:
            raise Exception('cannot create note for unknown reason')

    def isNoteDuplicateOrEmptyInScope(self, note, deck, duplicateScope):
        "1 if first is empty; 2 if first is a duplicate, False otherwise."
        result = note.dupeOrEmpty()
        if result != 2 or duplicateScope != 'deck':
            return result

        # dupeOrEmpty returns if a note is a global duplicate
        # the rest of the function checks to see if the note is a duplicate in the deck
        val = note.fields[0]
        did = deck['id']
        csum = anki.utils.fieldChecksum(val)

        for noteId in note.col.db.list(
            "select id from notes where csum = ? and id != ? and mid = ?",
            csum,
            note.id or 0,
            note.mid,
        ):
            if note.col.db.scalar(
                "select id from cards where nid = ? and did = ?",
                noteId,
                did
            ):
                return 2
        return False


    #
    # Miscellaneous
    #

    @util.api()
    def version(self):
        return util.setting('apiVersion')

    @util.api()
    def getProfiles(self):
        return self.window().pm.profiles()

    @util.api()
    def loadProfile(self, name):
        if name not in self.window().pm.profiles():
            return False
        if not self.window().isVisible():
            self.window().pm.load(name)
            self.window().loadProfile()
            self.window().profileDiag.closeWithoutQuitting()
        else:
            cur_profile = self.window().pm.name
            if cur_profile != name:
                self.window().unloadProfileAndShowProfileManager()
                self.loadProfile(name)
        return True


    @util.api()
    def sync(self):
        self.window().onSync()


    @util.api()
    def multi(self, actions):
        return list(map(self.handler, actions))


    @util.api()
    def getNumCardsReviewedToday(self):
        return self.database().scalar('select count() from revlog where id > ?', (self.scheduler().dayCutoff - 86400) * 1000)


    @util.api()
    def getCollectionStatsHTML(self, wholeCollection=True):
        stats = self.collection().stats()
        stats.wholeCollection = wholeCollection
        return stats.report()


    #
    # Decks
    #

    @util.api()
    def deckNames(self):
        return self.decks().allNames()


    @util.api()
    def deckNamesAndIds(self):
        decks = {}
        for deck in self.deckNames():
            decks[deck] = self.decks().id(deck)

        return decks


    @util.api()
    def getDecks(self, cards):
        decks = {}
        for card in cards:
            did = self.database().scalar('select did from cards where id=?', card)
            deck = self.decks().get(did)['name']
            if deck in decks:
                decks[deck].append(card)
            else:
                decks[deck] = [card]

        return decks


    @util.api()
    def createDeck(self, deck):
        try:
            self.startEditing()
            did = self.decks().id(deck)
        finally:
            self.stopEditing()

        return did


    @util.api()
    def changeDeck(self, cards, deck):
        self.startEditing()

        did = self.collection().decks.id(deck)
        mod = anki.utils.intTime()
        usn = self.collection().usn()

        # normal cards
        scids = anki.utils.ids2str(cards)
        # remove any cards from filtered deck first
        self.collection().sched.remFromDyn(cards)

        # then move into new deck
        self.collection().db.execute('update cards set usn=?, mod=?, did=? where id in ' + scids, usn, mod, did)
        self.stopEditing()


    @util.api()
    def deleteDecks(self, decks, cardsToo=False):
        try:
            self.startEditing()
            decks = filter(lambda d: d in self.deckNames(), decks)
            for deck in decks:
                did = self.decks().id(deck)
                self.decks().rem(did, cardsToo)
        finally:
            self.stopEditing()


    @util.api()
    def getDeckConfig(self, deck):
        if not deck in self.deckNames():
            return False

        collection = self.collection()
        did = collection.decks.id(deck)
        return collection.decks.confForDid(did)


    @util.api()
    def saveDeckConfig(self, config):
        collection = self.collection()

        config['id'] = str(config['id'])
        config['mod'] = anki.utils.intTime()
        config['usn'] = collection.usn()

        if not config['id'] in collection.decks.dconf:
            return False

        collection.decks.dconf[config['id']] = config
        collection.decks.changed = True
        return True


    @util.api()
    def setDeckConfigId(self, decks, configId):
        configId = str(configId)
        for deck in decks:
            if not deck in self.deckNames():
                return False

        collection = self.collection()
        if not configId in collection.decks.dconf:
            return False

        for deck in decks:
            did = str(collection.decks.id(deck))
            aqt.mw.col.decks.decks[did]['conf'] = configId

        return True


    @util.api()
    def cloneDeckConfigId(self, name, cloneFrom='1'):
        configId = str(cloneFrom)
        if not configId in self.collection().decks.dconf:
            return False

        config = self.collection().decks.getConf(configId)
        return self.collection().decks.confId(name, config)


    @util.api()
    def removeDeckConfigId(self, configId):
        configId = str(configId)
        collection = self.collection()
        if configId == 1 or not configId in collection.decks.dconf:
            return False

        collection.decks.remConf(configId)
        return True


    @util.api()
    def storeMediaFile(self, filename, data=None, url=None):
        if data:
            self.deleteMediaFile(filename)
            self.media().writeData(filename, base64.b64decode(data))
        elif url:
            self.deleteMediaFile(filename)
            downloadedData = util.download(url)
            self.media().writeData(filename, downloadedData)
        else:
            raise Exception('You must either provide a "data" or a "url" field.')

    @util.api()
    def retrieveMediaFile(self, filename):
        filename = os.path.basename(filename)
        filename = unicodedata.normalize('NFC', filename)
        filename = self.media().stripIllegal(filename)

        path = os.path.join(self.media().dir(), filename)
        if os.path.exists(path):
            with open(path, 'rb') as file:
                return base64.b64encode(file.read()).decode('ascii')

        return False


    @util.api()
    def deleteMediaFile(self, filename):
        try:
            self.media().syncDelete(filename)
        except AttributeError:
            self.media().trash_files([filename])


    @util.api()
    def addNote(self, note):
        ankiNote = self.createNote(note)

        audioObjectOrList = note.get('audio')
        self.addAudio(ankiNote, audioObjectOrList)

        collection = self.collection()
        self.startEditing()
        nCardsAdded = collection.addNote(ankiNote)
        if nCardsAdded < 1:
            raise Exception('The field values you have provided would make an empty question on all cards.')
        collection.autosave()
        self.stopEditing()

        return ankiNote.id


    def addAudio(self, ankiNote, audioObjectOrList):
        if audioObjectOrList is None:
            return

        if isinstance(audioObjectOrList, list):
            audioList = audioObjectOrList
        else:
            audioList = [audioObjectOrList]

        for audio in audioList:
            if audio is not None and len(audio['fields']) > 0:
                try:
                    data = util.download(audio['url'])
                    skipHash = audio.get('skipHash')
                    if skipHash is None:
                        skip = False
                    else:
                        m = hashlib.md5()
                        m.update(data)
                        skip = skipHash == m.hexdigest()

                    if not skip:
                        audioFilename = self.media().writeData(audio['filename'], data)
                        for field in audio['fields']:
                            if field in ankiNote:
                                ankiNote[field] += u'[sound:{}]'.format(audioFilename)

                except Exception as e:
                    errorMessage = str(e).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    for field in audio['fields']:
                        if field in ankiNote:
                            ankiNote[field] += errorMessage


    @util.api()
    def canAddNote(self, note):
        try:
            return bool(self.createNote(note))
        except:
            return False


    @util.api()
    def updateNoteFields(self, note):
        ankiNote = self.collection().getNote(note['id'])
        if ankiNote is None:
            raise Exception('note was not found: {}'.format(note['id']))

        for name, value in note['fields'].items():
            if name in ankiNote:
                ankiNote[name] = value

        audioObjectOrList = note.get('audio')
        self.addAudio(ankiNote, audioObjectOrList)

        ankiNote.flush()

    @util.api()
    def addTags(self, notes, tags, add=True):
        self.startEditing()
        self.collection().tags.bulkAdd(notes, tags, add)
        self.stopEditing()


    @util.api()
    def removeTags(self, notes, tags):
        return self.addTags(notes, tags, False)


    @util.api()
    def getTags(self):
        return self.collection().tags.all()
    
    @util.api()
    def setEaseFactors(self, cards, easeFactors):
        couldSetEaseFactors = []
        ind = 0
        for card in cards:
            ankiCard = self.collection().getCard(card)
            if ankiCard is None:
                raise Exception('card was not found: {}'.format(card['id']))
                couldSetEaseFactors.append(False)
            else:
                couldSetEaseFactors.append(True)

            ankiCard.factor = easeFactors[ind]

            ankiCard.flush()

            ind += 1

        return couldSetEaseFactors
    
    @util.api()
    def getEaseFactors(self, cards):
        easeFactors = []
        for card in cards:
            ankiCard = self.collection().getCard(card)
            easeFactors.append(ankiCard.factor)

        return easeFactors

    @util.api()
    def suspend(self, cards, suspend=True):
        for card in cards:
            if self.suspended(card) == suspend:
                cards.remove(card)

        if len(cards) == 0:
            return False

        scheduler = self.scheduler()
        self.startEditing()
        if suspend:
            scheduler.suspendCards(cards)
        else:
            scheduler.unsuspendCards(cards)
        self.stopEditing()

        return True


    @util.api()
    def unsuspend(self, cards):
        self.suspend(cards, False)


    @util.api()
    def suspended(self, card):
        card = self.collection().getCard(card)
        return card.queue == -1


    @util.api()
    def areSuspended(self, cards):
        suspended = []
        for card in cards:
            suspended.append(self.suspended(card))

        return suspended


    @util.api()
    def areDue(self, cards):
        due = []
        for card in cards:
            if self.findCards('cid:{} is:new'.format(card)):
                due.append(True)
            else:
                date, ivl = self.collection().db.all('select id/1000.0, ivl from revlog where cid = ?', card)[-1]
                if ivl >= -1200:
                    due.append(bool(self.findCards('cid:{} is:due'.format(card))))
                else:
                    due.append(date - ivl <= time.time())

        return due


    @util.api()
    def getIntervals(self, cards, complete=False):
        intervals = []
        for card in cards:
            if self.findCards('cid:{} is:new'.format(card)):
                intervals.append(0)
            else:
                interval = self.collection().db.list('select ivl from revlog where cid = ?', card)
                if not complete:
                    interval = interval[-1]
                intervals.append(interval)

        return intervals



    @util.api()
    def modelNames(self):
        return self.collection().models.allNames()


    @util.api()
    def createModel(self, modelName, inOrderFields, cardTemplates, css = None):
        # https://github.com/dae/anki/blob/b06b70f7214fb1f2ce33ba06d2b095384b81f874/anki/stdmodels.py
        if (len(inOrderFields) == 0):
            raise Exception('Must provide at least one field for inOrderFields')
        if (len(cardTemplates) == 0):
            raise Exception('Must provide at least one card for cardTemplates')
        if (modelName in self.collection().models.allNames()):
            raise Exception('Model name already exists')

        collection = self.collection()
        mm = collection.models

        # Generate new Note
        m = mm.new(modelName)

        # Create fields and add them to Note
        for field in inOrderFields:
            fm = mm.newField(field)
            mm.addField(m, fm)

        # Add shared css to model if exists. Use default otherwise
        if (css is not None):
            m['css'] = css

        # Generate new card template(s)
        cardCount = 1
        for card in cardTemplates:
            cardName = 'Card ' + str(cardCount)
            if 'Name' in card:
                cardName = card['Name']

            t = mm.newTemplate(cardName)
            cardCount += 1
            t['qfmt'] = card['Front']
            t['afmt'] = card['Back']
            mm.addTemplate(m, t)

        mm.add(m)
        return m


    @util.api()
    def modelNamesAndIds(self):
        models = {}
        for model in self.modelNames():
            models[model] = int(self.collection().models.byName(model)['id'])

        return models


    @util.api()
    def modelNameFromId(self, modelId):
        model = self.collection().models.get(modelId)
        if model is None:
            raise Exception('model was not found: {}'.format(modelId))
        else:
            return model['name']


    @util.api()
    def modelFieldNames(self, modelName):
        model = self.collection().models.byName(modelName)
        if model is None:
            raise Exception('model was not found: {}'.format(modelName))
        else:
            return [field['name'] for field in model['flds']]


    @util.api()
    def modelFieldsOnTemplates(self, modelName):
        model = self.collection().models.byName(modelName)
        if model is None:
            raise Exception('model was not found: {}'.format(modelName))

        templates = {}
        for template in model['tmpls']:
            fields = []
            for side in ['qfmt', 'afmt']:
                fieldsForSide = []

                # based on _fieldsOnTemplate from aqt/clayout.py
                matches = re.findall('{{[^#/}]+?}}', template[side])
                for match in matches:
                    # remove braces and modifiers
                    match = re.sub(r'[{}]', '', match)
                    match = match.split(':')[-1]

                    # for the answer side, ignore fields present on the question side + the FrontSide field
                    if match == 'FrontSide' or side == 'afmt' and match in fields[0]:
                        continue
                    fieldsForSide.append(match)

                fields.append(fieldsForSide)

            templates[template['name']] = fields

        return templates

    @util.api()
    def modelTemplates(self, modelName):
        model = self.collection().models.byName(modelName)
        if model is None:
            raise Exception('model was not found: {}'.format(modelName))

        templates = {}
        for template in model['tmpls']:
            templates[template['name']] = {'Front': template['qfmt'], 'Back': template['afmt']}

        return templates


    @util.api()
    def modelStyling(self, modelName):
        model = self.collection().models.byName(modelName)
        if model is None:
            raise Exception('model was not found: {}'.format(modelName))

        return {'css': model['css']}


    @util.api()
    def updateModelTemplates(self, model):
        models = self.collection().models
        ankiModel = models.byName(model['name'])
        if ankiModel is None:
            raise Exception('model was not found: {}'.format(model['name']))

        templates = model['templates']

        for ankiTemplate in ankiModel['tmpls']:
            template = templates.get(ankiTemplate['name'])
            if template:
                qfmt = template.get('Front')
                if qfmt:
                    ankiTemplate['qfmt'] = qfmt

                afmt = template.get('Back')
                if afmt:
                    ankiTemplate['afmt'] = afmt

        models.save(ankiModel, True)
        models.flush()


    @util.api()
    def updateModelStyling(self, model):
        models = self.collection().models
        ankiModel = models.byName(model['name'])
        if ankiModel is None:
            raise Exception('model was not found: {}'.format(model['name']))

        ankiModel['css'] = model['css']

        models.save(ankiModel, True)
        models.flush()


    @util.api()
    def deckNameFromId(self, deckId):
        deck = self.collection().decks.get(deckId)
        if deck is None:
            raise Exception('deck was not found: {}'.format(deckId))
        else:
            return deck['name']


    @util.api()
    def findNotes(self, query=None):
        if query is None:
            return []
        else:
            return list(map(int, self.collection().findNotes(query)))


    @util.api()
    def findCards(self, query=None):
        if query is None:
            return []
        else:
            return list(map(int, self.collection().findCards(query)))


    @util.api()
    def cardsInfo(self, cards):
        result = []
        for cid in cards:
            try:
                card = self.collection().getCard(cid)
                model = card.model()
                note = card.note()
                fields = {}
                for info in model['flds']:
                    order = info['ord']
                    name = info['name']
                    fields[name] = {'value': note.fields[order], 'order': order}

                result.append({
                    'cardId': card.id,
                    'fields': fields,
                    'fieldOrder': card.ord,
                    'question': util.getQuestion(card),
                    'answer': util.getAnswer(card),
                    'modelName': model['name'],
                    'ord': card.ord,
                    'deckName': self.deckNameFromId(card.did),
                    'css': model['css'],
                    'factor': card.factor,
                    #This factor is 10 times the ease percentage,
                    # so an ease of 310% would be reported as 3100
                    'interval': card.ivl,
                    'note': card.nid,
                    'type': card.type,
                    'queue': card.queue,
                    'due': card.due,
                    'reps': card.reps,
                    'lapses': card.lapses,
                    'left': card.left,
                })
            except TypeError as e:
                # Anki will give a TypeError if the card ID does not exist.
                # Best behavior is probably to add an 'empty card' to the
                # returned result, so that the items of the input and return
                # lists correspond.
                result.append({})

        return result


    @util.api()
    def cardReviews(self, deck, startID):
        return self.database().all("select id, cid, usn, ease, ivl, lastIvl, factor, time, type from revlog "
                                   "where id>? and cid in (select id from cards where did=?)",
                                   startID, self.decks().id(deck))

    @util.api()
    def reloadCollection(self):
        self.collection().reset()

    @util.api()
    def getLatestReviewID(self, deck):
        return self.database().scalar("select max(id) from revlog where cid in (select id from cards where did=?)",
                                      self.decks().id(deck)) or 0

    @util.api()
    def updateCompleteDeck(self, data):
        self.startEditing()
        did = self.decks().id(data["deck"])
        self.decks().flush()
        model_manager = self.collection().models
        for _, card in data["cards"].items():
            self.database().execute(
                "replace into cards (id, nid, did, ord, type, queue, due, ivl, factor, reps, lapses, left, "
                "mod, usn, odue, odid, flags, data) "
                "values (" + "?," * (12 + 6 - 1) + "?)",
                card["id"], card["nid"], did, card["ord"], card["type"], card["queue"], card["due"],
                card["ivl"], card["factor"], card["reps"], card["lapses"], card["left"],
                intTime(), -1, 0, 0, 0, 0
            )
            note = data["notes"][str(card["nid"])]
            tags = self.collection().tags.join(self.collection().tags.canonify(note["tags"]))
            self.database().execute(
                "replace into notes(id, mid, tags, flds,"
                "guid, mod, usn, flags, data, sfld, csum) values (" + "?," * (4 + 7 - 1) + "?)",
                note["id"], note["mid"], tags, joinFields(note["fields"]),
                guid64(), intTime(), -1, 0, 0, "", fieldChecksum(note["fields"][0])
            )
            model = data["models"][str(note["mid"])]
            if not model_manager.get(model["id"]):
                model_o = model_manager.new(model["name"])
                for field_name in model["fields"]:
                    field = model_manager.newField(field_name)
                    model_manager.addField(model_o, field)
                for template_name in model["templateNames"]:
                    template = model_manager.newTemplate(template_name)
                    model_manager.addTemplate(model_o, template)
                model_o["id"] = model["id"]
                model_manager.update(model_o)
                model_manager.flush()

        self.stopEditing()

    @util.api()
    def insertReviews(self, reviews):
        if len(reviews) == 0: return
        sql = "insert into revlog(id,cid,usn,ease,ivl,lastIvl,factor,time,type) values "
        for row in reviews:
            sql += "(%s)," % ",".join(map(str, row))
        sql = sql[:-1]
        self.database().execute(sql)

    @util.api()
    def notesInfo(self, notes):
        result = []
        for nid in notes:
            try:
                note = self.collection().getNote(nid)
                model = note.model()

                fields = {}
                for info in model['flds']:
                    order = info['ord']
                    name = info['name']
                    fields[name] = {'value': note.fields[order], 'order': order}

                result.append({
                    'noteId': note.id,
                    'tags' : note.tags,
                    'fields': fields,
                    'modelName': model['name'],
                    'cards': self.collection().db.list('select id from cards where nid = ? order by ord', note.id)
                })
            except TypeError as e:
                # Anki will give a TypeError if the note ID does not exist.
                # Best behavior is probably to add an 'empty card' to the
                # returned result, so that the items of the input and return
                # lists correspond.
                result.append({})

        return result


    @util.api()
    def deleteNotes(self, notes):
        try:
            self.collection().remNotes(notes)
        finally:
            self.stopEditing()




    @util.api()
    def cardsToNotes(self, cards):
        return self.collection().db.list('select distinct nid from cards where id in ' + anki.utils.ids2str(cards))


    @util.api()
    def guiBrowse(self, query=None):
        browser = aqt.dialogs.open('Browser', self.window())
        browser.activateWindow()

        if query is not None:
            browser.form.searchEdit.lineEdit().setText(query)
            if hasattr(browser, 'onSearch'):
                browser.onSearch()
            else:
                browser.onSearchActivated()

        return list(map(int, browser.model.cards))


    @util.api()
    def guiAddCards(self, note=None):

        if note is not None:
            collection = self.collection()

            deck = collection.decks.byName(note['deckName'])
            if deck is None:
                raise Exception('deck was not found: {}'.format(note['deckName']))

            self.collection().decks.select(deck['id'])
            savedMid = deck.pop('mid', None)

            model = collection.models.byName(note['modelName'])
            if model is None:
                raise Exception('model was not found: {}'.format(note['modelName']))

            self.collection().models.setCurrent(model)
            self.collection().models.update(model)

        closeAfterAdding = False
        if note is not None and 'options' in note:
            if 'closeAfterAdding' in note['options']:
                closeAfterAdding = note['options']['closeAfterAdding']
                if type(closeAfterAdding) is not bool:
                    raise Exception('option parameter \'closeAfterAdding\' must be boolean')

        addCards = None

        if closeAfterAdding:
            randomString = ''.join(random.choice(string.ascii_letters) for _ in range(10))
            windowName = 'AddCardsAndClose' + randomString

            class AddCardsAndClose(aqt.addcards.AddCards):

                def __init__(self, mw):
                    # the window must only reset if
                    # * function `onModelChange` has been called prior
                    # * window was newly opened

                    self.modelHasChanged = True
                    super().__init__(mw)

                    self.addButton.setText("Add and Close")
                    self.addButton.setShortcut(aqt.qt.QKeySequence("Ctrl+Return"))

                def _addCards(self):
                    super()._addCards()

                    # if adding was successful it must mean it was added to the history of the window
                    if len(self.history):
                        self.reject()

                def onModelChange(self):
                    if self.isActiveWindow():
                        super().onModelChange()
                        self.modelHasChanged = True

                def onReset(self, model=None, keep=False):
                    if self.isActiveWindow() or self.modelHasChanged:
                        super().onReset(model, keep)
                        self.modelHasChanged = False

                    else:
                        # modelchoosers text is changed by a reset hook
                        # therefore we need to change it back manually
                        self.modelChooser.models.setText(self.editor.note.model()['name'])
                        self.modelHasChanged = False

                def _reject(self):
                    savedMarkClosed = aqt.dialogs.markClosed
                    aqt.dialogs.markClosed = lambda _: savedMarkClosed(windowName)
                    super()._reject()
                    aqt.dialogs.markClosed = savedMarkClosed

            aqt.dialogs._dialogs[windowName] = [AddCardsAndClose, None]
            addCards = aqt.dialogs.open(windowName, self.window())

            if savedMid:
                deck['mid'] = savedMid

            editor = addCards.editor
            ankiNote = editor.note

            if 'fields' in note:
                for name, value in note['fields'].items():
                    if name in ankiNote:
                        ankiNote[name] = value
                editor.loadNote()

            if 'tags' in note:
                ankiNote.tags = note['tags']
                editor.updateTags()

            # if Anki does not Focus, the window will not notice that the
            # fields are actually filled
            aqt.dialogs.open(windowName, self.window())
            addCards.setAndFocusNote(editor.note)

            return ankiNote.id

        elif note is not None:
            collection = self.collection()
            ankiNote = anki.notes.Note(collection, model)

            # fill out card beforehand, so we can be sure of the note id
            if 'fields' in note:
                for name, value in note['fields'].items():
                    if name in ankiNote:
                        ankiNote[name] = value

            if 'tags' in note:
                ankiNote.tags = note['tags']

            def openNewWindow():
                nonlocal ankiNote

                addCards = aqt.dialogs.open('AddCards', self.window())

                if savedMid:
                    deck['mid'] = savedMid

                addCards.editor.note = ankiNote
                addCards.editor.loadNote()
                addCards.editor.updateTags()

                addCards.activateWindow()

                aqt.dialogs.open('AddCards', self.window())
                addCards.setAndFocusNote(addCards.editor.note)

            currentWindow = aqt.dialogs._dialogs['AddCards'][1]

            if currentWindow is not None:
                currentWindow.closeWithCallback(openNewWindow)
            else:
                openNewWindow()

            return ankiNote.id

        else:
            addCards = aqt.dialogs.open('AddCards', self.window())
            addCards.activateWindow()

            return addCards.editor.note.id

    @util.api()
    def guiReviewActive(self):
        return self.reviewer().card is not None and self.window().state == 'review'


    @util.api()
    def guiCurrentCard(self):
        if not self.guiReviewActive():
            raise Exception('Gui review is not currently active.')

        reviewer = self.reviewer()
        card = reviewer.card
        model = card.model()
        note = card.note()

        fields = {}
        for info in model['flds']:
            order = info['ord']
            name = info['name']
            fields[name] = {'value': note.fields[order], 'order': order}
        if card is not None:
            buttonList = reviewer._answerButtonList()
            return {
                'cardId': card.id,
                'fields': fields,
                'fieldOrder': card.ord,
                'question': util.getQuestion(card),
                'answer': util.getAnswer(card),
                'buttons': [b[0] for b in buttonList],
                'nextReviews': [reviewer.mw.col.sched.nextIvlStr(reviewer.card, b[0], True) for b in buttonList],
                'modelName': model['name'],
                'deckName': self.deckNameFromId(card.did),
                'css': model['css'],
                'template': card.template()['name']
            }


    @util.api()
    def guiStartCardTimer(self):
        if not self.guiReviewActive():
            return False

        card = self.reviewer().card

        if card is not None:
            card.startTimer()
            return True
        else:
            return False


    @util.api()
    def guiShowQuestion(self):
        if self.guiReviewActive():
            self.reviewer()._showQuestion()
            return True
        else:
            return False


    @util.api()
    def guiShowAnswer(self):
        if self.guiReviewActive():
            self.window().reviewer._showAnswer()
            return True
        else:
            return False


    @util.api()
    def guiAnswerCard(self, ease):
        if not self.guiReviewActive():
            return False

        reviewer = self.reviewer()
        if reviewer.state != 'answer':
            return False
        if ease <= 0 or ease > self.scheduler().answerButtons(reviewer.card):
            return False

        reviewer._answerCard(ease)
        return True


    @util.api()
    def guiDeckOverview(self, name):
        collection = self.collection()
        if collection is not None:
            deck = collection.decks.byName(name)
            if deck is not None:
                collection.decks.select(deck['id'])
                self.window().onOverview()
                return True

        return False


    @util.api()
    def guiDeckBrowser(self):
        self.window().moveToState('deckBrowser')


    @util.api()
    def guiDeckReview(self, name):
        if self.guiDeckOverview(name):
            self.window().moveToState('review')
            return True
        else:
            return False


    @util.api()
    def guiExitAnki(self):
        timer = QTimer()
        timer.timeout.connect(self.window().close)
        timer.start(1000) # 1s should be enough to allow the response to be sent.


    @util.api()
    def addNotes(self, notes):
        results = []
        for note in notes:
            try:
                results.append(self.addNote(note))
            except Exception:
                results.append(None)

        return results


    @util.api()
    def canAddNotes(self, notes):
        results = []
        for note in notes:
            results.append(self.canAddNote(note))

        return results


    @util.api()
    def exportPackage(self, deck, path, includeSched=False):
        collection = self.collection()
        if collection is not None:
            deck = collection.decks.byName(deck)
            if deck is not None:
                exporter = AnkiPackageExporter(collection)
                exporter.did = deck['id']
                exporter.includeSched = includeSched
                exporter.exportInto(path)
                return True
        return False

    @util.api()
    def importPackage(self, path):
        collection = self.collection()
        if collection is not None:
            try:
                self.startEditing()
                importer = AnkiPackageImporter(collection, path)
                importer.run()
            except:
                self.stopEditing()
                raise
            else:
                self.stopEditing()
                return True

        return False

#
# Entry
#

ac = PolarConnect()
