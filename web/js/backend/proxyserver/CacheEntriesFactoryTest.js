const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const CapturedPHZWriter = require("../../capture/CapturedPHZWriter").CapturedPHZWriter;
const MockCapturedContent = require("../../capture/MockCapturedContent").MockCapturedContent;
const {assertJSON} = require('../../test/Assertions');
const {CacheEntriesFactory} = require('./CacheEntriesFactory');
require("../../test/TestingTime").freeze();

describe('CacheEntriesFactory', function() {

    describe('Load CHTML', function() {

        let path = "/tmp/test-load.chtml";

        beforeEach(function(done) {

            let data = {
                "href": "https://jakearchibald.com/2016/streams-ftw/",
                "mutations": {
                    "baseAdded": true,
                    "eventAttributesRemoved": 0,
                    "existingBaseRemoved": false,
                    "javascriptAnchorsRemoved": 0,
                    "scriptsRemoved": 11,
                    "showAriaHidden": 5
                },
                "scrollHeight": 16830,
                "title": "2016 - the year of web streams - JakeArchibald.com",
                "url": "https://jakearchibald.com/2016/streams-ftw/"
            };

            fs.writeFileSync("/tmp/test-load.json", JSON.stringify(data, null, "  "));

            fs.writeFileSync("/tmp/test-load.chtml", "<html></html>")

            done();

        });

        it("createFromCHTML", async function () {

            let cacheEntriesHolder = await CacheEntriesFactory.createFromCHTML(path);

            assertJSON(cacheEntriesHolder, {
                "cacheEntries": {
                    "url": {
                        "method": "GET",
                        "url": "http://jakearchibald.com/2016/streams-ftw/",
                        "headers": {
                            "Content-Type": "text/html"
                        },
                        "statusCode": 200,
                        "statusMessage": "OK",
                        "contentLength": null,
                        "path": "/tmp/test-load.chtml"
                    }
                },
                "metadata": {
                    "url": "http://jakearchibald.com/2016/streams-ftw/"
                }
            });

            assert.equal(cacheEntriesHolder.metadata.url, "http://jakearchibald.com/2016/streams-ftw/");

        });


        it("createEntriesFromFile", async function () {

            let cacheEntriesHolder = await CacheEntriesFactory.createEntriesFromFile(path);

            assertJSON(cacheEntriesHolder, {
                "cacheEntries": {
                    "url": {
                        "method": "GET",
                        "url": "http://jakearchibald.com/2016/streams-ftw/",
                        "headers": {
                            "Content-Type": "text/html"
                        },
                        "statusCode": 200,
                        "statusMessage": "OK",
                        "contentLength": null,
                        "path": "/tmp/test-load.chtml"
                    }
                },
                "metadata": {
                    "url": "http://jakearchibald.com/2016/streams-ftw/"
                }
            })

        });

    });

    describe('Load PHZ', function() {

        it("createFromPHZ", async function () {

            let captured = MockCapturedContent.create();

            let path = "/tmp/cached-entries-factory.phz";
            let capturedPHZWriter = new CapturedPHZWriter(path);
            await capturedPHZWriter.convert(captured);

            let cacheEntriesHolder = await CacheEntriesFactory.createFromPHZ(path);

            assertJSON(cacheEntriesHolder.metadata, {
                "title": "Unit testing node applications with TypeScript — using mocha and chai",
                "type": "chtml",
                "url": "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2",
                "version": "2.0.0",
                "browser": {
                    "name": "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750",
                    "description": "Galaxy S8 mobile device running Chrome 61 but with width at 750",
                    "userAgent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36",
                    "deviceEmulation": {
                        "screenPosition": "mobile",
                        "screenSize": {
                            "width": 750,
                            "height": 970
                        },
                        "viewSize": {
                            "width": 750,
                            "height": 970
                        }
                    }
                }
            });


            assertJSON(cacheEntriesHolder.cacheEntries, {
                "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1nQrNQ9ToKkRc3VtpCrD",
                        "path": "1nQrNQ9ToKkRc3VtpCrD.html",
                        "resource": {
                            "id": "1nQrNQ9ToKkRc3VtpCrD",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "Unit testing node applications with TypeScript — using mocha and chai",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "12jxKhQbE2wiaw8CK46d",
                        "path": "12jxKhQbE2wiaw8CK46d.html",
                        "resource": {
                            "id": "12jxKhQbE2wiaw8CK46d",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/46f0f788c01c4b194cefde2d9ec41eaf?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "install-mocha-chai-ts.sh – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/dac0a6422059288f196c2a0dd83d4f1e?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/dac0a6422059288f196c2a0dd83d4f1e?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "12pidJU3xG9ByDHBjuF2",
                        "path": "12pidJU3xG9ByDHBjuF2.html",
                        "resource": {
                            "id": "12pidJU3xG9ByDHBjuF2",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/dac0a6422059288f196c2a0dd83d4f1e?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "hello-world.ts – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/3250d51ccec4df3da4f3447892218065?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/3250d51ccec4df3da4f3447892218065?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1yvsaXXPE8HFqX8nqHkq",
                        "path": "1yvsaXXPE8HFqX8nqHkq.html",
                        "resource": {
                            "id": "1yvsaXXPE8HFqX8nqHkq",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/3250d51ccec4df3da4f3447892218065?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "hello-world.spec.ts – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/70620a582825b3f69261a46fda6f1a8f?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/70620a582825b3f69261a46fda6f1a8f?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "12biCzaQGWR3TkoJXCqE",
                        "path": "12biCzaQGWR3TkoJXCqE.html",
                        "resource": {
                            "id": "12biCzaQGWR3TkoJXCqE",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/70620a582825b3f69261a46fda6f1a8f?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "package.json – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/af8d9ace95e6e79747acd19e5e659169?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/af8d9ace95e6e79747acd19e5e659169?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "12HuKhYXpMZuiacUdYLE",
                        "path": "12HuKhYXpMZuiacUdYLE.html",
                        "resource": {
                            "id": "12HuKhYXpMZuiacUdYLE",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/af8d9ace95e6e79747acd19e5e659169?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "styles.scss – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/1332267fe1665fafdc8c0d9f8c8d5d98?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/1332267fe1665fafdc8c0d9f8c8d5d98?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1yGmrFqA5istity7DHxA",
                        "path": "1yGmrFqA5istity7DHxA.html",
                        "resource": {
                            "id": "1yGmrFqA5istity7DHxA",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/1332267fe1665fafdc8c0d9f8c8d5d98?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "hello-world.v2.ts – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/48a721a0e2b65d851322f94f6bd4d020?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/48a721a0e2b65d851322f94f6bd4d020?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1pcP3LfhvJer2hSozU9q",
                        "path": "1pcP3LfhvJer2hSozU9q.html",
                        "resource": {
                            "id": "1pcP3LfhvJer2hSozU9q",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/48a721a0e2b65d851322f94f6bd4d020?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "ignore-styles.sh – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/076fa5fbed4eb57c0501fa4cbf5855b3?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/076fa5fbed4eb57c0501fa4cbf5855b3?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "127QZ9NF9iYc4SRjY7Af",
                        "path": "127QZ9NF9iYc4SRjY7Af.html",
                        "resource": {
                            "id": "127QZ9NF9iYc4SRjY7Af",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/076fa5fbed4eb57c0501fa4cbf5855b3?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "package.v2.json – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/cfc3fc50133fc06fb8cee86ac2292ea1?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/cfc3fc50133fc06fb8cee86ac2292ea1?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1CoWEq1J7Ht5XRYCc8kJ",
                        "path": "1CoWEq1J7Ht5XRYCc8kJ.html",
                        "resource": {
                            "id": "1CoWEq1J7Ht5XRYCc8kJ",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/cfc3fc50133fc06fb8cee86ac2292ea1?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "hello-world.v3.ts – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/8d779a252338df599e9ee821cd24e492?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/8d779a252338df599e9ee821cd24e492?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1e3vmPGgpHm6JW8g3t5T",
                        "path": "1e3vmPGgpHm6JW8g3t5T.html",
                        "resource": {
                            "id": "1e3vmPGgpHm6JW8g3t5T",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/8d779a252338df599e9ee821cd24e492?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "js-dom.sh – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/5704b996be3ebc61c4f6788571c2e2ca?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/5704b996be3ebc61c4f6788571c2e2ca?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "124osN2fpJTxYbwCtN3d",
                        "path": "124osN2fpJTxYbwCtN3d.html",
                        "resource": {
                            "id": "124osN2fpJTxYbwCtN3d",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/5704b996be3ebc61c4f6788571c2e2ca?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "package.v3.json – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/264d5a80d834f9976dbec6e2fd721062?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/264d5a80d834f9976dbec6e2fd721062?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1DbJTshwbLctQDaHpGCz",
                        "path": "1DbJTshwbLctQDaHpGCz.html",
                        "resource": {
                            "id": "1DbJTshwbLctQDaHpGCz",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/264d5a80d834f9976dbec6e2fd721062?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "tsconfig.json – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/492bacc690c54aa549a96b849fa572ed?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/492bacc690c54aa549a96b849fa572ed?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "12QEXdG5oafn1ee3C1vs",
                        "path": "12QEXdG5oafn1ee3C1vs.html",
                        "resource": {
                            "id": "12QEXdG5oafn1ee3C1vs",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/492bacc690c54aa549a96b849fa572ed?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "cross-env.sh – Medium",
                            "description": null
                        }
                    }
                },
                "https://journal.artfuldev.com/media/3bae3235c7b64d8e09ceda4168c033e3?postId=384ef05f32b2": {
                    "url": "https://journal.artfuldev.com/media/3bae3235c7b64d8e09ceda4168c033e3?postId=384ef05f32b2",
                    "contentLength": null,
                    "resourceEntry": {
                        "id": "1etKzHk77ey2Pgg2n5pc",
                        "path": "1etKzHk77ey2Pgg2n5pc.html",
                        "resource": {
                            "id": "1etKzHk77ey2Pgg2n5pc",
                            "created": "2012-03-02T11:38:49.321Z",
                            "meta": {},
                            "url": "https://journal.artfuldev.com/media/3bae3235c7b64d8e09ceda4168c033e3?postId=384ef05f32b2",
                            "contentType": "text/html",
                            "method": "GET",
                            "statusCode": 200,
                            "contentLength": null,
                            "headers": {},
                            "title": "package.v4.json – Medium",
                            "description": null
                        }
                    }
                }
            });

        });

    });

});
