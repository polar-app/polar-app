"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullAsyncRunnable = exports.Ticket = exports.ActiveBatch = exports.PassiveBatch = exports.Batcher = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class Batcher {
    constructor(runnable) {
        this.tickets = [];
        this.runnable = runnable;
    }
    enqueue() {
        const ticket = new Ticket(this.runnable());
        this.tickets.push(ticket);
        if (this.tickets.length > 1) {
            const pending = this.tickets.length;
            return new PassiveBatch(pending, ticket);
        }
        return new ActiveBatch(this.tickets, this.runnable, ticket);
    }
}
exports.Batcher = Batcher;
class PassiveBatch {
    constructor(pending, ticket) {
        this.pending = pending;
        this.ticket = ticket;
    }
    run() {
        return Promise.resolve();
    }
}
exports.PassiveBatch = PassiveBatch;
class ActiveBatch {
    constructor(tickets, runnable, ticket) {
        this.batched = 0;
        this.batches = 0;
        this.ticketsPerBatch = [];
        this.tickets = tickets;
        this.runnable = runnable;
        this.ticket = ticket;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.tickets.length > 0) {
                yield this.iter();
            }
        });
    }
    iter() {
        return __awaiter(this, void 0, void 0, function* () {
            const nrTicketsToExecute = this.tickets.length;
            log.debug("Executing request for N tickets: ", nrTicketsToExecute);
            yield this.tickets[0].promise;
            const tickets = this.tickets.splice(0, nrTicketsToExecute);
            tickets.forEach(ticket => ticket.executed = true);
            this.ticketsPerBatch.push(nrTicketsToExecute);
            this.batched += nrTicketsToExecute;
            ++this.batches;
        });
    }
}
exports.ActiveBatch = ActiveBatch;
class Ticket {
    constructor(promise) {
        this.executed = false;
        this.promise = promise;
    }
}
exports.Ticket = Ticket;
function nullAsyncRunnable() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.nullAsyncRunnable = nullAsyncRunnable;
//# sourceMappingURL=Batcher.js.map