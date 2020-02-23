import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defImg from "../../static/imageDef.png";
import "./artistCard.css";

const ArtistCard = ({ track }) => {
  const [cover, setCover] = useState("");
  const { album_name, album_id, track_id, track_name, artist_name } = track;

  useEffect(() => {
    const basseUrl = `https://cors-anywhere.herokuapp.com/http://ws.audioscrobbler.com`;
    const endPoint = `/2.0/?method=album.search&album=${album_name}&api_key=92b9ede230c02e737653bbabc4da3313&format=json`;

    fetch(`${basseUrl}${endPoint}`)
      .then(res => res.json())
      .then(data => {
        const albumCover = data.results.albummatches.album[0].image[3]["#text"];
        setCover(albumCover);
      })
      .catch(err => console.log(err));
  }, [album_name]);

  return (
    <div className="card">
      {cover ? (
        <img src={cover} alt={`pic ${album_name} - ${artist_name}`} />
      ) : (
        <img src={defImg} alt="pic" />
      )}

      <Link
        className="card-link"
        to={{
          pathname: "/SongPage",
          state: {
            trackId: track_id,
            album: album_name,
            songName: track_name,
            albumId: album_id
          }
        }}
      >
        <p>{artist_name}</p>
        <p>{track_name}</p>
      </Link>
    </div>
  );
};

export default ArtistCard;
