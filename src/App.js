import './App.css';
import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

function getMe(){
  spotifyApi.getMe();
}
const USER_ID = getMe();
console.log(USER_ID);

const params = getHashParams();
const token = params.access_token;

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
     e = r.exec(q);
  }
  return hashParams;
}

class App extends Component {
  constructor(){
    super();
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' , progress: 0},
    }
  }

  render() {
    return (
      <div className='App'>
        <a href='http://localhost:8888'> Login to Spotify </a>
      <div>
        Now Playing: { this.state.nowPlaying.name }
      </div>
      <div>
        Current Progress: { this.state.nowPlaying.progress }
      </div>
      <div>
        <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
      </div>
      { this.state.loggedIn &&
        <button onClick={() => this.getNowPlaying()}>
          Check Now Playing
        </button>
      }
        <button onClick={() => this.createPlaylist()}>
          Create Playlist
        </button>
    </div>
    );
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url,
              progress: response.progress_ms / 1000
            }
        });
      })
  }

  // creates a playlist
  createPlaylist(){
    // var url = "https://api.spotify.com/v1/users/" + USER_ID + "/playlists";
    var url = "https://api.spotify.com/v1/users/christing19/playlists";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
      }};
    
    var data = '{"name":"Festified!","description":"Time to get ready for your festival!","public":false}';
    
    xhr.send(data);
  }
}

export default App;
