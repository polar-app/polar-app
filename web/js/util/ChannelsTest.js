"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Channels_1 = require("./Channels");
const chai_1 = require("chai");
describe('Channels', function () {
    it('should call', function () {
        const [channel, setChannel] = Channels_1.Channels.create();
        channel('yo');
        let message;
        chai_1.assert.equal(message, undefined);
        channel('hey');
        setChannel((value) => message = value);
        channel('sup');
        chai_1.assert.equal(message, 'sup');
    });
});
//# sourceMappingURL=ChannelsTest.js.map