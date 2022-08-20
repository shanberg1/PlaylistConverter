import * as SpotifyApi from "spotify-api"
import * as request from "superagent";

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
    var spotifyTrackIds = new Array();
    for (const trackIdentifier of tracks) {
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
        data.tracks.items[0]?.id && spotifyTrackIds.push(`spotify:track:${data.tracks.items[0].id}`);
    }
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
    return data.tracks.items[0].uri;
}

export function addTracksToSpotifyPlaylist(playlistId: string, trackIds: string[]): Promise<SpotifyApi.AddTracksToPlaylistResponse> {
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
            return data;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export function createSpotifyPlaylist(name: string): Promise<SpotifyApi.CreatePlaylistResponse> {
    var url = "https://api.spotify.com/v1/users/12129543240/playlists"
    var body = { name: name, description: "Generated by PlaylistConverter", public: true }
    return request
        .post(url)
        .set("Authorization", "Bearer " + _spotifyAccessToken)
        .send(body)
        .then(value => {
            return value.body;
        })
        .then((data: SpotifyApi.CreatePlaylistResponse) => {
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