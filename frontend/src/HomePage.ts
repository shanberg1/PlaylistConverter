import * as urlLib from "url";
import { _backendUrl } from "./Constants";
import {
    Services
} from "../../server/src/Models/RequestModel"
import { UrlTextbox } from "./Controls/UrlTextbox";
import { Media, Service } from "./Models/Models";
/// <reference types="apple-music-api" />

export class HomePage {
    private url: string;
    private urlType: HTMLInputElement;
    private sourceSelect: HTMLInputElement;
    private destinationSelect: HTMLInputElement;
    private convertButton: HTMLInputElement;
    private sourceService: Service;
    private loader: HTMLInputElement;
    private media: Media;
    private urlTextbox: UrlTextbox;

    constructor() {
        document.querySelector("#convertSongButton")?.addEventListener("click", () => this.convert());
        document.querySelector("#urlType")?.addEventListener("change", () => this.urlTypeSelect());
        document.querySelector("#sourceService")?.addEventListener("change", () => this.sourceServiceSelect());
        document.querySelector("#destinationService")?.addEventListener("change", () => this.destinationServiceSelect());
        
        this.urlType = getElement("urlType");
        this.sourceSelect = getElement("sourceService");
        this.destinationSelect = getElement("destinationService");
        this.convertButton = getElement("convertSongButton");
        this.loader = getElement("loader");
        this.convertButton.disabled = true;

        const typePlaylist = document.createElement("option");
        typePlaylist.value = "Playlist";
        typePlaylist.text = "Playlist";
    
        const typeSong = document.createElement("option");
        typeSong.value = "Song";
        typeSong.text = "Song";
    
        const destinationApple = document.createElement("option");
        destinationApple.value = Services.Apple;
        destinationApple.text = "Apple";
    
        const destinationSpotify = document.createElement("option");
        destinationSpotify.value = Services.Spotify;
        destinationSpotify.text = "Spotify";
    
        this.destinationSelect.appendChild(destinationSpotify);
        this.destinationSelect.appendChild(destinationApple);

        this.urlTextbox = new UrlTextbox((service, media) => this.setSource(service, media));
    }

    private setSource(service: Service, media: Media) {
        this.sourceService = service;
        this.media = media;

        console.log("setting source")
        switch(this.sourceService) {
            case "Spotify":
                this.setSelectOption(this.destinationSelect, Services.Apple);
                this.convertButton.disabled = false;
                break;
            case "AppleMusic":
                this.setSelectOption(this.destinationSelect, Services.Spotify);
                this.convertButton.disabled = false;
                break;
            default:
                this.convertButton.disabled = true;
                break;
        }
        
    }

    private setSelectOption(selectElement, value) {
        return [...selectElement.options].some((option, index) => {
            if (option.value == value) {
                selectElement.selectedIndex = index;
                return true;
            }
        });
    }

    private convert() {
        // const urlType = getElement("urlType").value;
        let urlType = "Playlist";
        switch (urlType) {
            case "Playlist":
                this.convertPlaylist();
                break;
            case "Song":
                // Disable song for now
                console.log("song");
                // this.convertSong();
                break;
            default:
                console.log("incorrect type");
                break;
        }
    }

    private urlTypeSelect() {
        console.log("url type select");
    }

    private sourceServiceSelect() {
        console.log("source select");
        this.convertButton.disabled = this.sourceSelect.value === this.destinationSelect.value;
    }
    
    private destinationServiceSelect() {
        console.log("destination select")
        this.convertButton.disabled = this.sourceSelect.value === this.destinationSelect.value;
    }

    private convertPlaylist() {
        const playlisturl = this.urlTextbox.getUrl();
        const destEndpoint = this.destinationSelect.value === Services.Apple ? "applemusic" : "spotify";
        this.loader.style.display = "block";
        return fetch(`${_backendUrl}/service/${destEndpoint}/playlist`,
            {
                method: "POST",
                body: JSON.stringify({
                    service: this.urlTextbox.getService(),
                    id: this.urlTextbox.getService() === Services.Apple ? getAppleMusicId(playlisturl) : getSpotifyPlaylistId(playlisturl),
                    region: "us" // FIXME
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                return res.json();
            }).then((data) => {
                const newPlaylist = getElement("newSongUrl");
                newPlaylist.value = data.url;
                return data;
            }).finally(() => {
                this.loader.style.display = "none";
            })
    }

    private convertSong() {
        const songUrl = getElement("url").value;
        const srcEndpoint = this.sourceSelect.value === Services.Apple ? "applemusic" : "spotify";
        const destEndpoint = this.destinationSelect.value === Services.Apple ? "applemusic" : "spotify";
        const songId = srcEndpoint === "applemusic" ? getAppleMusicId(songUrl) : getSpotifyPlaylistId(songUrl);
        return fetch(`${_backendUrl}/service/${destEndpoint}/song?songId=${songId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                return res.json();
            }).then((data) => {
                const newPlaylist = getElement("newSongUrl");
                const responseText = data.url ?? "An error has occurred"
                newPlaylist.value = responseText;
                return data;
            })
    }
}

export function getElement(element: string): HTMLInputElement {
    return (<HTMLInputElement>document.getElementById(element));
}

// TODO: actually implement good logic
function getAppleMusicRegion(url: string): string {
    return url.split("/")[3];
}

function getAppleMusicId(url: string): string {
    const parsedUrl = urlLib.parse(url);
    const path: string = parsedUrl.path;
    const splitPath = path.split("/");
    const playlistIndex = splitPath.findIndex((pathVal) => pathVal === "playlist");
    return splitPath[playlistIndex + 1];
}

function getSpotifyPlaylistId(url: string): string {
    const parsedUrl = urlLib.parse(url);
    const path: string = parsedUrl.path;
    const splitPath = path.split("/");
    const playlistIndex = splitPath.findIndex((pathVal) => pathVal === "playlist");
    return splitPath[playlistIndex + 1];
}