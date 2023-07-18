import { _backendUrl } from "./Constants";
import {
    Services
} from "../../server/src/Models/RequestModel"
/// <reference types="apple-music-api" />

export class HomePage {
    private url: string;
    private urlType: HTMLInputElement;
    private sourceSelect: HTMLInputElement;
    private destinationSelect: HTMLInputElement;
    private convertButton: HTMLInputElement;

    constructor() {
        document.querySelector("#convertSongButton")?.addEventListener("click", this.convert);
        document.querySelector("#urlType")?.addEventListener("change", this.urlTypeSelect);
        document.querySelector("#sourceService")?.addEventListener("change", this.sourceServiceSelect);
        document.querySelector("#destinationService")?.addEventListener("change", this.destinationServiceSelect);
        
        this.urlType = getElement("urlType");
        this.sourceSelect = getElement("sourceService");
        this.destinationSelect = getElement("destinationService");
        this.convertButton = getElement("convertSongButton");

        const typePlaylist = document.createElement("option");
        typePlaylist.value = "Playlist";
        typePlaylist.text = "Playlist";
    
        const typeSong = document.createElement("option");
        typeSong.value = "Song";
        typeSong.text = "Song";
    
        this.urlType.appendChild(typePlaylist);
        this.urlType.appendChild(typeSong);
    
        const sourceApple = document.createElement("option");
        sourceApple.value = Services.Apple;
        sourceApple.text = "Apple";
    
        const sourceSpotify = document.createElement("option");
        sourceSpotify.value = Services.Spotify;
        sourceSpotify.text = "Spotify";
        // sourceSpotify.disabled = true;
    
        const destinationApple = document.createElement("option");
        destinationApple.value = Services.Apple;
        destinationApple.text = "Apple";
        // destinationApple.disabled = true;
    
        const destinationSpotify = document.createElement("option");
        destinationSpotify.value = Services.Spotify;
        destinationSpotify.text = "Spotify";
    
        this.sourceSelect.appendChild(sourceApple);
        this.sourceSelect.appendChild(sourceSpotify);
        this.destinationSelect.appendChild(destinationSpotify);
        this.destinationSelect.appendChild(destinationApple);
    }

    private convert() {
        const urlType = getElement("urlType").value;
        switch (urlType) {
            case "Playlist":
                this.convertPlaylist();
                break;
            case "Song":
                this.convertSong();
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
        const playlisturl = getElement("url").value;
        const destEndpoint = this.destinationSelect.value === Services.Apple ? "applemusic" : "spotify";
        return fetch(`${_backendUrl}/service/${destEndpoint}/playlist`,
            {
                method: "POST",
                body: JSON.stringify({
                    service: this.sourceSelect.value,
                    id: this.sourceSelect.value === Services.Apple ? getAppleMusicId(playlisturl) : getSpotifyPlaylistId(playlisturl),
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
                newPlaylist.value = data.url;
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

// TODO: actually implement good logic
function getAppleMusicId(url: string): string {
    return url.split("/")[6]?.split("?")[0];
}

// TODO: actually implement good logic
function getSpotifyPlaylistId(url: string): string {
    return url.split("/")[4];
}