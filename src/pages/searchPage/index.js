import React, { useState } from "react";
import ArtistCard from "../../components/ArtistCard";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import "./searchPage.css";

const SearchBar = () => {
  const [trackList, setTrackList] = useState([]);
  const [trackTitle, setTrackTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("q_artist");

  const getTrack = e => {
    e.preventDefault();
    const musixMatch =
      "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com";

    const restUrl = `/ws/1.1/track.search?${query}=${trackTitle}&page_size=4&page=1&f_has_lyrics=1&s_track_rating=desc&apikey=05cfdc2fd066962f1151f02dc6c192e6`;

    setIsLoading(true);

    fetch(`${musixMatch}${restUrl}`)
      .then(response => response.json())
      .then(data => {
        const info = data.message.body.track_list;
        setTrackList(info);
        setIsLoading(false);
      });
    setTrackTitle("");
  };

  const handleChange = e => {
    setTrackTitle(e.target.value);
  };

  const getLyricsSelected = e => {
    const newValue = e.target.value;
    if (newValue === "q_lyrics") {
      setQuery(newValue);
    } else if (newValue === "q_track") {
      setQuery(newValue);
    } else {
      setQuery(newValue);
    }
  };

  return (
    <div className="search-bar">
      <Header />
      <div className="field">
        <form className="form-u" onSubmit={getTrack}>
          <label>Search a Song</label>
          <select value={query} onChange={getLyricsSelected}>
            <option value="q_artist">By Artist</option>
            <option value="q_track">By Song</option>
            <option value="q_lyrics">By Word</option>
          </select>

          <input
            text="text"
            name="trackTitle"
            autoComplete="on"
            placeholder="search..."
            value={trackTitle}
            onChange={handleChange}
          />
          <button type="submit">Get Songs</button>
        </form>
      </div>
      <div className="grid track">
        {isLoading ? (
          <Loader />
        ) : (
          trackList &&
          trackList.map(name => {
            return <ArtistCard key={name.track.track_id} track={name.track} />;
          })
        )}
      </div>
    </div>
  );
};

export default SearchBar;
