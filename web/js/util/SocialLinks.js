"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinks = void 0;
class SocialLinks {
    static createForGMail(link, description) {
        const body = encodeURIComponent(this.createBodyText(link, description));
        return `https://mail.google.com/mail/u/0/?view=cm&ui=2&cmid=0&fs=1&tf=1&body=${body}`;
    }
    static createForTwitter(link, description) {
        const body = encodeURIComponent(this.createBodyText(link, description));
        return `https://twitter.com/intent/tweet?text=${body}&source=webclient`;
    }
    static createForFacebook(link, description) {
        const u = encodeURIComponent(link);
        const t = encodeURIComponent(description || "");
        return `https://www.facebook.com/share.php?u=${u}&t=${t}`;
    }
    static createBodyText(link, description) {
        if (description) {
            return description + "\n\n" + link;
        }
        return link;
    }
}
exports.SocialLinks = SocialLinks;
//# sourceMappingURL=SocialLinks.js.map