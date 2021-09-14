export namespace StringUtils {

    export function regionMatches(src: string,
                                  srcOffset: number,
                                  target: string,
                                  targetOffset: number,
                                  len: number) {

        if ((target.length - targetOffset) < len) {
            // not enough data in target so definitely not.
            return false;
        }

        let si = srcOffset;
        let to = targetOffset;

        while (len-- > 0) {
            if (src[si++] !== target[to++]) {
                return false;
            }
        }
        return true;

    }

}
