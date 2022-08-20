import * as request from "superagent";
import * as SpotifyApi from "spotify-api";
import {
    addTracksToSpotifyPlaylist,
    createSpotifyPlaylist, getSpotifyTrackIds, getSpotifyTrackUri
} from "../Utils/SpotifyFunctions";
import {
    getAppleMusicPlaylistById, getCatalogSongById
} from "../Utils/AppleMusicFunctions";
import {
    TrackIdentifier
} from "../Models/TrackId"

// TODO: type req, res

const getSpotifySong = async (req, res) => {
    const songId = req.query["songId"];

    // get apple music song info
    const trackId = await getCatalogSongById(songId);

    // query spotify with that song
    const uri = (await getSpotifyTrackUri(trackId));

    return uri;
}

const postSpotifyPlaylist = async (req, res) => {
    const { service, id } = req.body; // TODO: strong type this
    console.log("post to /services/spotify/playlist");
    switch (service) {
        case "AppleMusic":
            const appleMusicPlaylist = await getAppleMusicPlaylistById("us", id);
            const name = appleMusicPlaylist.attributes.name;
            const trackIds: TrackIdentifier[] = appleMusicPlaylist.relationships.tracks.data
                .map((track) => {
                    return {
                        name: track.attributes.name,
                        album: track.attributes.albumName,
                        artist: track.attributes.artistName
                    }
                });
            const spotifyTrackIds = await getSpotifyTrackIds(trackIds);
            const spotifyPlaylist = await createSpotifyPlaylist(name);
            await addTracksToSpotifyPlaylist(spotifyPlaylist.id, spotifyTrackIds);
            res.send(JSON.stringify({ url: spotifyPlaylist.external_urls.spotify }));
    }
}

export {
    postSpotifyPlaylist,
    getSpotifySong
}