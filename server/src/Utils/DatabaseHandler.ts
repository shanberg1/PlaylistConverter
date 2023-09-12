// TODO: Rename this file to be accurate
import {
    Connection
} from "../app"

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
var isConnectionReady = true;

export async function getOldestAppleMusicPlaylist(): Promise<string> {
    // connect to db
    var config = {  
        server: process.env.DB_SERVER,
        authentication: {
            type: 'default',
            options: {
                userName: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD 
            }
        },
        options: {
            encrypt: true,
            database: process.env.DB_DATABASENAME
        }
    };  
    var connection = new Connection(config);  
    return new Promise<string>((resolve, reject) => {
        const playlistCallback = (id: string) => resolve(id);
        getAppleMusicPlaylists(connection, playlistCallback);
        setTimeout(() => reject("Timeout"), 5000);
    });
}

function getAppleMusicPlaylists(connection: any, callback: (id: string) => any) {
    let playlistId: string;
    let id: string;
    const request = new Request("SELECT TOP 1 * From [dbo].[apple_music_playlists] ORDER BY last_updated_time_utc ASC", function(err) {  
        if (err) {  
            console.log(err);
            return;
        }
        updateIdInPlaylistRetrieved(connection, callback, playlistId, id)
    });
    request.on('row', function(columns) {  
            playlistId = columns[3].value;
            id=columns[0].value;
    });  
  
    request.on('done', function(rowCount, more) {  
         console.log(rowCount + ' rows returned');  
    });  

    connection.connect();

    connection.on('debug', function(message) { 
        console.log('debug:', message);
    });

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            throw err;
        }
        // If no error, then good to proceed.
        console.log("Connected");  
        connection.execSql(request);
    });
}

function updateIdInPlaylistRetrieved(connection: any, callback: (id: string) => any, playlistId: string, id: string) {
    const sql = `UPDATE [dbo].[apple_music_playlists] SET id=${id} WHERE id=${id};`;

    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.log('Insert failed');
        throw err;
      }

      callback(playlistId);
      connection.close();
    });

  
    connection.execSql(request);
}