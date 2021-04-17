/* Copyright 2021 Mozilla Foundation
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

import {
  $appendChild,
  $content,
  $finalize,
  $hasItem,
  $hasSettableValue,
  $isTransparent,
  $namespaceId,
  $nodeName,
  $onChild,
  $removeChild,
  $setSetAttributes,
  $setValue,
  ContentObject,
  Option01,
  OptionObject,
  StringObject,
  XFAObject,
  XFAObjectArray,
} from "./xfa_object.js";
import { $buildXFAObject, NamespaceIds } from "./namespaces.js";
import {
  getBBox,
  getColor,
  getFloat,
  getInteger,
  getKeyword,
  getMeasurement,
  getRatio,
  getRelevant,
  getStringOption,
} from "./utils.js";
import { warn } from "../../shared/util.js";

const TEMPLATE_NS_ID = NamespaceIds.template.id;

function _setValue(templateNode, value) {
  if (!templateNode.value) {
    const nodeValue = new Value({});
    templateNode[$appendChild](nodeValue);
    templateNode.value = nodeValue;
  }
  templateNode.value[$setValue](value);
}

class AppearanceFilter extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "appearanceFilter");
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Arc extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "arc", /* hasChildren = */ true);
    this.circular = getInteger({
      data: attributes.circular,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.hand = getStringOption(attributes.hand, ["even", "left", "right"]);
    this.id = attributes.id || "";
    this.startAngle = getFloat({
      data: attributes.startAngle,
      defaultValue: 0,
      validate: x => true,
    });
    this.sweepAngle = getFloat({
      data: attributes.sweepAngle,
      defaultValue: 360,
      validate: x => true,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.edge = null;
    this.fill = null;
  }
}

class Area extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "area", /* hasChildren = */ true);
    this.colSpan = getInteger({
      data: attributes.colSpan,
      defaultValue: 1,
      validate: n => n >= 1,
    });
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.x = getMeasurement(attributes.x);
    this.y = getMeasurement(attributes.y);
    this.desc = null;
    this.extras = null;
    this.area = new XFAObjectArray();
    this.draw = new XFAObjectArray();
    this.exObject = new XFAObjectArray();
    this.exclGroup = new XFAObjectArray();
    this.field = new XFAObjectArray();
    this.subform = new XFAObjectArray();
    this.subformSet = new XFAObjectArray();
  }

  [$isTransparent]() {
    return true;
  }
}

class Assist extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "assist", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.role = attributes.role || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.speak = null;
    this.toolTip = null;
  }
}

class Barcode extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "barcode", /* hasChildren = */ true);
    this.charEncoding = getKeyword({
      data: attributes.charEncoding
        ? attributes.charEncoding.toLowerCase()
        : "",
      defaultValue: "",
      validate: k =>
        [
          "utf-8",
          "big-five",
          "fontspecific",
          "gbk",
          "gb-18030",
          "gb-2312",
          "ksc-5601",
          "none",
          "shift-jis",
          "ucs-2",
          "utf-16",
        ].includes(k) || k.match(/iso-8859-[0-9]{2}/),
    });
    this.checksum = getStringOption(attributes.checksum, [
      "none",
      "1mod10",
      "1mod10_1mod11",
      "2mod10",
      "auto",
    ]);
    this.dataColumnCount = getInteger({
      data: attributes.dataColumnCount,
      defaultValue: -1,
      validate: x => x >= 0,
    });
    this.dataLength = getInteger({
      data: attributes.dataLength,
      defaultValue: -1,
      validate: x => x >= 0,
    });
    this.dataPrep = getStringOption(attributes.dataPrep, [
      "none",
      "flateCompress",
    ]);
    this.dataRowCount = getInteger({
      data: attributes.dataRowCount,
      defaultValue: -1,
      validate: x => x >= 0,
    });
    this.endChar = attributes.endChar || "";
    this.errorCorrectionLevel = getInteger({
      data: attributes.errorCorrectionLevel,
      defaultValue: -1,
      validate: x => x >= 0 && x <= 8,
    });
    this.id = attributes.id || "";
    this.moduleHeight = getMeasurement(attributes.moduleHeight, "5mm");
    this.moduleWidth = getMeasurement(attributes.moduleWidth, "0.25mm");
    this.printCheckDigit = getInteger({
      data: attributes.printCheckDigit,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.rowColumnRatio = getRatio(attributes.rowColumnRatio);
    this.startChar = attributes.startChar || "";
    this.textLocation = getStringOption(attributes.textLocation, [
      "below",
      "above",
      "aboveEmbedded",
      "belowEmbedded",
      "none",
    ]);
    this.truncate = getInteger({
      data: attributes.truncate,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.type = getStringOption(
      attributes.type ? attributes.type.toLowerCase() : "",
      [
        "aztec",
        "codabar",
        "code2of5industrial",
        "code2of5interleaved",
        "code2of5matrix",
        "code2of5standard",
        "code3of9",
        "code3of9extended",
        "code11",
        "code49",
        "code93",
        "code128",
        "code128a",
        "code128b",
        "code128c",
        "code128sscc",
        "datamatrix",
        "ean8",
        "ean8add2",
        "ean8add5",
        "ean13",
        "ean13add2",
        "ean13add5",
        "ean13pwcd",
        "fim",
        "logmars",
        "maxicode",
        "msi",
        "pdf417",
        "pdf417macro",
        "plessey",
        "postauscust2",
        "postauscust3",
        "postausreplypaid",
        "postausstandard",
        "postukrm4scc",
        "postusdpbc",
        "postusimb",
        "postusstandard",
        "postus5zip",
        "qrcode",
        "rfid",
        "rss14",
        "rss14expanded",
        "rss14limited",
        "rss14stacked",
        "rss14stackedomni",
        "rss14truncated",
        "telepen",
        "ucc128",
        "ucc128random",
        "ucc128sscc",
        "upca",
        "upcaadd2",
        "upcaadd5",
        "upcapwcd",
        "upce",
        "upceadd2",
        "upceadd5",
        "upcean2",
        "upcean5",
        "upsmaxicode",
      ]
    );
    this.upsMode = getStringOption(attributes.upsMode, [
      "usCarrier",
      "internationalCarrier",
      "secureSymbol",
      "standardSymbol",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.wideNarrowRatio = getRatio(attributes.wideNarrowRatio);
    this.encrypt = null;
    this.extras = null;
  }
}

class Bind extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "bind", /* hasChildren = */ true);
    this.match = getStringOption(attributes.match, [
      "once",
      "dataRef",
      "global",
      "none",
    ]);
    this.ref = attributes.ref || "";
    this.picture = null;
  }
}

class BindItems extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "bindItems");
    this.connection = attributes.connection || "";
    this.labelRef = attributes.labelRef || "";
    this.ref = attributes.ref || "";
    this.valueRef = attributes.valueRef || "";
  }
}

class Bookend extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "bookend");
    this.id = attributes.id || "";
    this.leader = attributes.leader || "";
    this.trailer = attributes.trailer || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class BooleanElement extends Option01 {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "boolean");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Border extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "border", /* hasChildren = */ true);
    this.break = getStringOption(attributes.break, ["close", "open"]);
    this.hand = getStringOption(attributes.hand, ["even", "left", "right"]);
    this.id = attributes.id || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.corner = new XFAObjectArray(4);
    this.edge = new XFAObjectArray(4);
    this.extras = null;
    this.fill = null;
    this.margin = null;
  }
}

