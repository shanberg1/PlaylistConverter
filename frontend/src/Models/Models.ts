export type Service = "Spotify" | "AppleMusic" | "None";
export type Media = "Playlist" | "Song" | "Album" | "None";

export const appleMusicSongRegex = new RegExp("[A-Za-z0-9]+://music\.apple\.com/[A-Za-z0-9]+/[A-Za-z0-9]+/[A-Za-z0-9]+-[A-Za-z0-9]+/[0-9]+\?i=[0-9]+");
export const appleMusicAlbumRegex = new RegExp("[A-Za-z0-9]+://music\.apple\.com/[A-Za-z0-9]+/[A-Za-z0-9]+/[A-Za-z0-9]+-[A-Za-z0-9]+/[0-9]+");
export const appleMusicPlaylistRegex = new RegExp("[A-Za-z0-9]+://music\.apple\.com/[A-Za-z0-9]+/[A-Za-z0-9]+/[A-Za-z0-9]+/([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)-[A-Za-z0-9]+");

