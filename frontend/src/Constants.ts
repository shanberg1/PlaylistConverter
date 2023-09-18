const _debugMode = window.location.href.includes("localhost");
export const _backendUrl = _debugMode ? "http://localhost:3000" : "https://playlist-converter.azurewebsites.net";

export const InstructionText = "Just enter the url for a spotify or apple music playlist, click convert, and we will generate a new playlist on your chosen destination service for free! No authentication required."
export const AppleMusicLibraryPlaylistValidationText = "An Apple Music library playlist is detected. Please make sure you are getting a catalog playlist instead. To ensure you are getting a catalog playlist, click \"Share\" and then \"Copy link to clipboard\"."
export const GenericValidationText = "Your url is not formatted properly. Please double check it and try again."

export enum URLExceptions {
    APPLE_MUSIC_LIBRARY_PLAYLIST
}