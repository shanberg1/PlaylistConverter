const _debugMode = window.location.href.includes("localhost");
export const _backendUrl = _debugMode ? "http://localhost:3000" : "https://playlist-converter.azurewebsites.net";
