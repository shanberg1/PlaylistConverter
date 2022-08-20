(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.convertPlaylist = exports.destinationServiceSelect = exports.sourceServiceSelect = void 0;
var RequestModel_1 = require("../../server/src/Models/RequestModel");
document.querySelector("#convertPlaylistButton").addEventListener("click", convertPlaylist);
document.querySelector("#sourceService").addEventListener("change", sourceServiceSelect);
document.querySelector("#destinationService").addEventListener("change", destinationServiceSelect);
var sourceSelect = getElement("sourceService");
var destinationSelect = getElement("destinationService");
var convertButton = getElement("convertPlaylistButton");
main();
var _debugMode = window.location.href.includes("localhost");
var _backendUrl = _debugMode ? "http://localhost:3000" : "https://playlist-converter.azurewebsites.net";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sourceApple, sourceSpotify, destinationApple, destinationSpotify;
        return __generator(this, function (_a) {
            sourceApple = document.createElement("option");
            sourceApple.value = RequestModel_1.Services.Apple;
            sourceApple.text = "Apple";
            sourceSpotify = document.createElement("option");
            sourceSpotify.value = RequestModel_1.Services.Spotify;
            sourceSpotify.text = "Spotify";
            sourceSpotify.disabled = true;
            destinationApple = document.createElement("option");
            destinationApple.value = RequestModel_1.Services.Apple;
            destinationApple.text = "Apple";
            destinationApple.disabled = true;
            destinationSpotify = document.createElement("option");
            destinationSpotify.value = RequestModel_1.Services.Spotify;
            destinationSpotify.text = "Spotify";
            sourceSelect.appendChild(sourceApple);
            sourceSelect.appendChild(sourceSpotify);
            destinationSelect.appendChild(destinationSpotify);
            destinationSelect.appendChild(destinationApple);
            return [2 /*return*/];
        });
    });
}
function sourceServiceSelect() {
    console.log("source select");
    convertButton.disabled = sourceSelect.value === destinationSelect.value;
}
exports.sourceServiceSelect = sourceServiceSelect;
function destinationServiceSelect() {
    console.log("destination select");
    convertButton.disabled = sourceSelect.value === destinationSelect.value;
}
exports.destinationServiceSelect = destinationServiceSelect;
function convertPlaylist() {
    var playlisturl = getElement("playlistUrl").value;
    var destEndpoint = destinationSelect.value === RequestModel_1.Services.Apple ? "applemusic" : "spotify";
    return fetch(_backendUrl + "/service/" + destEndpoint + "/playlist", {
        method: "POST",
        body: JSON.stringify({
            service: sourceSelect.value,
            id: sourceSelect.value === RequestModel_1.Services.Apple ? getAppleMusicPlaylistId(playlisturl) : getSpotifyPlaylistId(playlisturl),
            region: "us" // FIXME
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (res) {
        return res.json();
    }).then(function (data) {
        var newPlaylist = getElement("newPlaylistUrl");
        newPlaylist.value = data.url;
        return data;
    });
}
exports.convertPlaylist = convertPlaylist;
function getElement(element) {
    return document.getElementById(element);
}
// TODO: actually implement good logic
function getAppleMusicRegion(url) {
    return url.split("/")[3];
}
// TODO: actually implement good logic
function getAppleMusicPlaylistId(url) {
    return url.split("/")[6];
}
// TODO: actually implement good logic
function getSpotifyPlaylistId(url) {
    return url.split("/")[4];
}

},{"../../server/src/Models/RequestModel":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Services = void 0;
var Services;
(function (Services) {
    Services["Apple"] = "AppleMusic";
    Services["Spotify"] = "Spotify";
})(Services = exports.Services || (exports.Services = {}));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcm9vdC50cyIsIi4uL3NlcnZlci9zcmMvTW9kZWxzL1JlcXVlc3RNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0NBLHFFQUU2QztBQUU3QyxRQUFRLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzVGLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUN6RixRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLHdCQUF3QixDQUFDLENBQUM7QUFDbkcsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pELElBQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDM0QsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDMUQsSUFBSSxFQUFFLENBQUM7QUFFUCxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDOUQsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsOENBQThDLENBQUM7QUFFMUcsU0FBZSxJQUFJOzs7O1lBQ1QsV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsV0FBVyxDQUFDLEtBQUssR0FBRyx1QkFBUSxDQUFDLEtBQUssQ0FBQztZQUNuQyxXQUFXLENBQUMsSUFBSSxHQUFHLE9B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QTBCLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFFLENBQUM7QUFDaEUsQ0FBQztBQUVELHNDQUFzQztBQUN0QyxTQUFTLG1CQUFtQixDQUFDLEdBQVc7SUFDcEMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxzQ0FBc0M7QUFDdEMsU0FBUyx1QkFBdUIsQ0FBQyxHQUFXO0lBQ3hDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRUQsc0NBQXNDO0FBQ3RDLFNBQVMsb0JBQW9CLENBQUMsR0FBVztJQUNyQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQzs7Ozs7O0FDdkZELElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQixnQ0FBb0IsQ0FBQTtJQUNwQiwrQkFBbUIsQ0FBQTtBQUN2QixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyBBcHBsZU11c2ljQXBpIGZyb20gXCJhcHBsZS1tdXNpYy1hcGlcIlxuaW1wb3J0IHtcbiAgICBTZXJ2aWNlc1xufSBmcm9tIFwiLi4vLi4vc2VydmVyL3NyYy9Nb2RlbHMvUmVxdWVzdE1vZGVsXCJcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb252ZXJ0UGxheWxpc3RCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNvbnZlcnRQbGF5bGlzdCk7XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NvdXJjZVNlcnZpY2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBzb3VyY2VTZXJ2aWNlU2VsZWN0KTtcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzdGluYXRpb25TZXJ2aWNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZGVzdGluYXRpb25TZXJ2aWNlU2VsZWN0KTtcbmNvbnN0IHNvdXJjZVNlbGVjdCA9IGdldEVsZW1lbnQoXCJzb3VyY2VTZXJ2aWNlXCIpO1xuY29uc3QgZGVzdGluYXRpb25TZWxlY3QgPSBnZXRFbGVtZW50KFwiZGVzdGluYXRpb25TZXJ2aWNlXCIpO1xuY29uc3QgY29udmVydEJ1dHRvbiA9IGdldEVsZW1lbnQoXCJjb252ZXJ0UGxheWxpc3RCdXR0b25cIik7XG5tYWluKCk7XG5cbmNvbnN0IF9kZWJ1Z01vZGUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImxvY2FsaG9zdFwiKTtcbmNvbnN0IF9iYWNrZW5kVXJsID0gX2RlYnVnTW9kZSA/IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIgOiBcImh0dHBzOi8vcGxheWxpc3QtY29udmVydGVyLmF6dXJld2Vic2l0ZXMubmV0XCI7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgY29uc3Qgc291cmNlQXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIHNvdXJjZUFwcGxlLnZhbHVlID0gU2VydmljZXMuQXBwbGU7XG4gICAgc291cmNlQXBwbGUudGV4dCA9IFwiQXBwbGVcIjtcblxuICAgIGNvbnN0IHNvdXJjZVNwb3RpZnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIHNvdXJjZVNwb3RpZnkudmFsdWUgPSBTZXJ2aWNlcy5TcG90aWZ5O1xuICAgIHNvdXJjZVNwb3RpZnkudGV4dCA9IFwiU3BvdGlmeVwiO1xuICAgIHNvdXJjZVNwb3RpZnkuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgZGVzdGluYXRpb25BcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgZGVzdGluYXRpb25BcHBsZS52YWx1ZSA9IFNlcnZpY2VzLkFwcGxlO1xuICAgIGRlc3RpbmF0aW9uQXBwbGUudGV4dCA9IFwiQXBwbGVcIjtcbiAgICBkZXN0aW5hdGlvbkFwcGxlLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGRlc3RpbmF0aW9uU3BvdGlmeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgZGVzdGluYXRpb25TcG90aWZ5LnZhbHVlID0gU2VydmljZXMuU3BvdGlmeTtcbiAgICBkZXN0aW5hdGlvblNwb3RpZnkudGV4dCA9IFwiU3BvdGlmeVwiO1xuXG4gICAgc291cmNlU2VsZWN0LmFwcGVuZENoaWxkKHNvdXJjZUFwcGxlKTtcbiAgICBzb3VyY2VTZWxlY3QuYXBwZW5kQ2hpbGQoc291cmNlU3BvdGlmeSk7XG4gICAgZGVzdGluYXRpb25TZWxlY3QuYXBwZW5kQ2hpbGQoZGVzdGluYXRpb25TcG90aWZ5KTtcbiAgICBkZXN0aW5hdGlvblNlbGVjdC5hcHBlbmRDaGlsZChkZXN0aW5hdGlvbkFwcGxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvdXJjZVNlcnZpY2VTZWxlY3QoKSB7XG4gICAgY29uc29sZS5sb2coXCJzb3VyY2Ugc2VsZWN0XCIpO1xuICAgIGNvbnZlcnRCdXR0b24uZGlzYWJsZWQgPSBzb3VyY2VTZWxlY3QudmFsdWUgPT09IGRlc3RpbmF0aW9uU2VsZWN0LnZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdGluYXRpb25TZXJ2aWNlU2VsZWN0KCkge1xuICAgIGNvbnNvbGUubG9nKFwiZGVzdGluYXRpb24gc2VsZWN0XCIpXG4gICAgY29udmVydEJ1dHRvbi5kaXNhYmxlZCA9IHNvdXJjZVNlbGVjdC52YWx1ZSA9PT0gZGVzdGluYXRpb25TZWxlY3QudmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UGxheWxpc3QoKSB7XG4gICAgY29uc3QgcGxheWxpc3R1cmwgPSBnZXRFbGVtZW50KFwicGxheWxpc3RVcmxcIikudmFsdWU7XG4gICAgY29uc3QgZGVzdEVuZHBvaW50ID0gZGVzdGluYXRpb25TZWxlY3QudmFsdWUgPT09IFNlcnZpY2VzLkFwcGxlID8gXCJhcHBsZW11c2ljXCIgOiBcInNwb3RpZnlcIjtcbiAgICByZXR1cm4gZmV0Y2goYCR7X2JhY2tlbmRVcmx9L3NlcnZpY2UvJHtkZXN0RW5kcG9pbnR9L3BsYXlsaXN0YCxcbiAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlOiBzb3VyY2VTZWxlY3QudmFsdWUsXG4gICAgICAgICAgICAgICAgaWQ6IHNvdXJjZVNlbGVjdC52YWx1ZSA9PT0gU2VydmljZXMuQXBwbGUgPyBnZXRBcHBsZU11c2ljUGxheWxpc3RJZChwbGF5bGlzdHVybCkgOiBnZXRTcG90aWZ5UGxheWxpc3RJZChwbGF5bGlzdHVybCksXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBcInVzXCIgLy8gRklYTUVcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UGxheWxpc3QgPSBnZXRFbGVtZW50KFwibmV3UGxheWxpc3RVcmxcIik7XG4gICAgICAgICAgICBuZXdQbGF5bGlzdC52YWx1ZSA9IGRhdGEudXJsO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pXG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnQoZWxlbWVudDogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCB7XG4gICAgcmV0dXJuICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KSk7XG59XG5cbi8vIFRPRE86IGFjdHVhbGx5IGltcGxlbWVudCBnb29kIGxvZ2ljXG5mdW5jdGlvbiBnZXRBcHBsZU11c2ljUmVnaW9uKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJsLnNwbGl0KFwiL1wiKVszXTtcbn1cblxuLy8gVE9ETzogYWN0dWFsbHkgaW1wbGVtZW50IGdvb2QgbG9naWNcbmZ1bmN0aW9uIGdldEFwcGxlTXVzaWNQbGF5bGlzdElkKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJsLnNwbGl0KFwiL1wiKVs2XTtcbn1cblxuLy8gVE9ETzogYWN0dWFsbHkgaW1wbGVtZW50IGdvb2QgbG9naWNcbmZ1bmN0aW9uIGdldFNwb3RpZnlQbGF5bGlzdElkKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJsLnNwbGl0KFwiL1wiKVs0XTtcbn0iLCJleHBvcnQgaW50ZXJmYWNlIFBsYXlsaXN0SW5mbyB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHRyYWNrczogc3RyaW5nW107XG59XG5cbmV4cG9ydCBlbnVtIFNlcnZpY2VzIHtcbiAgICBBcHBsZSA9IFwiQXBwbGVNdXNpY1wiLFxuICAgIFNwb3RpZnkgPSBcIlNwb3RpZnlcIlxufSJdfQ==
