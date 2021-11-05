import { expect } from "chai";
import { ReadabilityCapture } from "./ReadabilityCapture";


describe("Node capture content", () => {

    // TODO: Figure out a way to do this without doing an actual HTTP request if possible.
    it("Basic capture from URL", async () => {
        const capture = await ReadabilityCapture.captureURL("https://discord.com");

        expect(capture).to.include({
            description: 'Discord is the easiest way to talk over voice, video, and text. Talk, chat, hang out, and stay close with your friends and communities.',
            icon: 'https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico',
            image: 'https://discord.com/assets/652f40427e1f5186ad54836074898279.png',
            title: 'Discord | Your Place to Talk and Hang Out',
            language: 'en',
            type: 'website',
            url: 'https://discord.com/',
            provider: 'Discord',
            excerpt: 'Discord is the easiest way to talk over voice, video, and text. Talk, chat, hang out, and stay close with your friends and communities.'
        });
    });
});