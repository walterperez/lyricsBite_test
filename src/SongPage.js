import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import defImage from "./imageDef.png";
//import Loader from './Loader'
import "./songpage.css";

const SongPage = props => {
  const [lyric, setLyrics] = useState("");
  const [copyRight, setCopyright] = useState(null);
  const [artist, setArtist] = useState("");
  const [cover, setCover] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [albumId, setAlbumId] = useState("");

  const musixMatch =
    "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com";

  useEffect(() => {
    //I think I got it but I din't find so far on internet a good article or explanation about location
    const trackId =
      props.location && props.location.state
        ? props.location.state.trackId
        : "";
    const songTrack =
      props.location && props.location.state
        ? props.location.state.songName
        : "";
    const idAlbum =
      props.location && props.location.state
        ? props.location.state.albumId
        : "";

    if (!trackId && !songTrack && idAlbum) {
      return;
    }

    fetch(
      `${musixMatch}/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=05cfdc2fd066962f1151f02dc6c192e6`
    )
      .then(response => response.json())
      .then(data => {
        const words = data.message.body.lyrics;
        if (typeof words !== "undefined") {
          setLyrics(words.lyrics_body);
          setCopyright(words.lyrics_copyright);
        } else {
          return;
        }

        return fetch(
          `${musixMatch}/ws/1.1/track.search?q_track=${songTrack}&apikey=05cfdc2fd066962f1151f02dc6c192e6`
        )
          .then(res => res.json())
          .then(data => {
            const songName = data.message.body.track_list;
            setSongTitle(songName[0].track.track_name);

            return fetch(
              `${musixMatch}/ws/1.1/album.tracks.get?album_id=${idAlbum}&apikey=05cfdc2fd066962f1151f02dc6c192e6`
            )
              .then(res => res.json())
              .then(data => {
                const albumListSong = data.message.body.track_list;
                setAlbumId(albumListSong);
              });
          });
      });
  }, [props.location]);

  useEffect(() => {
    //I still don't get exactly what this is, it should prevent the memory leak..a sort of cleanup function?
    const abortControlledApi = new AbortController();
    const signal = abortControlledApi.signal;

    const album =
      props.location && props.location.state ? props.location.state.album : "";

    if (!album) {
      return;
    }
    const lastfm = `https://cors-anywhere.herokuapp.com/http://ws.audioscrobbler.com`;
    fetch(
      `${lastfm}/2.0/?method=album.search&album=${album}&api_key=92b9ede230c02e737653bbabc4da3313&format=json`,
      { signal: signal }
    )
      .then(res => res.json())
      .then(data => {
        const albumInfo = data.results.albummatches.album[0];
        if (typeof albumInfo !== "undefined") {
          setCover(albumInfo.image[3]["#text"]);
          setArtist(albumInfo.artist);
          setAlbumTitle(albumInfo.name);
        } else {
          setCover(defImage);
        }
      });

    return function cleanUp() {
      abortControlledApi.abort();
    };
  }, [props.location]);

  const getAlbumTracks = (idTrack, idAlbum) => {
    fetch(
      `${musixMatch}/ws/1.1/track.lyrics.get?track_id=${idTrack}&apikey=05cfdc2fd066962f1151f02dc6c192e6`
    )
      .then(res => res.json())
      .then(data => {
        const lyric = data.message.body.lyrics;
        if (typeof lyric !== "undefined") {
          setLyrics(lyric.lyrics_body);
          setCopyright(lyric.lyrics_copyright);
        } else {
          return;
        }

        return fetch(
          `${musixMatch}/ws/1.1/album.tracks.get?album_id=${idAlbum}&apikey=05cfdc2fd066962f1151f02dc6c192e6`
        )
          .then(res => res.json())
          .then(data => {
            const songName = data.message.body.track_list;
            setSongTitle(
              songName &&
                songName.map(item => {
                  return idTrack === item.track.track_id
                    ? item.track.track_name
                    : null;
                })
            );
          });
      });
  };

  return (
    <div className="song-box" id="top">
      <div className="song-title-card">
        <div className="song-text">
          <h1 className="song-title">{songTitle}</h1>
          <pre className="lyrics">
            {lyric !== ""
              ? lyric
              : copyRight === ""
              ? "no lyrics on the database"
              : copyRight}
          </pre>
          <button className="btn-get-song">Get your song via Email</button>

          <Link to="/">
            <button>Back to the HomePage</button>
          </Link>
        </div>
        <div className="cover-art">
          <img src={cover} alt="album cover" />
          <p className="cover-art-info">{artist}</p>
          <p className="cover-art-info">{albumTitle}</p>
          <ul className="record-tracks">
            {albumId &&
              albumId.map(song => {
                return (
                  <li
                    key={song.track.track_id}
                    onClick={() =>
                      getAlbumTracks(song.track.track_id, song.track.album_id)
                    }
                  >
                    {/* Is this the right way to prevent the error message? 
                    What I mean is that, if I write back the <a href='#'> tag it works 
                    but eslint highlight the tag in yellow with an error message into the console, 
                    to prevent that, I targeted the href to an id='top; so every time I click on a link 
                    the page go up again and at the same time I get rid of the error message. 
                    Guess what..it only works on my local environment and on my deploy on Zeit Now, 
                    except for code sandbox, isn't that weird?
                    There is even more if I set the onClick function inside the <li> tag, it works but 
                    no as well as for the local environment and the deploy.
                    You can try by clicking just outside the link and it will work 
                    but it will update only the lyrics but the <a> tag won't target the id='#top'
                    What's wrong with code sandbox or...what's wrong with me..am I missing something??
                      */}
                    <a href="#top">{song.track.track_name}</a>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SongPage;
