import './App.css';
import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
// for commit

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
        <button onClick={() => this.playlistActions()}>
          Create Playlist
        </button>
    </div>
    );
  }

  playlistActions(){
    let person = prompt("Please enter an artist");
    searchArtists(person);
    createPlaylist();
    getPlaylist();  
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
}

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

function searchArtists(artist){
  var artistID;
  fetch("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },  
    method: "GET"
  })
  .then(response => response.json())
  .then(responseJSON => {
      artistID = responseJSON.artists.items[0].uri.substring(15);
      getTracks(artistID);
  });
};

function createPlaylist(){
  var url = "https://api.spotify.com/v1/me/playlists";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  
  var data = '{"name":"Festified!","description":"Time to get ready for your festival!","public":true}';
  xhr.send(data);
  alert('Spotify Playlist Created!');
}

function getPlaylist(){
  var playlistID;
  fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: "Bearer " + token,
    },
    method: "GET"
  })     
  .then(response => response.json())
  .then(responseJSON => {
    playlistID = responseJSON.items[0].uri.substring(17);
    addTrack(playlistID, tracks[0]);
    addTrack(playlistID, tracks[1]);
    addTrack(playlistID, tracks[2]);
  });
};

const tracks = [];
function getTracks(artist){
  fetch("https://api.spotify.com/v1/artists/" + artist + "/top-tracks?market=US", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    method: "GET"
  })     
  .then(response => response.json())
  .then(responseJSON => {
    var track1 = responseJSON.tracks[0].uri.substring(14);
    var track2 = responseJSON.tracks[1].uri.substring(14);
    var track3 = responseJSON.tracks[2].uri.substring(14);

    tracks.push(track1);
    tracks.push(track2);
    tracks.push(track3);
  });
};

function addTrack(playlist, track) {
  fetch("https://api.spotify.com/v1/playlists/" + playlist + "/tracks?uris=spotify%3Atrack%3A" + track, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    method: "POST"
  })
}

export default App;