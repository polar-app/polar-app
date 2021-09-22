import xmlParser from "fast-xml-parser";

export function getXmlToJSON(xml: string) {
    return xmlParser.parse(xml, {
        ignoreAttributes: false,
    });
}
