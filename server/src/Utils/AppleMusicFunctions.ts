/// <reference types="apple-music-api" />
import * as request from "superagent";
// import * as AppleMusicApi from "apple-music-api"
import {
    _appleDeveloperToken,
    _appleMusicSecretToken,
    _appleMusicSJWT,
    _appleMusicUserToken
} from "../app"
import { TrackIdentifier } from "../Models/TrackId";
import { PlaylistInfo } from "../Models/RequestModel";
var stringSimilarity = require("string-similarity");

export async function getAppleMusicTrackIds(region: string, tracks: TrackIdentifier[]): Promise<string[]> {
    var appleMusicTrackIds = new Array();
    for (const trackIdentifier of tracks) {
        // Spotify tends to put a dash after the normal song title, with something like "In My Room - Remastered 2014". Taking everything before the dash to improve accuracy.
        // ^ this helped bigly. I may need to refactor later when i add more services.
        const searchTerm = trackIdentifier.name.split('-')[0].concat(' ').concat(trackIdentifier.artist).replace(' ', '+');
        await request
            .get(`https://api.music.apple.com/v1/catalog/${region}/search?term=${searchTerm}&types=songs`)
            .set("Authorization", "Bearer " + _appleMusicSJWT)
            .then(value => {
                return value.body;
            })
            .then((data: any /* TODO: find apple music ts version */) => {
                const songResults = <AppleMusicApi.Relationship<AppleMusicApi.Song>> data.results.songs;
                const songSimilarityArray = new Array<number>(songResults.data.length);
                songResults.data.forEach((song, index) => {
                    const titleSimilarity = stringSimilarity.compareTwoStrings(song.attributes.name, trackIdentifier.name);
                    const albumSimilarity = stringSimilarity.compareTwoStrings(song.attributes.albumName, trackIdentifier.album);
                    const artistSimilarity = stringSimilarity.compareTwoStrings(song.attributes.artistName, trackIdentifier.artist);
                    songSimilarityArray[index] = titleSimilarity + albumSimilarity + artistSimilarity;
                })

                const indexOfMaxArray = songSimilarityArray.reduce((previousMaxIndex, currentSimilarityValue, currentIndex, array) => currentSimilarityValue > array[previousMaxIndex] ? currentIndex : previousMaxIndex, 0);
                appleMusicTrackIds.push(songResults.data[indexOfMaxArray].id);
                // appleMusicTrackIds.push(songResults.data[0].id);
            })
            .catch(err => {
                console.log(err);
                // throw err;
            });
    }
    return appleMusicTrackIds;
}

export function getCatalogAppleMusicPlaylistById(region: string, playlistId: string): Promise<AppleMusicApi.Playlist> {
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

export function getLibraryAppleMusicPlaylistById(playlistId: string): Promise<AppleMusicApi.Playlist> {
    return request
        .get(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}?relate=tracks`)
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

export function getAllLibraryPlaylists(): Promise<AppleMusicApi.Playlist[]> {
    return request
        .get(`https://api.music.apple.com/v1/me/library/playlists`)
        .set("Authorization", "Bearer " + _appleMusicSJWT)
        .set("Music-User-Token", _appleMusicUserToken)
        .then(value => {
            return value.body;
        })
        .then((data: AppleMusicApi.PlaylistResponse) => {
            return (data.data);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

export async function deleteSongsFromAppleMusicLibrary(tracks: string[]): Promise<void> {
    tracks.forEach(async (track) => {
        await request
            .delete(`https://amp-api.music.apple.com/v1/me/library/songs/${track}`)
            .set("Authorization", "Bearer " + _appleDeveloperToken)
            .set("Music-User-Token", _appleMusicSecretToken)
            .set("origin", "https://music.apple.com")
            .set("referrer", "https://music.apple.com/")
            .then(value => {
                return;
            })
                .catch(err => {
                console.log(err);
                throw err;
            });
        });
        
}

export function addTracksToAppleMusicPlaylist(region: string, tracks: string[], playlistId: string): Promise<string> {
    // requires a LibraryPlaylistTracksRequest object but it does not exist in the type api
    const libraryPlaylistTrackRequest =
    {
        data: tracks?.map((track) => {
            return {
                id: track,
                type: "songs"
            }
        })
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
            return (playlistId);
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
    // TODO: need to include artist and album in the future
    const appleAccessToken = _appleMusicSJWT;
    return request
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

export function getCatalogSongById(id: string): Promise<TrackIdentifier> {
    const appleAccessToken = _appleMusicSJWT;
    return request
        .get(`https://api.music.apple.com/v1/catalog/us/songs?ids=${id}`)
        .set("Authorization", "Bearer " + appleAccessToken)
        .then((value) => {
            return value.body
        })
        .then((body: AppleMusicApi.SongResponse) => {
            const song = body.data[0];
            return {
                name: song.attributes.name,
                album: song.attributes.albumName,
                artist: song.attributes.artistName
            }
        })
        .catch(err => {
            console.log(err.response.error);
            throw err;
        });
}