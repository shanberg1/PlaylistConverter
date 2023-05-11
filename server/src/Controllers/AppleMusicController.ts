import {
    getSpotifyPlaylist, getTrackIdFromSptofyId
} from "../Utils/SpotifyFunctions"
import {
    getAppleMusicTrackIds,
    createAppleMusicPlaylist,
    getCatalogAppleMusicPlaylistById,
    searchForSongApple,
    addTracksToAppleMusicPlaylist,
    getLibraryAppleMusicPlaylistById,
    getAllLibraryPlaylists,
    deleteSongsFromAppleMusicLibrary,

} from "../Utils/AppleMusicFunctions"

import {
    getOldestAppleMusicPlaylist
} from "../Utils/DatabaseHandler"

import {
    TrackIdentifier
} from "../Models/TrackId"

export const getAppleMusicSong = async (req, res) => {
    try {
        const songId = req.query["songId"];

        // get apple music song info
        const trackId = await getTrackIdFromSptofyId(songId);

        // query apple music with that song
        const songDetails = await searchForSongApple(trackId.name);

        res.send(JSON.stringify({ url: songDetails.attributes.url }));
    } catch(err) {
        res.send(JSON.stringify(err))
    }
}

export const postApplePlaylist = async (req, res) => {
    const { service, id, region } = req.body;
    console.log("POST to /service/appleMusic/playlist");
    try {
        switch (service) {
            case "Spotify":
                const spotifyPlaylist = await getSpotifyPlaylist(id);
                const name = spotifyPlaylist.name;
                const trackIds: TrackIdentifier[] = spotifyPlaylist.tracks.items
                    .map((trackObject) => {
                        // TODO: maybe do more regarding multiple artists
                        return {
                            name: trackObject.track.name,
                            album: trackObject.track.album.name,
                            artist: trackObject.track.artists[0].name
                        }
                    });
                const appleMusicTrackIds = await getAppleMusicTrackIds(region, trackIds);
                const appleMusicPlaylist = await getOldestAppleMusicPlaylist();
                // const newPlaylist = await getAppleMusicPlaylist(region, appleMusicPlaylist.id)
                // const newp = `https://music.apple.com/us/playlist/${appleMusicPlaylist.attributes.name}/${appleMusicPlaylist.id}`
                // const playlists = await getAllLibraryPlaylists();
                const playlist = await getLibraryAppleMusicPlaylistById(appleMusicPlaylist);
                // delete all old songs on the playlist
                deleteSongsFromAppleMusicLibrary(playlist.relationships.tracks.data.map(track => track.id));
                await addTracksToAppleMusicPlaylist("us", appleMusicTrackIds, appleMusicPlaylist);

                const response = JSON.stringify({ url: `https://music.apple.com/us/playlist/${(<any>playlist.attributes.playParams).globalId}` });
                console.log(response);
                res.send(response);
        }
    } catch(err) {
        res.send(JSON.stringify(err))
    }
}