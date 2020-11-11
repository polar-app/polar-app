"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaContents = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
class MediaContents {
    static parse(content) {
        const mediaFiles = [];
        const re = /src=["'](data:image\/(gif|jpg|png);base64,[^"']+)/g;
        content = content.replace(re, (match, p1) => {
            const mediaFile = MediaContents.toMediaFile(p1);
            mediaFiles.push(mediaFile.get());
            return match.replace(p1, mediaFile.get().filename);
        });
        return {
            content, mediaFiles
        };
    }
    static toMediaFile(dataURL) {
        const re = /data:image\/(gif|jpg|png);base64,([^"']+)/;
        const m = re.exec(dataURL);
        if (m) {
            const type = m[1];
            const data = m[2];
            const name = Hashcodes_1.Hashcodes.createID(data, 20);
            const filename = `${name}.${type}`;
            return Optional_1.Optional.of({ filename, data });
        }
        return Optional_1.Optional.empty();
    }
}
exports.MediaContents = MediaContents;
//# sourceMappingURL=MediaContents.js.map