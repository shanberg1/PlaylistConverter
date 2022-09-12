// TODO: Rename this file to be accurate
import {
    connection
} from "../app"

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;

export function getAppleMusicPlaylists(callback: (id: string) => any) {
    let playlistId: string;
    const request = new Request("SELECT TOP 1 * From [dbo].[apple_music_playlists] ORDER BY last_updated_time_utc DESC", function(err) {  
        if (err) {  
            console.log(err);
            callback("");
            return;
        }
        callback(playlistId);
    });  
    request.on('row', function(columns) {  
            // columns.forEach(function(column) {  
            //   if (column.value === null) {  
            //     console.log('NULL');  
            //   } else {  
            //     result+= column.value + " ";
            //     playlistId = column
            //   }  
            // });  
            // console.log(result);  
            // result ="";  
            playlistId = columns[3];
    });  
  
    request.on('done', function(rowCount, more) {  
         console.log(rowCount + ' rows returned');  
    });  
        
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);

}