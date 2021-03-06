import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList'

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.playlistName,
      tracks: this.props.playlistTracks
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    const name = event.target.value;
    this.props.onNameChange(name);
  }

  render() {
    return(
    <div className="Playlist">
      <input value={this.props.playlistName} onChange={this.handleNameChange} />
      <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
      <a className="Playlist-save" onClick={this.props.onSave} >SAVE TO SPOTIFY</a>
    </div>
  );
 }
}

export default Playlist;