class Break extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "break", /* hasChildren = */ true);
    this.after = getStringOption(attributes.after, [
      "auto",
      "contentArea",
      "pageArea",
      "pageEven",
      "pageOdd",
    ]);
    this.afterTarget = attributes.afterTarget || "";
    this.before = getStringOption(attributes.before, [
      "auto",
      "contentArea",
      "pageArea",
      "pageEven",
      "pageOdd",
    ]);
    this.beforeTarget = attributes.beforeTarget || "";
    this.bookendLeader = attributes.bookendLeader || "";
    this.bookendTrailer = attributes.bookendTrailer || "";
    this.id = attributes.id || "";
    this.overflowLeader = attributes.overflowLeader || "";
    this.overflowTarget = attributes.overflowTarget || "";
    this.overflowTrailer = attributes.overflowTrailer || "";
    this.startNew = getInteger({
      data: attributes.startNew,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class BreakAfter extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "breakAfter", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.leader = attributes.leader || "";
    this.startNew = getInteger({
      data: attributes.startNew,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.target = attributes.target || "";
    this.targetType = getStringOption(attributes.targetType, [
      "auto",
      "contentArea",
      "pageArea",
      "pageEven",
      "pageOdd",
    ]);
    this.trailer = attributes.trailer || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.script = null;
  }
}

class BreakBefore extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "breakBefore", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.leader = attributes.leader || "";
    this.startNew = getInteger({
      data: attributes.startNew,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.target = attributes.target || "";
    this.targetType = getStringOption(attributes.targetType, [
      "auto",
      "contentArea",
      "pageArea",
      "pageEven",
      "pageOdd",
    ]);
    this.trailer = attributes.trailer || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.script = null;
  }
}

class Button extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "button", /* hasChildren = */ true);
    this.highlight = getStringOption(attributes.highlight, [
      "inverted",
      "none",
      "outline",
      "push",
    ]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class Calculate extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "calculate", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.override = getStringOption(attributes.override, [
      "disabled",
      "error",
      "ignore",
      "warning",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.message = null;
    this.script = null;
  }
}

class Caption extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "caption", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.placement = getStringOption(attributes.placement, [
      "left",
      "bottom",
      "inline",
      "right",
      "top",
    ]);
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.reserve = getMeasurement(attributes.reserve);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.font = null;
    this.margin = null;
    this.para = null;
    this.value = null;
  }

  [$setValue](value) {
    _setValue(this, value);
  }
}

class Certificate extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "certificate");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Certificates extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "certificates", /* hasChildren = */ true);
    this.credentialServerPolicy = getStringOption(
      attributes.credentialServerPolicy,
      ["optional", "required"]
    );
    this.id = attributes.id || "";
    this.url = attributes.url || "";
    this.urlPolicy = attributes.urlPolicy || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.encryption = null;
    this.issuers = null;
    this.keyUsage = null;
    this.oids = null;
    this.signing = null;
    this.subjectDNs = null;
  }
}

class CheckButton extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "checkButton", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.mark = getStringOption(attributes.mark, [
      "default",
      "check",
      "circle",
      "cross",
      "diamond",
      "square",
      "star",
    ]);
    this.shape = getStringOption(attributes.shape, ["square", "round"]);
    this.size = getMeasurement(attributes.size, "10pt");
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.extras = null;
    this.margin = null;
  }
}

class ChoiceList extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "choiceList", /* hasChildren = */ true);
    this.commitOn = getStringOption(attributes.commitOn, ["select", "exit"]);
    this.id = attributes.id || "";
    this.open = getStringOption(attributes.open, [
      "userControl",
      "always",
      "multiSelect",
      "onEntry",
    ]);
    this.textEntry = getInteger({
      data: attributes.textEntry,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.extras = null;
    this.margin = null;
  }
}

class Color extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "color", /* hasChildren = */ true);
    this.cSpace = getStringOption(attributes.cSpace, ["SRGB"]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.value = getColor(attributes.value);
    this.extras = null;
  }

  [$hasSettableValue]() {
    return false;
  }
}

class Comb extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "comb");
    this.id = attributes.id || "";
    this.numberOfCells = getInteger({
      data: attributes.numberOfCells,
      defaultValue: 0,
      validate: x => x >= 0,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Connect extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "connect", /* hasChildren = */ true);
    this.connection = attributes.connection || "";
    this.id = attributes.id || "";
    this.ref = attributes.ref || "";
    this.usage = getStringOption(attributes.usage, [
      "exportAndImport",
      "exportOnly",
      "importOnly",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.picture = null;
  }
}

class ContentArea extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "contentArea", /* hasChildren = */ true);
    this.h = getMeasurement(attributes.h);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.w = getMeasurement(attributes.w);
    this.x = getMeasurement(attributes.x);
    this.y = getMeasurement(attributes.y);
    this.desc = null;
    this.extras = null;
  }
}

class Corner extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "corner", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.inverted = getInteger({
      data: attributes.inverted,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.join = getStringOption(attributes.join, ["square", "round"]);
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.radius = getMeasurement(attributes.radius);
    this.stroke = getStringOption(attributes.stroke, [
      "solid",
      "dashDot",
      "dashDotDot",
      "dashed",
      "dotted",
      "embossed",
      "etched",
      "lowered",
      "raised",
    ]);
    this.thickness = getMeasurement(attributes.thickness, "0.5pt");
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;
  }

  [$finalize]() {
    this.color = this.color || getColor(null, [0, 0, 0]);
  }
}

class Date extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "date");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    this[$content] = new Date(this[$content].trim());
  }
}

class DateTime extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "dateTime");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    this[$content] = new Date(this[$content].trim());
  }
}

class DateTimeEdit extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "dateTimeEdit", /* hasChildren = */ true);
    this.hScrollPolicy = getStringOption(attributes.hScrollPolicy, [
      "auto",
      "off",
      "on",
    ]);
    this.id = attributes.id || "";
    this.picker = getStringOption(attributes.picker, ["host", "none"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.comb = null;
    this.extras = null;
    this.margin = null;
  }
}

class Decimal extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "decimal");
    this.fracDigits = getInteger({
      data: attributes.fracDigits,
      defaultValue: 2,
      validate: x => true,
    });
    this.id = attributes.id || "";
    this.leadDigits = getInteger({
      data: attributes.leadDigits,
      defaultValue: -1,
      validate: x => true,
    });
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    const number = parseFloat(this[$content].trim());
    this[$content] = isNaN(number) ? null : number;
  }
}

class DefaultUi extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "defaultUi", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class Desc extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "desc", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.boolean = new XFAObjectArray();
    this.date = new XFAObjectArray();
    this.dateTime = new XFAObjectArray();
    this.decimal = new XFAObjectArray();
    this.exData = new XFAObjectArray();
    this.float = new XFAObjectArray();
    this.image = new XFAObjectArray();
    this.integer = new XFAObjectArray();
    this.text = new XFAObjectArray();
    this.time = new XFAObjectArray();
  }
}

class DigestMethod extends OptionObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "digestMethod", [
      "",
      "SHA1",
      "SHA256",
      "SHA512",
      "RIPEMD160",
    ]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class DigestMethods extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "digestMethods", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.digestMethod = new XFAObjectArray();
  }
}

class Draw extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "draw", /* hasChildren = */ true);
    this.anchorType = getStringOption(attributes.anchorType, [
      "topLeft",
      "bottomCenter",
      "bottomLeft",
      "bottomRight",
      "middleCenter",
      "middleLeft",
      "middleRight",
      "topCenter",
      "topRight",
    ]);
    this.colSpan = getInteger({
      data: attributes.colSpan,
      defaultValue: 1,
      validate: x => x >= 1,
    });
    this.h = getMeasurement(attributes.h);
    this.hAlign = getStringOption(attributes.hAlign, [
      "left",
      "center",
      "justify",
      "justifyAll",
      "radix",
      "right",
    ]);
    this.id = attributes.id || "";
    this.locale = attributes.locale || "";
    this.maxH = getMeasurement(attributes.maxH);
    this.maxW = getMeasurement(attributes.maxW);
    this.minH = getMeasurement(attributes.minH);
    this.minW = getMeasurement(attributes.minW);
    this.name = attributes.name || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.rotate = getFloat({
      data: attributes.rotate,
      defaultValue: 0,
      validate: x => true,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.w = getMeasurement(attributes.w);
    this.x = getMeasurement(attributes.x);
    this.y = getMeasurement(attributes.y);
    this.assist = null;
    this.border = null;
    this.caption = null;
    this.desc = null;
    this.extras = null;
    this.font = null;
    this.keep = null;
    this.margin = null;
    this.para = null;
    this.traversal = null;
    this.ui = null;
    this.value = null;
    this.setProperty = new XFAObjectArray();
  }

  [$setValue](value) {
    _setValue(this, value);
  }
}

