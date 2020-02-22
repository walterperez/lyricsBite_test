import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defImg from "./imageDef.png";
import "./artistcard.css";

const ArtistCard = ({ track }) => {
  const [cover, setCover] = useState("");

  useEffect(() => {
    let name = track.album_name;

    const lastfm = `https://cors-anywhere.herokuapp.com/http://ws.audioscrobbler.com`;
    const lastfm2 = `/2.0/?method=album.search&album=${name}&api_key=92b9ede230c02e737653bbabc4da3313&format=json`;

    fetch(`${lastfm}${lastfm2}`)
      .then(res => res.json())
      .then(data => {
        const albumCover = data.results.albummatches.album[0].image[3]["#text"];
        setCover(albumCover);
      })
      .catch(err => console.log(err));
  }, [track.album_name]);

  return (
    <div className="card">
      {cover ? <img src={cover} alt="pic" /> : <img src={defImg} alt="pic" />}

      <Link
        className="card-link"
        to={{
          pathname: "/SongPage",
          state: {
            trackId: track.track_id,
            album: track.album_name,
            songName: track.track_name,
            albumId: track.album_id
          }
        }}
      >
        <p>{track.artist_name}</p>
        <p>{track.track_name}</p>
      </Link>
    </div>
  );
};

export default ArtistCard;
