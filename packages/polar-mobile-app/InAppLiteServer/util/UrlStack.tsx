export class UrlStack {
    private stack: string[] = [];

    pushIfChanged(url: string) {
        const lastUrl = this.getLast();
        if (url != lastUrl) {
            this.push(url);
            return true;
        }
        return false;
    }

    push(url: string) {
        return !!this.stack.push(url);
    }

    pop() {
        return this.stack.pop();
    }

    getLast() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }
}