class Edge extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "edge", /* hasChildren = */ true);
    this.cap = getStringOption(attributes.cap, ["square", "butt", "round"]);
    this.id = attributes.id || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.stroke = getStringOption(attributes.stroke, [
      "solid",
      "dashDot",
      "dashDotDot",
      "dashed",
      "dotted",
      "embossed",
      "etched",
      "lowered",
      "raised",
    ]);
    this.thickness = getMeasurement(attributes.thickness, "0.5pt");
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;
  }

  [$finalize]() {
    this.color = this.color || getColor(null, [0, 0, 0]);
  }
}

class Encoding extends OptionObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encoding", [
      "adbe.x509.rsa_sha1",
      "adbe.pkcs7.detached",
      "adbe.pkcs7.sha1",
    ]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Encodings extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encodings", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.encoding = new XFAObjectArray();
  }
}

class Encrypt extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encrypt", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.certificate = null;
  }
}

class EncryptData extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encryptData", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.operation = getStringOption(attributes.operation, [
      "encrypt",
      "decrypt",
    ]);
    this.target = attributes.target || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.filter = null;
    this.manifest = null;
  }
}

class Encryption extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encryption", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.certificate = new XFAObjectArray();
  }
}

class EncryptionMethod extends OptionObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encryptionMethod", [
      "",
      "AES256-CBC",
      "TRIPLEDES-CBC",
      "AES128-CBC",
      "AES192-CBC",
    ]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class EncryptionMethods extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "encryptionMethods", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.encryptionMethod = new XFAObjectArray();
  }
}

class Event extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "event", /* hasChildren = */ true);
    this.activity = getStringOption(attributes.activity, [
      "click",
      "change",
      "docClose",
      "docReady",
      "enter",
      "exit",
      "full",
      "indexChange",
      "initialize",
      "mouseDown",
      "mouseEnter",
      "mouseExit",
      "mouseUp",
      "postExecute",
      "postOpen",
      "postPrint",
      "postSave",
      "postSign",
      "postSubmit",
      "preExecute",
      "preOpen",
      "prePrint",
      "preSave",
      "preSign",
      "preSubmit",
      "ready",
      "validationState",
    ]);
    this.id = attributes.id || "";
    this.listen = getStringOption(attributes.listen, [
      "refOnly",
      "refAndDescendents",
    ]);
    this.name = attributes.name || "";
    this.ref = attributes.ref || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;

    // One-of properties
    this.encryptData = null;
    this.execute = null;
    this.script = null;
    this.signData = null;
    this.submit = null;
  }
}

class ExData extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "exData");
    this.contentType = attributes.contentType || "";
    this.href = attributes.href || "";
    this.id = attributes.id || "";
    this.maxLength = getInteger({
      data: attributes.maxLength,
      defaultValue: -1,
      validate: x => x >= -1,
    });
    this.name = attributes.name || "";
    this.rid = attributes.rid || "";
    this.transferEncoding = getStringOption(attributes.transferEncoding, [
      "none",
      "base64",
      "package",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$onChild](child) {
    if (
      this.contentType === "text/html" &&
      child[$namespaceId] === NamespaceIds.xhtml.id
    ) {
      this[$content] = child;
      return true;
    }

    if (this.contentType === "text/xml") {
      this[$content] = child;
      return true;
    }

    return false;
  }
}

class ExObject extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "exObject", /* hasChildren = */ true);
    this.archive = attributes.archive || "";
    this.classId = attributes.classId || "";
    this.codeBase = attributes.codeBase || "";
    this.codeType = attributes.codeType || "";
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.boolean = new XFAObjectArray();
    this.date = new XFAObjectArray();
    this.dateTime = new XFAObjectArray();
    this.decimal = new XFAObjectArray();
    this.exData = new XFAObjectArray();
    this.exObject = new XFAObjectArray();
    this.float = new XFAObjectArray();
    this.image = new XFAObjectArray();
    this.integer = new XFAObjectArray();
    this.text = new XFAObjectArray();
    this.time = new XFAObjectArray();
  }
}

class ExclGroup extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "exclGroup", /* hasChildren = */ true);
    this.access = getStringOption(attributes.access, [
      "open",
      "nonInteractive",
      "protected",
      "readOnly",
    ]);
    this.accessKey = attributes.accessKey || "";
    this.anchorType = getStringOption(attributes.anchorType, [
      "topLeft",
      "bottomCenter",
      "bottomLeft",
      "bottomRight",
      "middleCenter",
      "middleLeft",
      "middleRight",
      "topCenter",
      "topRight",
    ]);
    this.colSpan = getInteger({
      data: attributes.colSpan,
      defaultValue: 1,
      validate: x => x >= 1,
    });
    this.h = getMeasurement(attributes.h);
    this.hAlign = getStringOption(attributes.hAlign, [
      "left",
      "center",
      "justify",
      "justifyAll",
      "radix",
      "right",
    ]);
    this.id = attributes.id || "";
    this.layout = getStringOption(attributes.layout, [
      "position",
      "lr-tb",
      "rl-row",
      "rl-tb",
      "row",
      "table",
      "tb",
    ]);
    this.maxH = getMeasurement(attributes.maxH);
    this.maxW = getMeasurement(attributes.maxW);
    this.minH = getMeasurement(attributes.minH);
    this.minW = getMeasurement(attributes.minW);
    this.name = attributes.name || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.w = getMeasurement(attributes.w);
    this.x = getMeasurement(attributes.x);
    this.y = getMeasurement(attributes.y);
    this.assist = null;
    this.bind = null;
    this.border = null;
    this.calculate = null;
    this.caption = null;
    this.desc = null;
    this.extras = null;
    this.margin = null;
    this.para = null;
    this.traversal = null;
    this.validate = null;
    this.connect = new XFAObjectArray();
    this.event = new XFAObjectArray();
    this.field = new XFAObjectArray();
    this.setProperty = new XFAObjectArray();
  }

  [$hasSettableValue]() {
    return true;
  }

  [$setValue](value) {
    for (const field of this.field.children) {
      if (!field.value) {
        const nodeValue = new Value({});
        field[$appendChild](nodeValue);
        field.value = nodeValue;
      }

      const nodeBoolean = new BooleanElement({});
      nodeBoolean[$content] = 0;

      for (const item of field.items.children) {
        if (item[$hasItem](value)) {
          nodeBoolean[$content] = 1;
          break;
        }
      }

      field.value[$setValue](nodeBoolean);
    }
  }
}

class Execute extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "execute");
    this.connection = attributes.connection || "";
    this.executeType = getStringOption(attributes.executeType, [
      "import",
      "remerge",
    ]);
    this.id = attributes.id || "";
    this.runAt = getStringOption(attributes.runAt, [
      "client",
      "both",
      "server",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Extras extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "extras", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.boolean = new XFAObjectArray();
    this.date = new XFAObjectArray();
    this.dateTime = new XFAObjectArray();
    this.decimal = new XFAObjectArray();
    this.exData = new XFAObjectArray();
    this.extras = new XFAObjectArray();
    this.float = new XFAObjectArray();
    this.image = new XFAObjectArray();
    this.integer = new XFAObjectArray();
    this.text = new XFAObjectArray();
    this.time = new XFAObjectArray();
  }
}

