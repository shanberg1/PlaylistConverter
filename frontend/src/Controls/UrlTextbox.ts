import { getElement } from "../HomePage";
import { Service } from "../Models/Models";

export class UrlTextbox {
    private url: string;
    private urlTextbox: HTMLInputElement;
    private service: Service


    constructor() {
        this.urlTextbox = getElement("url");
        document.querySelector("#url")?.addEventListener("change", this.onUrlChange);
        this.url = "";
        this.service = "None";
    }

    private getUrl(): string {
        return this.url;
    }

    private getService(): Service {
        return this.service;
    }

    private onUrlChange(): void {
        this.url = this.urlTextbox.value;
        this.service = this.tryDetectService(this.url);
    }

    private tryDetectService(url: string): Service {
        if (url.includes("spotify.com")) {
            return "Spotify";
        }

        if (url.includes("music.apple.com")) {
            return "AppleMusic";
        }

        return "None";
    }
}