import { getElement } from "../HomePage";
import { Service } from "../Models/Models";

export class UrlTextbox {
    private urlString: string;
    private urlTextbox: HTMLInputElement;
    private service: Service;
    private typingTimer: NodeJS.Timeout;


    constructor() {
        this.urlTextbox = getElement("url");
        document.querySelector("#url")?.addEventListener("keyup", () => this.onKeyUp());

        this.urlString = "";
        this.service = "None";
        this.typingTimer = setTimeout(this.doneTyping, 1000);
    }

    private getUrl(): string {
        return this.urlString;
    }

    private getService(): Service {
        return this.service;
    }

    private onKeyUp() {
        console.log("keyup");
        clearTimeout(this.typingTimer);
        if (this.urlTextbox.value) {
            this.typingTimer = setTimeout(this.doneTyping, 1000);
        }
    }

    private doneTyping() {
        console.log("done typing function");
    }

    private tryDetectService(url: string): Service {
        if (this.urlString.includes("spotify.com")) {
            return "Spotify";
        }

        if (this.urlString.includes("music.apple.com")) {
            return "AppleMusic";
        }

        return "None";
    }
}