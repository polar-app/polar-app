import {expect} from 'chai';
import {SSRServer} from './SSRServer';

describe('SSRServer', function () {
    it('Validate Rendered String Contains Expected Value', async function () {
        const data = SSRServer.renderComponent();
        expect(data).to.be.a('string').that.contains('Hello server side render!');
    });

    it('Validate File Reading & Value', async function () {
        const data = await SSRServer.readIndexHTML();
        expect(data).to.be.a('string').that.contains('<!DOCTYPE html>');
    });

    it('Validate File Content Replace Using Strings Helpers', async function () {
        const data = await SSRServer.render();
        expect(data).to.be.a('string').that.contains('Hello server side render!');
    });
});
