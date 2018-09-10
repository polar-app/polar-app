export class BrowserApp {

    public start(): void {

        const element = <HTMLInputElement> document.querySelector("#link")!;

        element.addEventListener('keypress', (event) => this.onLinkKeyPress(event));

        console.log("started");

    }


    private onLinkKeyPress(event: Event) {

        if (event instanceof KeyboardEvent && event.which === 13) {

            const element = <HTMLInputElement> document.querySelector("#link")!;

            this.onLinkChange(element.value);

        }

    }

    private onLinkChange(value: string) {

        if (! value.startsWith("http:") && ! value.startsWith("https:")) {
            return;
        }

        const element = document.querySelector("#content")!;

        element.setAttribute('src', value);

    }

}
