// import * as AppleMusicApi from "apple-music-api"
/// <reference types="apple-music-api" />
//import AppleMusicApi = require("apple-music-api");
import {
    Services
} from "../../server/src/Models/RequestModel"

document.querySelector("#convertSongButton")?.addEventListener("click", convertSong);
document.querySelector("#urlType")?.addEventListener("change", urlTypeSelect);
document.querySelector("#sourceService")?.addEventListener("change", sourceServiceSelect);
document.querySelector("#destinationService")?.addEventListener("change", destinationServiceSelect);
const urlType = getElement("urlType");
const sourceSelect = getElement("sourceService");
const destinationSelect = getElement("destinationService");
const convertButton = getElement("convertSongButton");
main();

const _debugMode = window.location.href.includes("localhost");
const _backendUrl = _debugMode ? "http://localhost:3000" : "https://playlist-converter.azurewebsites.net";

async function main() {
    const typePlaylist = document.createElement("option");
    typePlaylist.value = "Playlist";
    typePlaylist.text = "Playlist";

    const typeSong = document.createElement("option");
    typeSong.value = "Song";
    typeSong.text = "Song";

    urlType.appendChild(typePlaylist);
    urlType.appendChild(typeSong);

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

    sourceSelect.appendChild(sourceApple);
    sourceSelect.appendChild(sourceSpotify);
    destinationSelect.appendChild(destinationSpotify);
    destinationSelect.appendChild(destinationApple);
}

export function urlTypeSelect() {
    console.log("url type select");
}

export function sourceServiceSelect() {
    console.log("source select");
    convertButton.disabled = sourceSelect.value === destinationSelect.value;
}

export function destinationServiceSelect() {
    console.log("destination select")
    convertButton.disabled = sourceSelect.value === destinationSelect.value;
}

export function convertPlaylist() {
    const playlisturl = getElement("playlistUrl").value;
    const destEndpoint = destinationSelect.value === Services.Apple ? "applemusic" : "spotify";
    return fetch(`${_backendUrl}/service/${destEndpoint}/playlist`,
        {
            method: "POST",
            body: JSON.stringify({
                service: sourceSelect.value,
                id: sourceSelect.value === Services.Apple ? getAppleMusicId(playlisturl) : getSpotifyPlaylistId(playlisturl),
                region: "us" // FIXME
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            return res.json();
        }).then((data) => {
            const newPlaylist = getElement("newPlaylistUrl");
            newPlaylist.value = data.url;
            return data;
        })
}

export function convertSong() {
    const songUrl = getElement("songUrl").value;
    const srcEndpoint = sourceSelect.value === Services.Apple ? "applemusic" : "spotify";
    const destEndpoint = destinationSelect.value === Services.Apple ? "applemusic" : "spotify";
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

function getElement(element: string): HTMLInputElement {
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
