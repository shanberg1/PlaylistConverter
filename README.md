# Playlist Converter

This is a web application I developed to enable converting playlists between Apple Music and Spotify on the fly without requiring any authentication. This was achieved by using accounts owned by myself on each of the streaming services to host the playlists. After receiving a request, the web app will create a playlist on the streaming service of choice using a rudimentary matching algorithm to guess which songs should be added to the new playlist, then a publicly accessible url is returned to the user. 

Feel free to try it out at https://playlist-converter.azurewebsites.net/!




## State of the Project
Currently the project exists as a proof of concept.

To be more functional, the following improvements need to be made:
- Improve accuracy by improving the heuritics used to calculate song similarity.
- Improve usability by creating a more responsive UI including adding instructions, loading indicators, smart URL detection, and error handling.
- Improve performance by implementing a cache for song pairs.
- Scale up the number of Apple Music playlists that can be used to serve users.