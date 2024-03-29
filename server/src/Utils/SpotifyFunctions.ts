/// <reference types="spotify-api" />
// import * as SpotifyApi from "spotify-api"
import * as request from "superagent";
var stringSimilarity = require("string-similarity");

import {
    _spotifyClientCert,
    _spotifyAccessToken
} from "../app"
import { TrackIdentifier } from "../Models/TrackId";

export async function getTrackIdFromSptofyId(id: string): Promise<TrackIdentifier> {
    var url = `https://api.spotify.com/v1/tracks/${id}`
    return request
        .get(url)
        .set("Authorization", "Bearer " + _spotifyAccessToken)
        .then(value => {
            return value.body;
        })
        .then((data: SpotifyApi.TrackObjectFull) => {
            return {
                artist: data.artists[0].name,
                album: data.album.name,
                name: data.name
            };
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export async function getSpotifyTrackIds(tracks: TrackIdentifier[]): Promise<string[]> {
    console.log("Attempting to retrieve spotify track ids");
    const retriveSpotifyTrackIdPromises = tracks.map((trackIdentifier) => {
        const data: Promise<string> = request
            .get("https://api.spotify.com/v1/search")
            .set("Authorization", "Bearer " + _spotifyClientCert)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .query((`q=${encodeURIComponent(`${trackIdentifier.name} ${trackIdentifier.album} ${trackIdentifier.artist}`)}`))
            .query("type=track")
            .then((value) => {
                console.log("successfully retrieved spotify track id")
                return value.body as SpotifyApi.SearchResponse;
            }).then((searchResponseData) => {
                // TODO: add logic for more thorough checking of null values and error handling
                const trackResults = searchResponseData.tracks.items;
                const songSimilarityArray = new Array<number>(trackResults.length);
                trackResults.forEach((track, index) => {
                    const titleSimilarity = stringSimilarity.compareTwoStrings(track.name, trackIdentifier.name);
                    const albumSimilarity = stringSimilarity.compareTwoStrings(track.album.name, trackIdentifier.album);
                    // Have to go through all of the other artists
                    const artistSimilarity = stringSimilarity.compareTwoStrings(track.artists[0].name, trackIdentifier.artist);
                    songSimilarityArray[index] = titleSimilarity + albumSimilarity + artistSimilarity;
                })
                const indexOfMaxArray = songSimilarityArray.reduce((previousMaxIndex, currentSimilarityValue, currentIndex, array) => currentSimilarityValue > array[previousMaxIndex] ? currentIndex : previousMaxIndex, 0);
                return trackResults[indexOfMaxArray]?.id && `spotify:track:${trackResults[indexOfMaxArray].id}`;
            })
            .catch(err => {
                console.log(err);
                return null;
            })
        return data;
    });

    const spotifyTrackIds = (await Promise.all(retriveSpotifyTrackIdPromises));
    return spotifyTrackIds;
}

export async function getSpotifyTrackUri(trackIdentifier: TrackIdentifier): Promise<string> {
    var spotifyTrackIds = new Array();
    const data = await request
        .get("https://api.spotify.com/v1/search")
        .set("Authorization", "Bearer " + _spotifyClientCert)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .query((`q=track:${encodeURIComponent(trackIdentifier.name)} album:${encodeURIComponent(trackIdentifier.album)} artist:${encodeURIComponent(trackIdentifier.artist)}`))
        .query("type=track")
        .then((value) => {
            return value.body as SpotifyApi.SearchResponse;
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
    // TODO: add logic for more thorough checking of null values and error handling
    return data.tracks.items[0].external_urls.spotify;
}

export function addTracksToSpotifyPlaylist(playlistId: string, trackIds: string[]): Promise<SpotifyApi.AddTracksToPlaylistResponse> {
    console.log("Attempting to add tracks to spotify playlist")
    var url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
    var body = { uris: trackIds }
    return request
        .post(url)
        .set("Authorization", "Bearer " + _spotifyAccessToken)
        .send(body)
        .then((value) => {
            return value.body
        })
        .then((data: SpotifyApi.AddTracksToPlaylistResponse) => {
            console.log(`Successfully added tracks to spotify playlist`)
            return data;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export function createSpotifyPlaylist(name: string): Promise<SpotifyApi.CreatePlaylistResponse> {
    console.log("attempting to create spotify playlist");
    var url = "https://api.spotify.com/v1/users/12129543240/playlists";
    var body = { name: name, description: "Generated by PlaylistConverter", public: true };
    return request
        .post(url)
        .set("Authorization", "Bearer " + _spotifyAccessToken)
        .send(body)
        .then(value => {
            return value.body;
        })
        .then((data: SpotifyApi.CreatePlaylistResponse) => {
            console.log(`Created spotify playlist ${ data.id }`)
            return data;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

// FIXME: correct return type
// FIXME: correct get url. maybe need to search?
export function getSpotifyPlaylist(id: string): Promise<SpotifyApi.PlaylistObjectFull> {
    var url = `https://api.spotify.com/v1/playlists/${id}`
    return request
        .get(url)
        .set("Authorization", "Bearer " + _spotifyAccessToken)
        .then(value => {
            return value.body;
        })
        .then((data: SpotifyApi.PlaylistObjectFull) => {
            return data;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}