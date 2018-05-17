import queryString from 'query-string';

const clientID = '959b4afcdfe3414bbe2488cadf59f42b';
const clientSecret = '56d4f2b093b0442d81233f47592dbf38';
const spotify_url = 'https://accounts.spotify.com/authorize'
const redirect_uri = 'http://localhost:3000/'

// Generate a random state for extra security.
const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz';
const index1 = Math.floor(Math.random() * alphanumeric.length);
const index2 = Math.floor(Math.random() * alphanumeric.length);
const index3 = Math.floor(Math.random() * alphanumeric.length);
const state = alphanumeric[index1] + alphanumeric[index2] + alphanumeric[index3];

const accessURL = `${spotify_url}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&state=${state}&redirect_uri=${redirect_uri}`
//const finalURL = `${redirect_uri}callback#access_token=${accessToken}&token_type=Bearer&expires_in=${expires}&state=${state}`

const Spotify = {
  getAccessToken() {
    let parsedToken = queryString.parse(window.location.href);
    let accessToken = parsedToken.access_token;
    let expires = parsedToken.expires_in;
    return accessToken;
  },

  getExpiration() {
    let parsedToken = queryString.parse(window.location.href);
    let expires = parsedToken.expires_in;
    return expires;
  },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      }
    })
  },

  savePlaylist(name, trackURIs) {
    if (name && trackURIs != []) {
      const accessToken = this.getAccessToken();
      let userID = null;
      let playlistID = null;
      fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      }).then(response => { response.json() }
      ).then(jsonResponse => {userID = jsonResponse.user_id});

      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        },
        method: 'POST',
        body: JSON.stringify({id: '200'})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        playlistID = jsonResponse.id
      });

      fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        },
        method: 'POST',
        body: JSON.stringify({id: '200'})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        playlistID = jsonResponse.id
      });
    } else {
      return;
    }
  }
}

export default Spotify;