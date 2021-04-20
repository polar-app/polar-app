/* Copyright 2020 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { loadScript } from "../../src/display/display_utils.js";

const sandboxBundleSrc = "../../build/generic/build/pdf.sandbox.js";

describe("Scripting", function () {
  let sandbox, send_queue, test_id, ref, windowAlert;

  function getId() {
    const id = `${ref++}R`;
    return id;
  }

  function myeval(code) {
    const key = (test_id++).toString();
    return sandbox.eval(code, key).then(() => {
      const result = send_queue.get(key).result;
      send_queue.delete(key);
      return result;
    });
  }

  beforeAll(function (done) {
    test_id = 0;
    ref = 1;
    send_queue = new Map();
    window.dispatchEvent = event => {
      if (event.detail.command) {
        send_queue.set(event.detail.command, event.detail);
      } else if (send_queue.has(event.detail.id)) {
        const prev = send_queue.get(event.detail.id);
        Object.assign(prev, event.detail);
      } else {
        send_queue.set(event.detail.id, event.detail);
      }
    };
    windowAlert = window.alert;
    window.alert = value => {
      const command = "alert";
      send_queue.set(command, { command, value });
    };
    const promise = loadScript(sandboxBundleSrc).then(() => {
      return window.pdfjsSandbox.QuickJSSandbox();
    });
    sandbox = {
      createSandbox(data) {
        promise.then(sbx => sbx.create(data));
      },
      dispatchEventInSandbox(data) {
        return promise.then(sbx => sbx.dispatchEvent(data));
      },
      nukeSandbox() {
        promise.then(sbx => sbx.nukeSandbox());
      },
      eval(code, key) {
        return promise.then(sbx => sbx.evalForTesting(code, key));
      },
    };
    done();
  });

  afterAll(function () {
    sandbox.nukeSandbox();
    sandbox = null;
    send_queue = null;
    window.alert = windowAlert;
  });

  describe("Sandbox", function () {
    it("should send a value, execute an action and get back a new value", async () => {
      function compute(n) {
        let s = 0;
        for (let i = 0; i < n; i++) {
          s += i;
        }
        return s;
      }
      const number = 123;
      const expected = (((number - 1) * number) / 2).toString();
      const refId = getId();

      const data = {
        objects: {
          field: [
            {
              id: refId,
              value: "",
              actions: {
                Keystroke: [
                  `${compute.toString()}event.value = compute(parseInt(event.value));`,
                ],
              },
              type: "text",
            },
          ],
        },
        calculationOrder: [],
        appInfo: { language: "en-US", platform: "Linux x86_64" },
      };
      sandbox.createSandbox(data);
      await sandbox.dispatchEventInSandbox({
        id: refId,
        value: `${number}`,
        name: "Keystroke",
        willCommit: true,
      });
      expect(send_queue.has(refId)).toEqual(true);
      expect(send_queue.get(refId)).toEqual({
        id: refId,
        valueAsString: expected,
      });
    });
  });

  describe("Doc", function () {
    it("should treat globalThis as the doc", async () => {
      const refId = getId();
      const data = {
        objects: {
          field: [
            {
              id: refId,
              value: "",
              actions: {},
              type: "text",
            },
          ],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [],
        dispatchEventName: "_dispatchMe",
      };
      sandbox.createSandbox(data);

      await myeval(`(this.foobar = 123456, 0)`);
      const value = await myeval(`this.getField("field").doc.foobar`);
      expect(value).toEqual(123456);
    });

    it("should get field using a path", async () => {
      const base = value => {
        return {
          id: getId(),
          value,
          actions: {},
          type: "text",
        };
      };
      const data = {
        objects: {
          A: [base(1)],
          "A.B": [base(2)],
          "A.B.C": [base(3)],
          "A.B.C.D": [base(4)],
          "A.B.C.D.E": [base(5)],
          "A.B.C.D.E.F": [base(6)],
          "A.B.C.D.G": [base(7)],
          C: [base(8)],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [],
        dispatchEventName: "_dispatchMe",
      };
      sandbox.createSandbox(data);

      let value = await myeval(`this.getField("A").value`);
      expect(value).toEqual(1);

      value = await myeval(`this.getField("B.C").value`);
      expect(value).toEqual(3);

      // path has been cached so try again
      value = await myeval(`this.getField("B.C").value`);
      expect(value).toEqual(3);

      value = await myeval(`this.getField("B.C.D#0").value`);
      expect(value).toEqual(5);

      value = await myeval(`this.getField("B.C.D#1").value`);
      expect(value).toEqual(7);

      value = await myeval(`this.getField("C").value`);
      expect(value).toEqual(8);

      value = await myeval(
        `this.getField("A.B.C.D").getArray().map((x) => x.value)`
      );
      expect(value).toEqual([5, 7]);
    });
  });

  describe("Util", function () {
    beforeAll(function (done) {
      sandbox.createSandbox({
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        objects: {},
        calculationOrder: [],
      });
      done();
    });

    describe("printd", function () {
      it("should print a date according to a format", async () => {
        const date = `new Date("Sun Apr 15 2007 03:14:15")`;
        let value = await myeval(`util.printd(0, ${date})`);
        expect(value).toEqual("D:20070415031415");

        value = await myeval(`util.printd(1, ${date})`);
        expect(value).toEqual("2007.04.15 03:14:15");

        value = await myeval(`util.printd(2, ${date})`);
        expect(value).toEqual("4/15/07 3:14:15 am");

        value = await myeval(`util.printd("mmmm mmm mm m", ${date})`);
        expect(value).toEqual("April Apr 04 4");

        value = await myeval(`util.printd("dddd ddd dd d", ${date})`);
        expect(value).toEqual("Sunday Sun 15 15");
      });
    });

    describe("scand", function () {
      it("should parse a date according to a format", async () => {
        const date = new Date("Sun Apr 15 2007 03:14:15");
        let value = await myeval(
          `util.scand(0, "D:20070415031415").toString()`
        );
        expect(new Date(value)).toEqual(date);

        value = await myeval(`util.scand(1, "2007.04.15 03:14:15").toString()`);
        expect(new Date(value)).toEqual(date);

        value = await myeval(`util.scand(2, "4/15/07 3:14:15 am").toString()`);
        expect(new Date(value)).toEqual(date);
      });
    });

    describe("printf", function () {
      it("should print some data according to a format", async () => {
        let value = await myeval(
          `util.printf("Integer numbers: %d, %d,...", 1.234, 56.789)`
        );
        expect(value).toEqual("Integer numbers: 1, 56,...");

        value = await myeval(
          `util.printf("Hex numbers: %x, %x,...", 1234, 56789)`
        );
        expect(value).toEqual("Hex numbers: 4D2, DDD5,...");

        value = await myeval(
          `util.printf("Hex numbers with 0x: %#x, %#x,...", 1234, 56789)`
        );
        expect(value).toEqual("Hex numbers with 0x: 0x4D2, 0xDDD5,...");

        value = await myeval(
          `util.printf("Decimal number: %,0+.3f", 1234567.89123)`
        );
        expect(value).toEqual("Decimal number: +1,234,567.891");

        value = await myeval(
          `util.printf("Decimal number: %,0+8.3f", 1.234567)`
        );
        expect(value).toEqual("Decimal number: +  1.235");

        value = await myeval(
          `util.printf("Decimal number: %,0.2f", -12.34567)`
        );
        expect(value).toEqual("Decimal number: -12.35");
      });

      it("should print a string with no argument", async () => {
        const value = await myeval(`util.printf("hello world")`);
        expect(value).toEqual("hello world");
      });

      it("print a string with a percent", async () => {
        const value = await myeval(`util.printf("%%s")`);
        expect(value).toEqual("%%s");
      });
    });

    describe("printx", function () {
      it("should print some data according to a format", async () => {
        const value = await myeval(
          `util.printx("9 (999) 999-9999", "aaa14159697489zzz")`
        );
        expect(value).toEqual("1 (415) 969-7489");
      });
    });
  });

  describe("Events", function () {
    it("should trigger an event and modify the source", async () => {
      const refId = getId();
      const data = {
        objects: {
          field: [
            {
              id: refId,
              value: "",
              actions: {
                test: [`event.source.value = "123";`],
              },
              type: "text",
            },
          ],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [],
      };
      sandbox.createSandbox(data);

      await sandbox.dispatchEventInSandbox({
        id: refId,
        value: "",
        name: "test",
        willCommit: true,
      });

      expect(send_queue.has(refId)).toEqual(true);
      expect(send_queue.get(refId)).toEqual({
        id: refId,
        value: "123",
      });
    });

    it("should trigger a Keystroke event and invalidate it", async () => {
      const refId = getId();
      const data = {
        objects: {
          field: [
            {
              id: refId,
              value: "",
              actions: {
                Keystroke: [`event.rc = false;`],
              },
              type: "text",
            },
          ],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [],
      };
      sandbox.createSandbox(data);
      await sandbox.dispatchEventInSandbox({
        id: refId,
        value: "hell",
        name: "Keystroke",
        willCommit: false,
        change: "o",
        selStart: 4,
        selEnd: 4,
      });

      expect(send_queue.has(refId)).toEqual(true);
      expect(send_queue.get(refId)).toEqual({
        id: refId,
        value: "hell",
        selRange: [4, 4],
      });
    });

    it("should trigger a Keystroke event and change it", async () => {
      const refId = getId();
      const data = {
        objects: {
          field: [
            {
              id: refId,
              value: "",
              actions: {
                Keystroke: [`event.change = "a";`],
              },
              type: "text",
            },
          ],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [],
      };
      sandbox.createSandbox(data);
      await sandbox.dispatchEventInSandbox({
        id: refId,
        value: "hell",
        name: "Keystroke",
        willCommit: false,
        change: "o",
        selStart: 4,
        selEnd: 4,
      });

      expect(send_queue.has(refId)).toEqual(true);
      expect(send_queue.get(refId)).toEqual({
        id: refId,
        value: "hella",
      });
    });

    it("should trigger an invalid commit Keystroke event", async () => {
      const refId = getId();
      const data = {
        objects: {
          field: [
            {
              id: refId,
              value: "",
              actions: {
                test: [`event.rc = false;`],
              },
              type: "text",
            },
          ],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [],
      };
      sandbox.createSandbox(data);
      await sandbox.dispatchEventInSandbox({
        id: refId,
        value: "",
        name: "test",
        willCommit: true,
      });
      expect(send_queue.has(refId)).toEqual(false);
    });

    it("should trigger a valid commit Keystroke event", async () => {
      const refId1 = getId();
      const refId2 = getId();
      const data = {
        objects: {
          field1: [
            {
              id: refId1,
              value: "",
              actions: {
                Validate: [`event.value = "world";`],
              },
              type: "text",
            },
          ],
          field2: [
            {
              id: refId2,
              value: "",
              actions: {
                Calculate: [`event.value = "hello";`],
              },
              type: "text",
            },
          ],
        },
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        calculationOrder: [refId2],
      };
      sandbox.createSandbox(data);
      await sandbox.dispatchEventInSandbox({
        id: refId1,
        value: "hello",
        name: "Keystroke",
        willCommit: true,
      });

      expect(send_queue.has(refId1)).toEqual(true);
      expect(send_queue.get(refId1)).toEqual({
        id: refId1,
        value: "world",
        valueAsString: "world",
      });
    });
  });

  describe("Color", function () {
    beforeAll(function (done) {
      sandbox.createSandbox({
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        objects: {},
        calculationOrder: [],
      });
      done();
    });

    function round(color) {
      return [
        color[0],
        ...color.slice(1).map(x => Math.round(x * 1000) / 1000),
      ];
    }

    it("should convert RGB color for different color spaces", async () => {
      let value = await myeval(`color.convert(["RGB", 0.1, 0.2, 0.3], "T")`);
      expect(round(value)).toEqual(["T"]);

      value = await myeval(`color.convert(["RGB", 0.1, 0.2, 0.3], "G")`);
      expect(round(value)).toEqual(["G", 0.181]);

      value = await myeval(`color.convert(["RGB", 0.1, 0.2, 0.3], "RGB")`);
      expect(round(value)).toEqual(["RGB", 0.1, 0.2, 0.3]);

      value = await myeval(`color.convert(["RGB", 0.1, 0.2, 0.3], "CMYK")`);
      expect(round(value)).toEqual(["CMYK", 0.9, 0.8, 0.7, 0.7]);
    });

    it("should convert CMYK color for different color spaces", async () => {
      let value = await myeval(
        `color.convert(["CMYK", 0.1, 0.2, 0.3, 0.4], "T")`
      );
      expect(round(value)).toEqual(["T"]);

      value = await myeval(`color.convert(["CMYK", 0.1, 0.2, 0.3, 0.4], "G")`);
      expect(round(value)).toEqual(["G", 0.371]);

      value = await myeval(
        `color.convert(["CMYK", 0.1, 0.2, 0.3, 0.4], "RGB")`
      );
      expect(round(value)).toEqual(["RGB", 0.5, 0.3, 0.4]);

      value = await myeval(
        `color.convert(["CMYK", 0.1, 0.2, 0.3, 0.4], "CMYK")`
      );
      expect(round(value)).toEqual(["CMYK", 0.1, 0.2, 0.3, 0.4]);
    });

    it("should convert Gray color for different color spaces", async () => {
      let value = await myeval(`color.convert(["G", 0.1], "T")`);
      expect(round(value)).toEqual(["T"]);

      value = await myeval(`color.convert(["G", 0.1], "G")`);
      expect(round(value)).toEqual(["G", 0.1]);

      value = await myeval(`color.convert(["G", 0.1], "RGB")`);
      expect(round(value)).toEqual(["RGB", 0.1, 0.1, 0.1]);

      value = await myeval(`color.convert(["G", 0.1], "CMYK")`);
      expect(round(value)).toEqual(["CMYK", 0, 0, 0, 0.9]);
    });

    it("should convert Transparent color for different color spaces", async () => {
      let value = await myeval(`color.convert(["T"], "T")`);
      expect(round(value)).toEqual(["T"]);

      value = await myeval(`color.convert(["T"], "G")`);
      expect(round(value)).toEqual(["G", 0]);

      value = await myeval(`color.convert(["T"], "RGB")`);
      expect(round(value)).toEqual(["RGB", 0, 0, 0]);

      value = await myeval(`color.convert(["T"], "CMYK")`);
      expect(round(value)).toEqual(["CMYK", 0, 0, 0, 1]);
    });
  });

  describe("App", function () {
    beforeAll(function (done) {
      sandbox.createSandbox({
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        objects: {},
        calculationOrder: [],
      });
      done();
    });

    it("should test language", async () => {
      let value = await myeval(`app.language`);
      expect(value).toEqual("ENU");

      value = await myeval(`app.language = "hello"`);
      expect(value).toEqual("app.language is read-only");
    });

    it("should test platform", async () => {
      let value = await myeval(`app.platform`);
      expect(value).toEqual("UNIX");

      value = await myeval(`app.platform = "hello"`);
      expect(value).toEqual("app.platform is read-only");
    });
  });

  describe("AForm", function () {
    beforeAll(function (done) {
      sandbox.createSandbox({
        appInfo: { language: "en-US", platform: "Linux x86_64" },
        objects: {},
        calculationOrder: [],
        dispatchEventName: "_dispatchMe",
      });
      done();
    });

    describe("AFExtractNums", function () {
      it("should extract numbers", async () => {
        let value = await myeval(`AFExtractNums("123 456 789")`);
        expect(value).toEqual(["123", "456", "789"]);

        value = await myeval(`AFExtractNums("123.456")`);
        expect(value).toEqual(["123", "456"]);

        value = await myeval(`AFExtractNums("123")`);
        expect(value).toEqual(["123"]);

        value = await myeval(`AFExtractNums(".123")`);
        expect(value).toEqual(["0", "123"]);

        value = await myeval(`AFExtractNums(",123")`);
        expect(value).toEqual(["0", "123"]);
      });
    });

    describe("AFMakeNumber", function () {
      it("should convert string to number", async () => {
        let value = await myeval(`AFMakeNumber("123.456")`);
        expect(value).toEqual(123.456);

        value = await myeval(`AFMakeNumber(123.456)`);
        expect(value).toEqual(123.456);

        value = await myeval(`AFMakeNumber("-123.456")`);
        expect(value).toEqual(-123.456);

        value = await myeval(`AFMakeNumber("-123,456")`);
        expect(value).toEqual(-123.456);

        value = await myeval(`AFMakeNumber("not a number")`);
        expect(value).toEqual(null);
      });
    });

    describe("AFMakeArrayFromList", function () {
      it("should split a string into an array of strings", async () => {
        const value = await myeval(
          `AFMakeArrayFromList("aaaa,  bbbbbbb,cc,ddd, e")`
        );
        expect(value).toEqual(["aaaa", " bbbbbbb", "cc", "ddd", "e"]);
      });
    });

    describe("AFNumber_format", function () {
      it("should format a number", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  test1: [
                    `AFNumber_Format(2, 0, 0, 0, "€", false);` +
                      `event.source.value = event.value;`,
                  ],
                  test2: [
                    `AFNumber_Format(1, 3, 0, 0, "$", true);` +
                      `event.source.value = event.value;`,
                  ],
                  test3: [
                    `AFNumber_Format(2, 0, 1, 0, "€", false);` +
                      `event.source.value = event.value;`,
                  ],
                  test4: [
                    `AFNumber_Format(2, 0, 2, 0, "€", false);` +
                      `event.source.value = event.value;`,
                  ],
                  test5: [
                    `AFNumber_Format(2, 0, 3, 0, "€", false);` +
                      `event.source.value = event.value;`,
                  ],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "123456.789",
          name: "test1",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "123,456.79€",
        });
        send_queue.delete(refId);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "223456.789",
          name: "test2",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "$223456,8",
        });
        send_queue.delete(refId);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "-323456.789",
          name: "test3",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "323,456.79€",
          textColor: ["RGB", 1, 0, 0],
        });
        send_queue.delete(refId);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "-423456.789",
          name: "test4",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "(423,456.79€)",
        });
        send_queue.delete(refId);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "-52345.678",
          name: "test5",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "(52,345.68€)",
          textColor: ["RGB", 1, 0, 0],
        });
      });
    });

    describe("AFNumber_Keystroke", function () {
      it("should validate a number on a keystroke event", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  Validate: [
                    `AFNumber_Keystroke(null, 0, null, null, null, null);`,
                  ],
                },
                type: "text",
                name: "MyField",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "123456.789",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "123456.789",
          valueAsString: "123456.789",
        });
      });

      it("should not validate a number on a keystroke event", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  Validate: [
                    `AFNumber_Keystroke(null, 0, null, null, null, null);`,
                  ],
                },
                type: "text",
                name: "MyField",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "123s456.789",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has("alert")).toEqual(true);
        expect(send_queue.get("alert")).toEqual({
          command: "alert",
          value:
            "The value entered does not match the format of the field [ MyField ]",
        });
      });
    });

    describe("AFPercent_Format", function () {
      it("should format a percentage", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  test1: [
                    `AFPercent_Format(2, 1, false);` +
                      `event.source.value = event.value;`,
                  ],
                  test2: [
                    `AFPercent_Format(2, 1, true);` +
                      `event.source.value = event.value;`,
                  ],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "0.456789",
          name: "test1",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "45.68%",
        });
        send_queue.delete(refId);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "0.456789",
          name: "test2",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "%45.68",
        });
      });
    });

    describe("AFDate_Format", function () {
      it("should format a date", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  test1: [`AFDate_Format(0);event.source.value = event.value;`],
                  test2: [
                    `AFDate_Format(12);event.source.value = event.value;`,
                  ],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "Sun Apr 15 2007 03:14:15",
          name: "test1",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "4/15",
        });
        send_queue.delete(refId);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "Sun Apr 15 2007 03:14:15",
          name: "test2",
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "4/15/07 3:14 am",
        });
      });
    });

    describe("AFRange_Validate", function () {
      it("should validate a number in range [a, b]", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  Validate: [`AFRange_Validate(true, 123, true, 456);`],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "321",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "321",
          valueAsString: "321",
        });
      });

      it("should invalidate a number out of range [a, b]", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  Validate: [`AFRange_Validate(true, 123, true, 456);`],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "12",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has("alert")).toEqual(true);
        expect(send_queue.get("alert")).toEqual({
          command: "alert",
          value:
            "Invalid value: must be greater than or equal to 123 and less than or equal to 456.",
        });
      });
    });

    describe("ASSimple_Calculate", function () {
      it("should compute the sum of several fields", async () => {
        const refIds = [0, 1, 2, 3].map(_ => getId());
        const data = {
          objects: {
            field1: [
              {
                id: refIds[0],
                value: "",
                actions: {},
                type: "text",
              },
            ],
            field2: [
              {
                id: refIds[1],
                value: "",
                actions: {},
                type: "text",
              },
            ],
            field3: [
              {
                id: refIds[2],
                value: "",
                actions: {},
                type: "text",
              },
            ],
            field4: [
              {
                id: refIds[3],
                value: "",
                actions: {
                  Calculate: [
                    `AFSimple_Calculate("SUM", ["field1", "field2", "field3"]);`,
                  ],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [refIds[3]],
          dispatchEventName: "_dispatchMe",
        };

        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refIds[0],
          value: "1",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has(refIds[3])).toEqual(true);
        expect(send_queue.get(refIds[3])).toEqual({
          id: refIds[3],
          value: 1,
          valueAsString: "1",
        });

        await sandbox.dispatchEventInSandbox({
          id: refIds[1],
          value: "2",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has(refIds[3])).toEqual(true);
        expect(send_queue.get(refIds[3])).toEqual({
          id: refIds[3],
          value: 3,
          valueAsString: "3",
        });

        await sandbox.dispatchEventInSandbox({
          id: refIds[2],
          value: "3",
          name: "Keystroke",
          willCommit: true,
        });
        expect(send_queue.has(refIds[3])).toEqual(true);
        expect(send_queue.get(refIds[3])).toEqual({
          id: refIds[3],
          value: 6,
          valueAsString: "6",
        });
      });
    });

    describe("AFSpecial_KeystrokeEx", function () {
      it("should validate a phone number on a keystroke event", async () => {
        const refId = getId();
        const data = {
          objects: {
            field: [
              {
                id: refId,
                value: "",
                actions: {
                  Keystroke: [`AFSpecial_KeystrokeEx("9AXO");`],
                },
                type: "text",
              },
            ],
          },
          appInfo: { language: "en-US", platform: "Linux x86_64" },
          calculationOrder: [],
          dispatchEventName: "_dispatchMe",
        };
        sandbox.createSandbox(data);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "",
          change: "3",
          name: "Keystroke",
          willCommit: false,
          selStart: 0,
          selEnd: 0,
        });
        expect(send_queue.has(refId)).toEqual(false);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "3",
          change: "F",
          name: "Keystroke",
          willCommit: false,
          selStart: 1,
          selEnd: 1,
        });
        expect(send_queue.has(refId)).toEqual(false);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "3F",
          change: "?",
          name: "Keystroke",
          willCommit: false,
          selStart: 2,
          selEnd: 2,
        });
        expect(send_queue.has(refId)).toEqual(false);

        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "3F?",
          change: "@",
          name: "Keystroke",
          willCommit: false,
          selStart: 3,
          selEnd: 3,
        });
        expect(send_queue.has(refId)).toEqual(true);
        expect(send_queue.get(refId)).toEqual({
          id: refId,
          value: "3F?",
          selRange: [3, 3],
        });

        send_queue.delete(refId);
        await sandbox.dispatchEventInSandbox({
          id: refId,
          value: "3F?",
          change: "0",
          name: "Keystroke",
          willCommit: true,
          selStart: 3,
          selEnd: 3,
        });
        expect(send_queue.has(refId)).toEqual(false);
      });
    });

    describe("eMailValidate", function () {
      it("should validate an e-mail address", async () => {
        let value = await myeval(`eMailValidate(123)`);
        expect(value).toEqual(false);

        value = await myeval(`eMailValidate("foo@bar.com")`);
        expect(value).toEqual(true);

        value = await myeval(`eMailValidate("foo bar")`);
        expect(value).toEqual(false);
      });
    });
  });
});