class Field extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "field", /* hasChildren = */ true);
    this.access = getStringOption(attributes.access, [
      "open",
      "nonInteractive",
      "protected",
      "readOnly",
    ]);
    this.accessKey = attributes.accessKey || "";
    this.anchorType = getStringOption(attributes.anchorType, [
      "topLeft",
      "bottomCenter",
      "bottomLeft",
      "bottomRight",
      "middleCenter",
      "middleLeft",
      "middleRight",
      "topCenter",
      "topRight",
    ]);
    this.colSpan = getInteger({
      data: attributes.colSpan,
      defaultValue: 1,
      validate: x => x >= 1,
    });
    this.h = getMeasurement(attributes.h);
    this.hAlign = getStringOption(attributes.hAlign, [
      "left",
      "center",
      "justify",
      "justifyAll",
      "radix",
      "right",
    ]);
    this.id = attributes.id || "";
    this.locale = attributes.locale || "";
    this.maxH = getMeasurement(attributes.maxH);
    this.maxW = getMeasurement(attributes.maxW);
    this.minH = getMeasurement(attributes.minH);
    this.minW = getMeasurement(attributes.minW);
    this.name = attributes.name || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.rotate = getStringOption(attributes.rotate, ["0", "angle"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.w = getMeasurement(attributes.w);
    this.x = getMeasurement(attributes.x);
    this.y = getMeasurement(attributes.y);
    this.assist = null;
    this.bind = null;
    this.border = null;
    this.calculate = null;
    this.caption = null;
    this.desc = null;
    this.extras = null;
    this.font = null;
    this.format = null;
    // For a choice list, one list is used to have display entries
    // and the other for the exported values
    this.items = new XFAObjectArray(2);
    this.keep = null;
    this.margin = null;
    this.para = null;
    this.traversal = null;
    this.ui = null;
    this.validate = null;
    this.value = null;
    this.bindItems = new XFAObjectArray();
    this.connect = new XFAObjectArray();
    this.event = new XFAObjectArray();
    this.setProperty = new XFAObjectArray();
  }

  [$setValue](value) {
    _setValue(this, value);
  }
}

class Fill extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "fill", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;

    // One-of properties
    this.linear = null;
    this.pattern = null;
    this.radial = null;
    this.solid = null;
    this.stipple = null;
  }
}

class Filter extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "filter", /* hasChildren = */ true);
    this.addRevocationInfo = getStringOption(attributes.addRevocationInfo, [
      "",
      "required",
      "optional",
      "none",
    ]);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.version = getInteger({
      data: this.version,
      defaultValue: 5,
      validate: x => x >= 1 && x <= 5,
    });
    this.appearanceFilter = null;
    this.certificates = null;
    this.digestMethods = null;
    this.encodings = null;
    this.encryptionMethods = null;
    this.handler = null;
    this.lockDocument = null;
    this.mdp = null;
    this.reasons = null;
    this.timeStamp = null;
  }
}

class Float extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "float");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    const number = parseFloat(this[$content].trim());
    this[$content] = isNaN(number) ? null : number;
  }
}

class Font extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "font", /* hasChildren = */ true);
    this.baselineShift = getMeasurement(attributes.baselineShift);
    this.fontHorizontalScale = getFloat({
      data: attributes.fontHorizontalScale,
      defaultValue: 100,
      validate: x => x >= 0,
    });
    this.fontVerticalScale = getFloat({
      data: attributes.fontVerticalScale,
      defaultValue: 100,
      validate: x => x >= 0,
    });
    this.id = attributes.id || "";
    this.kerningMode = getStringOption(attributes.kerningMode, [
      "none",
      "pair",
    ]);
    this.letterSpacing = getMeasurement(attributes.letterSpacing, "0");
    this.lineThrough = getInteger({
      data: attributes.lineThrough,
      defaultValue: 0,
      validate: x => x === 1 || x === 2,
    });
    this.lineThroughPeriod = getStringOption(attributes.lineThroughPeriod, [
      "all",
      "word",
    ]);
    this.overline = getInteger({
      data: attributes.overline,
      defaultValue: 0,
      validate: x => x === 1 || x === 2,
    });
    this.overlinePeriod = getStringOption(attributes.overlinePeriod, [
      "all",
      "word",
    ]);
    this.posture = getStringOption(attributes.posture, ["normal", "italic"]);
    this.size = getMeasurement(attributes.size, "10pt");
    this.typeface = attributes.typeface || "";
    this.underline = getInteger({
      data: attributes.underline,
      defaultValue: 0,
      validate: x => x === 1 || x === 2,
    });
    this.underlinePeriod = getStringOption(attributes.underlinePeriod, [
      "all",
      "word",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.weight = getStringOption(attributes.weight, ["normal", "bold"]);
    this.extras = null;
    this.fill = null;
  }
}

class Format extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "format", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.picture = null;
  }
}

class Handler extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "handler");
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Hyphenation extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "hyphenation");
    this.excludeAllCaps = getInteger({
      data: attributes.excludeAllCaps,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.excludeInitialCap = getInteger({
      data: attributes.excludeInitialCap,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.hyphenate = getInteger({
      data: attributes.hyphenate,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.id = attributes.id || "";
    this.pushCharacterCount = getInteger({
      data: attributes.pushCharacterCount,
      defaultValue: 3,
      validate: x => x >= 0,
    });
    this.remainCharacterCount = getInteger({
      data: attributes.remainCharacterCount,
      defaultValue: 3,
      validate: x => x >= 0,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.wordCharacterCount = getInteger({
      data: attributes.wordCharacterCount,
      defaultValue: 7,
      validate: x => x >= 0,
    });
  }
}

class Image extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "image");
    this.aspect = getStringOption(attributes.aspect, [
      "fit",
      "actual",
      "height",
      "none",
      "width",
    ]);
    this.contentType = attributes.contentType || "";
    this.href = attributes.href || "";
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.transferEncoding = getStringOption(attributes.transferEncoding, [
      "base64",
      "none",
      "package",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class ImageEdit extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "imageEdit", /* hasChildren = */ true);
    this.data = getStringOption(attributes.data, ["link", "embed"]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.extras = null;
    this.margin = null;
  }
}

class Integer extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "integer");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    const number = parseInt(this[$content].trim(), 10);
    this[$content] = isNaN(number) ? null : number;
  }
}

class Issuers extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "issuers", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.certificate = new XFAObjectArray();
  }
}

class Items extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "items", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.ref = attributes.ref || "";
    this.save = getInteger({
      data: attributes.save,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.boolean = new XFAObjectArray();
    this.date = new XFAObjectArray();
    this.dateTime = new XFAObjectArray();
    this.decimal = new XFAObjectArray();
    this.exData = new XFAObjectArray();
    this.float = new XFAObjectArray();
    this.image = new XFAObjectArray();
    this.integer = new XFAObjectArray();
    this.text = new XFAObjectArray();
    this.time = new XFAObjectArray();
  }

  [$hasItem](value) {
    return (
      this.hasOwnProperty(value[$nodeName]) &&
      this[value[$nodeName]].children.some(
        node => node[$content] === value[$content]
      )
    );
  }
}

class Keep extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "keep", /* hasChildren = */ true);
    this.id = attributes.id || "";
    const options = ["none", "contentArea", "pageArea"];
    this.intact = getStringOption(attributes.intact, options);
    this.next = getStringOption(attributes.next, options);
    this.previous = getStringOption(attributes.previous, options);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class KeyUsage extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "keyUsage");
    const options = ["", "yes", "no"];
    this.crlSign = getStringOption(attributes.crlSign, options);
    this.dataEncipherment = getStringOption(
      attributes.dataEncipherment,
      options
    );
    this.decipherOnly = getStringOption(attributes.decipherOnly, options);
    this.digitalSignature = getStringOption(
      attributes.digitalSignature,
      options
    );
    this.encipherOnly = getStringOption(attributes.encipherOnly, options);
    this.id = attributes.id || "";
    this.keyAgreement = getStringOption(attributes.keyAgreement, options);
    this.keyCertSign = getStringOption(attributes.keyCertSign, options);
    this.keyEncipherment = getStringOption(attributes.keyEncipherment, options);
    this.nonRepudiation = getStringOption(attributes.nonRepudiation, options);
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Line extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "line", /* hasChildren = */ true);
    this.hand = getStringOption(attributes.hand, ["even", "left", "right"]);
    this.id = attributes.id || "";
    this.slope = getStringOption(attributes.slope, ["\\", "/"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.edge = null;
  }
}

