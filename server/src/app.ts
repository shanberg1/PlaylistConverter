import * as request from "superagent";
const open = require('open')
import express = require('express');
const path = require('path')

// Investigate using spotify-types
// import * as SpotifyApi from "spotify-api"
// import * as AppleMusicApi from "apple-music-api"

import {
    getSpotifySong,
    postSpotifyPlaylist
} from "./Controllers/SpotifyController"

import {
    getAppleMusicSong,
    postApplePlaylist
} from "./Controllers/AppleMusicController"
import { createAppleMusicPlaylist } from "./Utils/AppleMusicFunctions";


var app = express();
var rs = require('jsrsasign');
const dotenv = require('dotenv');
dotenv.config();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

export var Connection = require('tedious').Connection;  

app.use('/', express.static(path.join(`${__dirname}`, '..', 'public')));

const _backendUrl = process.env.DEBUG_MODE === "true" ? "http://localhost:3000" : "https://playlist-converter.azurewebsites.net";

let _spotifyClientCert: string;
let _appleMusicSJWT: string;
let _spotifyAuthorizationCode: string;
let _spotifyAccessToken: string;
const _debugMode = process.env.DEBUG_MODE;
const _appleMusicUserToken = process.env.APPLE_MUSIC_USER_TOKEN;
const _appleDeveloperToken = process.env.APPLE_MUSIC_DEV_TOKEN;
const _appleMusicSecretToken = process.env.APPLE_MUSIC_SECRET_USER_TOKEN;

export {
    _spotifyClientCert,
    _spotifyAccessToken,
    _appleMusicSJWT,
    _spotifyAuthorizationCode,
    _appleMusicUserToken,
     _appleDeveloperToken,
    _appleMusicSecretToken
}

init();
function init() {
    // get spotify client cert
    request
        .post("https://accounts.spotify.com/api/token")
        .send({ grant_type: "client_credentials" })
        .set('Authorization', 'Basic ' + process.env.SPOTIFY_ENCODED_ID)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((err, result) => {
            if (err) {
                console.log("Error retrieving client certificate" + err);
            }
            if (result) {
                _spotifyClientCert = result.body.access_token;
            }
        });

    // get apple music jwt
    // Header
    var oHeader = { alg: "ES256", kid: "T74ZSVYMKM" };
    // Payload
    var oPayload: any = {};
    var tNow = rs.KJUR.jws.IntDate.get('now');
    var tEnd = rs.KJUR.jws.IntDate.get('now + 1month');
    oPayload.iss = "948C3QY783";
    oPayload.iat = tNow;
    oPayload.exp = tEnd;
    // Sign JWT, password=APPLE_MUSIC_PRIVATE_KEY
    var sHeader = JSON.stringify(oHeader);
    var sPayload = JSON.stringify(oPayload);
    _appleMusicSJWT = rs.KJUR.jws.JWS.sign
        (null, sHeader, sPayload, process.env.APPLE_MUSIC_PRIVATE_KEY);
    refreshSpotifyAccessToken();
}

function refreshSpotifyAccessToken() {
    // get spotify token
    console.log("Attempting to retrieve spotify access token")
    request
    .post("https://accounts.spotify.com/api/token")
    .send({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
    })
    .set('Authorization', 'Basic ' + process.env.SPOTIFY_ENCODED_ID)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .end((err, result) => {
        if (err) {
            console.log("Error retrieving auth code" + err);
        }
        if (result) {
            console.log("successfully refreshed spotify access token");
            _spotifyAccessToken = result.body.access_token;
        }
    });

    setInterval(function() {
        refreshSpotifyAccessToken();
    }, 3600000);
}

export const getAuthenticateWithSpotifyCallback = (req, res) => {
    _spotifyAuthorizationCode = req.query["code"].toString();
    console.log("spotify callback")
    request
        .post("https://accounts.spotify.com/api/token")
        .set("Authorization", "Basic " + process.env.SPOTIFY_ENCODED_ID)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
        .send('grant_type=authorization_code')
        .send('code=' + _spotifyAuthorizationCode)
        .send(`redirect_uri=${_backendUrl}/authentication/spotify`)
        .then((value) => {
            return value.body;
        }).then((data) => {
            console.log("successful token getting for spotify");
            _spotifyAccessToken = data.access_token;
            if (_debugMode) {
                res.redirect(`${_backendUrl}/root.html`)
            }
        })
        .catch(err => {
            console.log(err);
        });
}


// TODO: refactor to some tools file or something
async function createAppleMusicPlaylists(numberOfPlaylists: number) {
    for (let i = 1; i <= numberOfPlaylists; i++) {
        await createAppleMusicPlaylist("us", {
            name: `CreatedByPlaylistConverter${i}`,
            tracks: null
        })
    }
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', '/root.html'));
});
app.get('/authentication/spotify', getAuthenticateWithSpotifyCallback);
app.get('/echo', (req, res) => {
    res.send("hello, passive")
})
app.get('/service/spotify/song', getSpotifySong);
app.get('/service/applemusic/song', getAppleMusicSong);
app.post('/service/spotify/playlist', jsonParser, postSpotifyPlaylist);
app.post('/service/applemusic/playlist', jsonParser, postApplePlaylist);

console.log(app._router.stack)

app.listen(process.env.PORT || 3000)