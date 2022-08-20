import * as request from "superagent";
import * as AppleMusicApi from "apple-music-api"
import {
    _appleMusicSJWT,
    _appleMusicUserToken
} from "../app"
import { TrackIdentifier } from "../Models/TrackId";
import { PlaylistInfo } from "../Models/RequestModel";

export async function getAppleMusicTrackIds(region: string, tracks: TrackIdentifier[]): Promise<string[]> {
    var appleMusicTrackIds = new Array();
    for (const trackIdentifier of tracks) {
        // TODO: refine searching
        const data = await request
            .get(`https://api.music.apple.com/v1/catalog/${region}/search?term=${trackIdentifier.name}&types=songs`)
            .set("Authorization", "Bearer " + _appleMusicSJWT)
            .then(value => {
                return value.body;
            })
            .then((data: any /* TODO: find apple music ts version */) => {
                appleMusicTrackIds.push(data.results.songs.data[0].id);
            })
            .catch(err => {
                console.log(err);
                // throw err;
            });
    }
    return appleMusicTrackIds;
}

export function getOldestAppleMusicPlaylist() {

}

export function getAppleMusicPlaylistById(region: string, playlistId: string): Promise<AppleMusicApi.Playlist> {
    return request
        .get(`https://api.music.apple.com/v1/catalog/${region}/playlists/${playlistId}`)
        .set("Authorization", "Bearer " + _appleMusicSJWT)
        .set("Music-User-Token", _appleMusicUserToken)
        .then(value => {
            return value.body;
        })
        .then((data: AppleMusicApi.PlaylistResponse) => {
            return (data.data[0]);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export function addTracksToAppleMusicPlaylist(region: string, tracks: string[], playlistId: string): Promise<AppleMusicApi.Playlist> {
    // requires a LibraryPlaylistTracksRequest object but it does not exist in the type api
    const libraryPlaylistTrackRequest =
    {
        tracks: {
            data: tracks?.map((track) => {
                return {
                    id: track,
                    type: "songs"
                }
            })
        }
    }

    return request
        .post(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`)
        .set("Authorization", "Bearer " + _appleMusicSJWT)
        .set("Music-User-Token", _appleMusicUserToken)
        .send(libraryPlaylistTrackRequest)
        .then(value => {
            return value.body;
        })
        .then((data: AppleMusicApi.PlaylistResponse) => {
            // TODO: possibly wont return playlist object response
            return (data.data[0]);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export function createAppleMusicPlaylist(region: string, playlistInfo: PlaylistInfo): Promise<AppleMusicApi.Playlist> {
    // playlist object is not accurate
    const playlistBody = {
        attributes: {
            name: playlistInfo.name,
            description: "Created by PlaylistConverter"
        },
        relationships: {
            tracks: {
                data: playlistInfo.tracks?.map((track) => {
                    return {
                        id: track,
                        type: "songs"
                    }
                })
            }
        }
    };

    return request
        .post(`https://api.music.apple.com/v1/me/library/playlists`)
        .set("Authorization", "Bearer " + _appleMusicSJWT)
        .set("Music-User-Token", _appleMusicUserToken)
        .send(playlistBody)
        .then(value => {
            return value.body;
        })
        .then((data: AppleMusicApi.PlaylistResponse) => {
            return (data.data[0]);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export function searchForSongApple(name: string) {
    const appleAccessToken = _appleMusicSJWT;
    request
        .get("https://api.music.apple.com/v1/catalog/us/search")
        .set("Authorization", "Bearer " + appleAccessToken)
        //.set('Content-Type', 'application/x-www-form-urlencoded')
        .query("term=" + name)
        //.query("types=songs")
        .then((value) => {
            return value.body
        })
        .then((data) => {
            const topMatch = data.results.songs.data[0];
            return topMatch;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}