class Linear extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "linear", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, [
      "toRight",
      "toBottom",
      "toLeft",
      "toTop",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;
  }
}

class LockDocument extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "lockDocument");
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    this[$content] = getStringOption(this[$content], ["auto", "0", "1"]);
  }
}

class Manifest extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "manifest", /* hasChildren = */ true);
    this.action = getStringOption(attributes.action, [
      "include",
      "all",
      "exclude",
    ]);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.ref = new XFAObjectArray();
  }
}

class Margin extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "margin", /* hasChildren = */ true);
    this.bottomInset = getMeasurement(attributes.bottomInset, "0");
    this.id = attributes.id || "";
    this.leftInset = getMeasurement(attributes.leftInset, "0");
    this.rightInset = getMeasurement(attributes.rightInset, "0");
    this.topInset = getMeasurement(attributes.topInset, "0");
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class Mdp extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "mdp");
    this.id = attributes.id || "";
    this.permissions = getInteger({
      data: attributes.permissions,
      defaultValue: 2,
      validate: x => x === 1 || x === 3,
    });
    this.signatureType = getStringOption(attributes.signatureType, [
      "filler",
      "author",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Medium extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "medium");
    this.id = attributes.id || "";
    this.imagingBBox = getBBox(attributes.imagingBBox);
    this.long = getMeasurement(attributes.long);
    this.orientation = getStringOption(attributes.orientation, [
      "portrait",
      "landscape",
    ]);
    this.short = getMeasurement(attributes.short);
    this.stock = attributes.stock || "";
    this.trayIn = getStringOption(attributes.trayIn, [
      "auto",
      "delegate",
      "pageFront",
    ]);
    this.trayOut = getStringOption(attributes.trayOut, ["auto", "delegate"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Message extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "message", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.text = new XFAObjectArray();
  }
}

class NumericEdit extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "numericEdit", /* hasChildren = */ true);
    this.hScrollPolicy = getStringOption(attributes.hScrollPolicy, [
      "auto",
      "off",
      "on",
    ]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.comb = null;
    this.extras = null;
    this.margin = null;
  }
}

class Occur extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "occur", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.initial = getInteger({
      data: attributes.initial,
      defaultValue: 1,
      validate: x => true,
    });
    this.max = getInteger({
      data: attributes.max,
      defaultValue: 1,
      validate: x => true,
    });
    this.min = getInteger({
      data: attributes.min,
      defaultValue: 1,
      validate: x => true,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class Oid extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "oid");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Oids extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "oids", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.oid = new XFAObjectArray();
  }
}

class Overflow extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "overflow");
    this.id = attributes.id || "";
    this.leader = attributes.leader || "";
    this.target = attributes.target || "";
    this.trailer = attributes.trailer || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class PageArea extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "pageArea", /* hasChildren = */ true);
    this.blankOrNotBlank = getStringOption(attributes.blankOrNotBlank, [
      "any",
      "blank",
      "notBlank",
    ]);
    this.id = attributes.id || "";
    this.initialNumber = getInteger({
      data: attributes.initialNumber,
      defaultValue: 1,
      validate: x => true,
    });
    this.name = attributes.name || "";
    this.numbered = getInteger({
      data: attributes.numbered,
      defaultValue: 1,
      validate: x => true,
    });
    this.oddOrEven = getStringOption(attributes.oddOrEven, [
      "any",
      "even",
      "odd",
    ]);
    this.pagePosition = getStringOption(attributes.pagePosition, [
      "any",
      "first",
      "last",
      "only",
      "rest",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.desc = null;
    this.extras = null;
    this.medium = null;
    this.occur = null;
    this.area = new XFAObjectArray();
    this.contentArea = new XFAObjectArray();
    this.draw = new XFAObjectArray();
    this.exclGroup = new XFAObjectArray();
    this.field = new XFAObjectArray();
    this.subform = new XFAObjectArray();
  }
}

class PageSet extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "pageSet", /* hasChildren = */ true);
    this.duplexImposition = getStringOption(attributes.duplexImposition, [
      "longEdge",
      "shortEdge",
    ]);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.relation = getStringOption(attributes.relation, [
      "orderedOccurrence",
      "duplexPaginated",
      "simplexPaginated",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.occur = null;
    this.pageArea = new XFAObjectArray();
    this.pageSet = new XFAObjectArray();
  }
}

class Para extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "para", /* hasChildren = */ true);
    this.hAlign = getStringOption(attributes.hAlign, [
      "left",
      "center",
      "justify",
      "justifyAll",
      "radix",
      "right",
    ]);
    this.id = attributes.id || "";
    this.lineHeight = getMeasurement(attributes.lineHeight, "0pt");
    this.marginLeft = getMeasurement(attributes.marginLeft, "0");
    this.marginRight = getMeasurement(attributes.marginRight, "0");
    this.orphans = getInteger({
      data: attributes.orphans,
      defaultValue: 0,
      validate: x => x >= 0,
    });
    this.preserve = attributes.preserve || "";
    this.radixOffset = getMeasurement(attributes.radixOffset, "0");
    this.spaceAbove = getMeasurement(attributes.spaceAbove, "0");
    this.spaceBelow = getMeasurement(attributes.spaceBelow, "0");
    this.tabDefault = attributes.tabDefault
      ? getMeasurement(this.tabDefault)
      : null;
    this.tabStops = (attributes.tabStops || "")
      .trim()
      .split(/\s+/)
      .map((x, i) => (i % 2 === 1 ? getMeasurement(x) : x));
    this.textIndent = getMeasurement(attributes.textIndent, "0");
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.vAlign = getStringOption(attributes.vAlign, [
      "top",
      "bottom",
      "middle",
    ]);
    this.widows = getInteger({
      data: attributes.widows,
      defaultValue: 0,
      validate: x => x >= 0,
    });
    this.hyphenation = null;
  }
}

class PasswordEdit extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "passwordEdit", /* hasChildren = */ true);
    this.hScrollPolicy = getStringOption(attributes.hScrollPolicy, [
      "auto",
      "off",
      "on",
    ]);
    this.id = attributes.id || "";
    this.passwordChar = attributes.passwordChar || "*";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.extras = null;
    this.margin = null;
  }
}

class Pattern extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "pattern", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, [
      "crossHatch",
      "crossDiagonal",
      "diagonalLeft",
      "diagonalRight",
      "horizontal",
      "vertical",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;
  }
}

