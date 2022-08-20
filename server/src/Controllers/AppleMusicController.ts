import {
    getSpotifyPlaylist
} from "../Utils/SpotifyFunctions"
import {
    getAppleMusicTrackIds,
    createAppleMusicPlaylist,
    getAppleMusicPlaylistById,

} from "../Utils/AppleMusicFunctions"

import {
    TrackIdentifier
} from "../Models/TrackId"

export const postApplePlaylist = async (req, res) => {
    const { service, id, region } = req.body;
    console.log("POST to /service/appleMusic/playlist");
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
            res.send(JSON.stringify({ url: appleMusicPlaylist.href }));
    }
}