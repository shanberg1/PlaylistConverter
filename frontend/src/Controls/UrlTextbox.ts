import { AppleMusicLibraryPlaylistValidationText, GenericValidationText, URLExceptions } from "../Constants";
import { getElement } from "../HomePage";
import { Media, Service, appleMusicAlbumRegex, appleMusicPlaylistRegex, appleMusicSongRegex } from "../Models/Models";
import * as urlLib from "url";

export class UrlTextbox {
    private urlString: string;
    private urlTextbox: HTMLInputElement;
    private urlValidationMessage: HTMLInputElement;

    private service: Service;
    private typingTimer: NodeJS.Timeout;
    private callBack: (service: Service, media: Media) => void;
    private media: Media;

    constructor(setSource: (service: Service, media: Media) => void) {
        this.urlTextbox = getElement("url");
        this.urlValidationMessage = getElement("urlSublabel");
        this.urlValidationMessage.textContent = "";
        document.querySelector("#url")?.addEventListener("keyup", () => this.onKeyUp());
        this.urlString = "";
        this.service = "None";
        this.media = "None";
        this.typingTimer = setTimeout(() => this.doneTyping(), 1000);
        this.callBack = setSource;
    }

    public getUrl(): string {
        return this.urlString;
    }

    public getService(): Service {
        return this.service;
    }

    private getTextBox() {
        return this.urlTextbox;
    }

    private onKeyUp() {
        console.log("keyup");
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => this.doneTyping(), 1000);
    }

    private doneTyping() {
        console.log("done typing function");
        this.urlString = this.urlTextbox.value;
        this.service = this.tryDetectService();
        this.media = this.tryDetectMediaType();
        if (this.service === "AppleMusic") {
            try {
                this.validateAppleMusicURL(this.urlString);
                this.urlValidationMessage.textContent = "";
            } catch (err) {
                if (err === URLExceptions.APPLE_MUSIC_LIBRARY_PLAYLIST) {
                    this.urlValidationMessage.textContent = AppleMusicLibraryPlaylistValidationText;
                } else {
                    this.urlValidationMessage.textContent = GenericValidationText;
                }
                return;
            }
        } else if (this.service === "Spotify") {
            try {
                this.validateSpotifyURL(this.urlString);
                this.urlValidationMessage.textContent = "";
            } catch (err) {
                this.urlValidationMessage.textContent = GenericValidationText;
                return;
            }
        } else {
            if (this.urlString) {
                this.urlValidationMessage.textContent = this.urlValidationMessage.textContent = GenericValidationText;
            } else {
                this.urlValidationMessage.textContent = "";
            }
        }

        this.callBack(this.service, this.media);
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

    private validateAppleMusicURL(url: string): boolean {
        const parsedUrl = urlLib.parse(url);
        const path: string = parsedUrl.path;
        const splitPath = path.split("/");

        if (splitPath.find((pathElement) => pathElement.toLowerCase() === "library")) {
            throw URLExceptions.APPLE_MUSIC_LIBRARY_PLAYLIST;
        }

        if (splitPath[2].toLowerCase() !== "playlist") {
            throw "";
        }

        if (splitPath.length < 4) {
            throw "";
        }

        return true;
    }

    private validateSpotifyURL(url: string): boolean {
        const parsedUrl = urlLib.parse(url);
        const path: string = parsedUrl.path;
        const splitPath = path.split("/");

        if (splitPath[1].toLowerCase() !== "playlist") {
            throw "";
        }

        if (splitPath.length !== 3) {
            throw "";
        }

        return true;
    }
}