class Picture extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "picture");
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Proto extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "proto", /* hasChildren = */ true);
    this.appearanceFilter = new XFAObjectArray();
    this.arc = new XFAObjectArray();
    this.area = new XFAObjectArray();
    this.assist = new XFAObjectArray();
    this.barcode = new XFAObjectArray();
    this.bindItems = new XFAObjectArray();
    this.bookend = new XFAObjectArray();
    this.boolean = new XFAObjectArray();
    this.border = new XFAObjectArray();
    this.break = new XFAObjectArray();
    this.breakAfter = new XFAObjectArray();
    this.breakBefore = new XFAObjectArray();
    this.button = new XFAObjectArray();
    this.calculate = new XFAObjectArray();
    this.caption = new XFAObjectArray();
    this.certificate = new XFAObjectArray();
    this.certificates = new XFAObjectArray();
    this.checkButton = new XFAObjectArray();
    this.choiceList = new XFAObjectArray();
    this.color = new XFAObjectArray();
    this.comb = new XFAObjectArray();
    this.connect = new XFAObjectArray();
    this.contentArea = new XFAObjectArray();
    this.corner = new XFAObjectArray();
    this.date = new XFAObjectArray();
    this.dateTime = new XFAObjectArray();
    this.dateTimeEdit = new XFAObjectArray();
    this.decimal = new XFAObjectArray();
    this.defaultUi = new XFAObjectArray();
    this.desc = new XFAObjectArray();
    this.digestMethod = new XFAObjectArray();
    this.digestMethods = new XFAObjectArray();
    this.draw = new XFAObjectArray();
    this.edge = new XFAObjectArray();
    this.encoding = new XFAObjectArray();
    this.encodings = new XFAObjectArray();
    this.encrypt = new XFAObjectArray();
    this.encryptData = new XFAObjectArray();
    this.encryption = new XFAObjectArray();
    this.encryptionMethod = new XFAObjectArray();
    this.encryptionMethods = new XFAObjectArray();
    this.event = new XFAObjectArray();
    this.exData = new XFAObjectArray();
    this.exObject = new XFAObjectArray();
    this.exclGroup = new XFAObjectArray();
    this.execute = new XFAObjectArray();
    this.extras = new XFAObjectArray();
    this.field = new XFAObjectArray();
    this.fill = new XFAObjectArray();
    this.filter = new XFAObjectArray();
    this.float = new XFAObjectArray();
    this.font = new XFAObjectArray();
    this.format = new XFAObjectArray();
    this.handler = new XFAObjectArray();
    this.hyphenation = new XFAObjectArray();
    this.image = new XFAObjectArray();
    this.imageEdit = new XFAObjectArray();
    this.integer = new XFAObjectArray();
    this.issuers = new XFAObjectArray();
    this.items = new XFAObjectArray();
    this.keep = new XFAObjectArray();
    this.keyUsage = new XFAObjectArray();
    this.line = new XFAObjectArray();
    this.linear = new XFAObjectArray();
    this.lockDocument = new XFAObjectArray();
    this.manifest = new XFAObjectArray();
    this.margin = new XFAObjectArray();
    this.mdp = new XFAObjectArray();
    this.medium = new XFAObjectArray();
    this.message = new XFAObjectArray();
    this.numericEdit = new XFAObjectArray();
    this.occur = new XFAObjectArray();
    this.oid = new XFAObjectArray();
    this.oids = new XFAObjectArray();
    this.overflow = new XFAObjectArray();
    this.pageArea = new XFAObjectArray();
    this.pageSet = new XFAObjectArray();
    this.para = new XFAObjectArray();
    this.passwordEdit = new XFAObjectArray();
    this.pattern = new XFAObjectArray();
    this.picture = new XFAObjectArray();
    this.radial = new XFAObjectArray();
    this.reason = new XFAObjectArray();
    this.reasons = new XFAObjectArray();
    this.rectangle = new XFAObjectArray();
    this.ref = new XFAObjectArray();
    this.script = new XFAObjectArray();
    this.setProperty = new XFAObjectArray();
    this.signData = new XFAObjectArray();
    this.signature = new XFAObjectArray();
    this.signing = new XFAObjectArray();
    this.solid = new XFAObjectArray();
    this.speak = new XFAObjectArray();
    this.stipple = new XFAObjectArray();
    this.subform = new XFAObjectArray();
    this.subformSet = new XFAObjectArray();
    this.subjectDN = new XFAObjectArray();
    this.subjectDNs = new XFAObjectArray();
    this.submit = new XFAObjectArray();
    this.text = new XFAObjectArray();
    this.textEdit = new XFAObjectArray();
    this.time = new XFAObjectArray();
    this.timeStamp = new XFAObjectArray();
    this.toolTip = new XFAObjectArray();
    this.traversal = new XFAObjectArray();
    this.traverse = new XFAObjectArray();
    this.ui = new XFAObjectArray();
    this.validate = new XFAObjectArray();
    this.value = new XFAObjectArray();
    this.variables = new XFAObjectArray();
  }
}

class Radial extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "radial", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["toEdge", "toCenter"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;
  }
}

class Reason extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "reason");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Reasons extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "reasons", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.reason = new XFAObjectArray();
  }
}

class Rectangle extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "rectangle", /* hasChildren = */ true);
    this.hand = getStringOption(attributes.hand, ["even", "left", "right"]);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.corner = new XFAObjectArray(4);
    this.edge = new XFAObjectArray(4);
    this.fill = null;
  }
}

class RefElement extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "ref");
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Script extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "script");
    this.binding = attributes.binding || "";
    this.contentType = attributes.contentType || "";
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.runAt = getStringOption(attributes.runAt, [
      "client",
      "both",
      "server",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class SetProperty extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "setProperty");
    this.connection = attributes.connection || "";
    this.ref = attributes.ref || "";
    this.target = attributes.target || "";
  }
}

class SignData extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "signData", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.operation = getStringOption(attributes.operation, [
      "sign",
      "clear",
      "verify",
    ]);
    this.ref = attributes.ref || "";
    this.target = attributes.target || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.filter = null;
    this.manifest = null;
  }
}

class Signature extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "signature", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["PDF1.3", "PDF1.6"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.border = null;
    this.extras = null;
    this.filter = null;
    this.manifest = null;
    this.margin = null;
  }
}

class Signing extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "signing", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.certificate = new XFAObjectArray();
  }
}

class Solid extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "solid", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
  }
}

class Speak extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "speak");
    this.disable = getInteger({
      data: attributes.disable,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.id = attributes.id || "";
    this.priority = getStringOption(attributes.priority, [
      "custom",
      "caption",
      "name",
      "toolTip",
    ]);
    this.rid = attributes.rid || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Stipple extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "stipple", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.rate = getInteger({
      data: attributes.rate,
      defaultValue: 50,
      validate: x => x >= 0 && x <= 100,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.color = null;
    this.extras = null;
  }
}

class Subform extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "subform", /* hasChildren = */ true);
    this.access = getStringOption(attributes.access, [
      "open",
      "nonInteractive",
      "protected",
      "readOnly",
    ]);
    this.allowMacro = getInteger({
      data: attributes.allowMacro,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.anchorType = getStringOption(attributes.anchorType, [
      "topLeft",
      "bottomCenter",
      "bottomLeft",
      "bottomRight",
      "middleCenter",
      "middleLeft",
      "middleRight",
      "topCenter",
      "topRight",
    ]);
    this.colSpan = getInteger({
      data: attributes.colSpan,
      defaultValue: 1,
      validate: x => x >= 1,
    });
    this.columnWidths = (attributes.columnWidths || "")
      .trim()
      .split(/\s+/)
      .map(x => (x === "-1" ? -1 : getMeasurement(x)));
    this.h = getMeasurement(attributes.h);
    this.hAlign = getStringOption(attributes.hAlign, [
      "left",
      "center",
      "justify",
      "justifyAll",
      "radix",
      "right",
    ]);
    this.id = attributes.id || "";
    this.layout = getStringOption(attributes.layout, [
      "position",
      "lr-tb",
      "rl-row",
      "rl-tb",
      "row",
      "table",
      "tb",
    ]);
    this.locale = attributes.locale || "";
    this.maxH = getMeasurement(attributes.maxH);
    this.maxW = getMeasurement(attributes.maxW);
    this.mergeMode = getStringOption(attributes.mergeMode, [
      "consumeData",
      "matchTemplate",
    ]);
    this.minH = getMeasurement(attributes.minH);
    this.minW = getMeasurement(attributes.minW);
    this.name = attributes.name || "";
    this.presence = getStringOption(attributes.presence, [
      "visible",
      "hidden",
      "inactive",
      "invisible",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.restoreState = getStringOption(attributes.restoreState, [
      "manual",
      "auto",
    ]);
    this.scope = getStringOption(attributes.scope, ["name", "none"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.w = getMeasurement(attributes.w);
    this.x = getMeasurement(attributes.x);
    this.y = getMeasurement(attributes.y);
    this.assist = null;
    this.bind = null;
    this.bookend = null;
    this.border = null;
    this.break = null;
    this.calculate = null;
    this.desc = null;
    this.extras = null;
    this.keep = null;
    this.margin = null;
    this.occur = null;
    this.overflow = null;
    this.pageSet = null;
    this.para = null;
    this.traversal = null;
    this.validate = null;
    this.variables = null;
    this.area = new XFAObjectArray();
    this.breakAfter = new XFAObjectArray();
    this.breakBefore = new XFAObjectArray();
    this.connect = new XFAObjectArray();
    this.draw = new XFAObjectArray();
    this.event = new XFAObjectArray();
    this.exObject = new XFAObjectArray();
    this.exclGroup = new XFAObjectArray();
    this.field = new XFAObjectArray();
    this.proto = new XFAObjectArray();
    this.setProperty = new XFAObjectArray();
    this.subform = new XFAObjectArray();
    this.subformSet = new XFAObjectArray();
  }
}

class SubformSet extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "subformSet", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.relation = getStringOption(attributes.relation, [
      "ordered",
      "choice",
      "unordered",
    ]);
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.bookend = null;
    this.break = null;
    this.desc = null;
    this.extras = null;
    this.occur = null;
    this.overflow = null;
    this.breakAfter = new XFAObjectArray();
    this.breakBefore = new XFAObjectArray();
    this.subform = new XFAObjectArray();
    this.subformSet = new XFAObjectArray();
  }
}

class SubjectDN extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "subjectDN");
    this.delimiter = attributes.delimiter || ",";
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    this[$content] = new Map(
      this[$content].split(this.delimiter).map(kv => {
        kv = kv.split("=", 2);
        kv[0] = kv[0].trim();
        return kv;
      })
    );
  }
}

