const _debugMode = window.location.href.includes("localhost");
export const _backendUrl = _debugMode ? "http://localhost:3000" : "https://playlist-converter.azurewebsites.net";

export const InstructionText = "Just enter the url for a spotify or apple music playlist, click convert, and we will generate a new playlist on your chosen destination service for free! No authentication required."