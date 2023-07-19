import { getElement } from "../HomePage";
import { Media, Service, appleMusicAlbumRegex, appleMusicPlaylistRegex, appleMusicSongRegex } from "../Models/Models";

export class UrlTextbox {
    private urlString: string;
    private urlTextbox: HTMLInputElement;
    private service: Service;
    private typingTimer: NodeJS.Timeout;
    private media: Media;

    constructor() {
        this.urlTextbox = getElement("url");
        document.querySelector("#url")?.addEventListener("keyup", () => this.onKeyUp());

        this.urlString = "";
        this.service = "None";
        this.media = "None";
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
            this.typingTimer = setTimeout(() => this.doneTyping(), 1000);
        }
    }

    private doneTyping() {
        console.log("done typing function");
        this.urlString = this.urlTextbox.value;
        this.service = this.tryDetectService();
        this.media = this.tryDetectMediaType();
    }

    private tryDetectService(): Service {
        if (this.urlString.includes("spotify.com")) {
            return "Spotify";
        }

        if (this.urlString.includes("music.apple.com")) {
            return "AppleMusic";
        }

        return "None";
    }

    private tryDetectMediaType(): Media {
        switch(this.service) {
            case "AppleMusic":
                if (appleMusicSongRegex.test(this.urlString)) {
                    return "Song";
                }
                if (appleMusicAlbumRegex.test(this.urlString)) {
                    return "Album"
                }
                if (appleMusicPlaylistRegex.test(this.urlString)) {
                    return "Playlist"
                }
                break;
            case "Spotify":
                break;
            case "None":
                break;
        }

        return "None"
    }
}