class SubjectDNs extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "subjectDNs", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.subjectDN = new XFAObjectArray();
  }
}

class Submit extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "submit", /* hasChildren = */ true);
    this.embedPDF = getInteger({
      data: attributes.embedPDF,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.format = getStringOption(attributes.format, [
      "xdp",
      "formdata",
      "pdf",
      "urlencoded",
      "xfd",
      "xml",
    ]);
    this.id = attributes.id || "";
    this.target = attributes.target || "";
    this.textEncoding = getKeyword({
      data: attributes.textEncoding
        ? attributes.textEncoding.toLowerCase()
        : "",
      defaultValue: "",
      validate: k =>
        [
          "utf-8",
          "big-five",
          "fontspecific",
          "gbk",
          "gb-18030",
          "gb-2312",
          "ksc-5601",
          "none",
          "shift-jis",
          "ucs-2",
          "utf-16",
        ].includes(k) || k.match(/iso-8859-[0-9]{2}/),
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.xdpContent = attributes.xdpContent || "";
    this.encrypt = null;
    this.encryptData = new XFAObjectArray();
    this.signData = new XFAObjectArray();
  }
}

class Template extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "template", /* hasChildren = */ true);
    this.baseProfile = getStringOption(attributes.baseProfile, [
      "full",
      "interactiveForms",
    ]);
    this.extras = null;
    this.subform = new XFAObjectArray();
  }
}

class Text extends ContentObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "text");
    this.id = attributes.id || "";
    this.maxChars = getInteger({
      data: attributes.maxChars,
      defaultValue: 0,
      validate: x => x >= 0,
    });
    this.name = attributes.name || "";
    this.rid = attributes.rid || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$onChild](child) {
    if (child[$namespaceId] === NamespaceIds.xhtml.id) {
      this[$content] = child;
      return true;
    }
    warn(`XFA - Invalid content in Text: ${child[$nodeName]}.`);
    return false;
  }
}

class TextEdit extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "textEdit", /* hasChildren = */ true);
    this.allowRichText = getInteger({
      data: attributes.allowRichText,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.hScrollPolicy = getStringOption(attributes.hScrollPolicy, [
      "auto",
      "off",
      "on",
    ]);
    this.id = attributes.id || "";
    this.multiLine = getInteger({
      data: attributes.multiLine,
      defaultValue: 1,
      validate: x => x === 0,
    });
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.vScrollPolicy = getStringOption(attributes.vScrollPolicy, [
      "auto",
      "off",
      "on",
    ]);
    this.border = null;
    this.comb = null;
    this.extras = null;
    this.margin = null;
  }
}

class Time extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "time");
    this.id = attributes.id || "";
    this.name = attributes.name || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }

  [$finalize]() {
    // TODO
    this[$content] = new Date(this[$content]);
  }
}

class TimeStamp extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "timeStamp");
    this.id = attributes.id || "";
    this.server = attributes.server || "";
    this.type = getStringOption(attributes.type, ["optional", "required"]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class ToolTip extends StringObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "toolTip");
    this.id = attributes.id || "";
    this.rid = attributes.rid || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
  }
}

class Traversal extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "traversal", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.traverse = new XFAObjectArray();
  }
}

class Traverse extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "traverse", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.operation = getStringOption(attributes.operation, [
      "next",
      "back",
      "down",
      "first",
      "left",
      "right",
      "up",
    ]);
    this.ref = attributes.ref || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.script = null;
  }

  get name() {
    // SOM expression: see page 94
    return this.operation;
  }

  [$isTransparent]() {
    return false;
  }
}

class Ui extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "ui", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.picture = null;

    // One-of properties
    this.barcode = null;
    this.button = null;
    this.checkButton = null;
    this.choiceList = null;
    this.dateTimeEdit = null;
    this.defaultUi = null;
    this.imageEdit = null;
    this.numericEdit = null;
    this.passwordEdit = null;
    this.signature = null;
    this.textEdit = null;
  }
}

class Validate extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "validate", /* hasChildren = */ true);
    this.formatTest = getStringOption(attributes.formatTest, [
      "warning",
      "disabled",
      "error",
    ]);
    this.id = attributes.id || "";
    this.nullTest = getStringOption(attributes.nullTest, [
      "disabled",
      "error",
      "warning",
    ]);
    this.scriptTest = getStringOption(attributes.scriptTest, [
      "error",
      "disabled",
      "warning",
    ]);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.extras = null;
    this.message = null;
    this.picture = null;
    this.script = null;
  }
}

class Value extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "value", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.override = getInteger({
      data: attributes.override,
      defaultValue: 0,
      validate: x => x === 1,
    });
    this.relevant = getRelevant(attributes.relevant);
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";

    // One-of properties
    this.arc = null;
    this.boolean = null;
    this.date = null;
    this.dateTime = null;
    this.decimal = null;
    this.exData = null;
    this.float = null;
    this.image = null;
    this.integer = null;
    this.line = null;
    this.rectangle = null;
    this.text = null;
    this.time = null;
  }

  [$setValue](value) {
    const valueName = value[$nodeName];
    if (this[valueName] !== null) {
      this[valueName][$content] = value[$content];
      return;
    }

    // Reset all the properties.
    for (const name of Object.getOwnPropertyNames(this)) {
      const obj = this[name];
      if (obj instanceof XFAObject) {
        this[name] = null;
        this[$removeChild](obj);
      }
    }

    this[value[$nodeName]] = value;
    this[$appendChild](value);
  }
}

class Variables extends XFAObject {
  constructor(attributes) {
    super(TEMPLATE_NS_ID, "variables", /* hasChildren = */ true);
    this.id = attributes.id || "";
    this.use = attributes.use || "";
    this.usehref = attributes.usehref || "";
    this.boolean = new XFAObjectArray();
    this.date = new XFAObjectArray();
    this.dateTime = new XFAObjectArray();
    this.decimal = new XFAObjectArray();
    this.exData = new XFAObjectArray();
    this.float = new XFAObjectArray();
    this.image = new XFAObjectArray();
    this.integer = new XFAObjectArray();
    this.manifest = new XFAObjectArray();
    this.script = new XFAObjectArray();
    this.text = new XFAObjectArray();
    this.time = new XFAObjectArray();
  }

  [$isTransparent]() {
    return true;
  }
}

class TemplateNamespace {
  static [$buildXFAObject](name, attributes) {
    if (TemplateNamespace.hasOwnProperty(name)) {
      const node = TemplateNamespace[name](attributes);
      node[$setSetAttributes](attributes);
      return node;
    }
    return undefined;
  }

  static appearanceFilter(attrs) {
    return new AppearanceFilter(attrs);
  }

  static arc(attrs) {
    return new Arc(attrs);
  }

  static area(attrs) {
    return new Area(attrs);
  }

  static assist(attrs) {
    return new Assist(attrs);
  }

  static barcode(attrs) {
    return new Barcode(attrs);
  }

  static bind(attrs) {
    return new Bind(attrs);
  }

  static bindItems(attrs) {
    return new BindItems(attrs);
  }

  static bookend(attrs) {
    return new Bookend(attrs);
  }

  static boolean(attrs) {
    return new BooleanElement(attrs);
  }

  static border(attrs) {
    return new Border(attrs);
  }

  static break(attrs) {
    return new Break(attrs);
  }

  static breakAfter(attrs) {
    return new BreakAfter(attrs);
  }

  static breakBefore(attrs) {
    return new BreakBefore(attrs);
  }

  static button(attrs) {
    return new Button(attrs);
  }

  static calculate(attrs) {
    return new Calculate(attrs);
  }

  static caption(attrs) {
    return new Caption(attrs);
  }

  static certificate(attrs) {
    return new Certificate(attrs);
  }

  static certificates(attrs) {
    return new Certificates(attrs);
  }

  static checkButton(attrs) {
    return new CheckButton(attrs);
  }

  static choiceList(attrs) {
    return new ChoiceList(attrs);
  }

  static color(attrs) {
    return new Color(attrs);
  }

  static comb(attrs) {
    return new Comb(attrs);
  }

  static connect(attrs) {
    return new Connect(attrs);
  }

  static contentArea(attrs) {
    return new ContentArea(attrs);
  }

  static corner(attrs) {
    return new Corner(attrs);
  }

  static date(attrs) {
    return new Date(attrs);
  }

  static dateTime(attrs) {
    return new DateTime(attrs);
  }

  static dateTimeEdit(attrs) {
    return new DateTimeEdit(attrs);
  }

  static decimal(attrs) {
    return new Decimal(attrs);
  }

  static defaultUi(attrs) {
    return new DefaultUi(attrs);
  }

  static desc(attrs) {
    return new Desc(attrs);
  }

  static digestMethod(attrs) {
    return new DigestMethod(attrs);
  }

  static digestMethods(attrs) {
    return new DigestMethods(attrs);
  }

  static draw(attrs) {
    return new Draw(attrs);
  }

  static edge(attrs) {
    return new Edge(attrs);
  }

  static encoding(attrs) {
    return new Encoding(attrs);
  }

  static encodings(attrs) {
    return new Encodings(attrs);
  }

  static encrypt(attrs) {
    return new Encrypt(attrs);
  }

  static encryptData(attrs) {
    return new EncryptData(attrs);
  }

  static encryption(attrs) {
    return new Encryption(attrs);
  }

  static encryptionMethod(attrs) {
    return new EncryptionMethod(attrs);
  }

  static encryptionMethods(attrs) {
    return new EncryptionMethods(attrs);
  }

  static event(attrs) {
    return new Event(attrs);
  }

  static exData(attrs) {
    return new ExData(attrs);
  }

  static exObject(attrs) {
    return new ExObject(attrs);
  }

  static exclGroup(attrs) {
    return new ExclGroup(attrs);
  }

  static execute(attrs) {
    return new Execute(attrs);
  }

  static extras(attrs) {
    return new Extras(attrs);
  }

  static field(attrs) {
    return new Field(attrs);
  }

  static fill(attrs) {
    return new Fill(attrs);
  }

  static filter(attrs) {
    return new Filter(attrs);
  }

  static float(attrs) {
    return new Float(attrs);
  }

  static font(attrs) {
    return new Font(attrs);
  }

  static format(attrs) {
    return new Format(attrs);
  }

  static handler(attrs) {
    return new Handler(attrs);
  }

  static hyphenation(attrs) {
    return new Hyphenation(attrs);
  }

  static image(attrs) {
    return new Image(attrs);
  }

  static imageEdit(attrs) {
    return new ImageEdit(attrs);
  }

  static integer(attrs) {
    return new Integer(attrs);
  }

  static issuers(attrs) {
    return new Issuers(attrs);
  }

  static items(attrs) {
    return new Items(attrs);
  }

  static keep(attrs) {
    return new Keep(attrs);
  }

  static keyUsage(attrs) {
    return new KeyUsage(attrs);
  }

  static line(attrs) {
    return new Line(attrs);
  }

  static linear(attrs) {
    return new Linear(attrs);
  }

  static lockDocument(attrs) {
    return new LockDocument(attrs);
  }

  static manifest(attrs) {
    return new Manifest(attrs);
  }

  static margin(attrs) {
    return new Margin(attrs);
  }

  static mdp(attrs) {
    return new Mdp(attrs);
  }

  static medium(attrs) {
    return new Medium(attrs);
  }

  static message(attrs) {
    return new Message(attrs);
  }

  static numericEdit(attrs) {
    return new NumericEdit(attrs);
  }

  static occur(attrs) {
    return new Occur(attrs);
  }

  static oid(attrs) {
    return new Oid(attrs);
  }

  static oids(attrs) {
    return new Oids(attrs);
  }

  static overflow(attrs) {
    return new Overflow(attrs);
  }

  static pageArea(attrs) {
    return new PageArea(attrs);
  }

  static pageSet(attrs) {
    return new PageSet(attrs);
  }

  static para(attrs) {
    return new Para(attrs);
  }

  static passwordEdit(attrs) {
    return new PasswordEdit(attrs);
  }

  static pattern(attrs) {
    return new Pattern(attrs);
  }

  static picture(attrs) {
    return new Picture(attrs);
  }

  static proto(attrs) {
    return new Proto(attrs);
  }

  static radial(attrs) {
    return new Radial(attrs);
  }

  static reason(attrs) {
    return new Reason(attrs);
  }

  static reasons(attrs) {
    return new Reasons(attrs);
  }

  static rectangle(attrs) {
    return new Rectangle(attrs);
  }

  static ref(attrs) {
    return new RefElement(attrs);
  }

  static script(attrs) {
    return new Script(attrs);
  }

  static setProperty(attrs) {
    return new SetProperty(attrs);
  }

  static signData(attrs) {
    return new SignData(attrs);
  }

  static signature(attrs) {
    return new Signature(attrs);
  }

  static signing(attrs) {
    return new Signing(attrs);
  }

  static solid(attrs) {
    return new Solid(attrs);
  }

  static speak(attrs) {
    return new Speak(attrs);
  }

  static stipple(attrs) {
    return new Stipple(attrs);
  }

  static subform(attrs) {
    return new Subform(attrs);
  }

  static subformSet(attrs) {
    return new SubformSet(attrs);
  }

  static subjectDN(attrs) {
    return new SubjectDN(attrs);
  }

  static subjectDNs(attrs) {
    return new SubjectDNs(attrs);
  }

  static submit(attrs) {
    return new Submit(attrs);
  }

  static template(attrs) {
    return new Template(attrs);
  }

  static text(attrs) {
    return new Text(attrs);
  }

  static textEdit(attrs) {
    return new TextEdit(attrs);
  }

  static time(attrs) {
    return new Time(attrs);
  }

  static timeStamp(attrs) {
    return new TimeStamp(attrs);
  }

  static toolTip(attrs) {
    return new ToolTip(attrs);
  }

  static traversal(attrs) {
    return new Traversal(attrs);
  }

  static traverse(attrs) {
    return new Traverse(attrs);
  }

  static ui(attrs) {
    return new Ui(attrs);
  }

  static validate(attrs) {
    return new Validate(attrs);
  }

  static value(attrs) {
    return new Value(attrs);
  }

  static variables(attrs) {
    return new Variables(attrs);
  }
}

export {
  BindItems,
  Field,
  Items,
  SetProperty,
  Template,
  TemplateNamespace,
  Text,
  Value,
};
